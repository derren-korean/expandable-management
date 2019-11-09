import { Component, OnDestroy, OnInit } from '@angular/core';

import { Device } from '../share/device.model';
import { DeviceCommon, SupplyData, ItemView } from '../share/device-common';
import { GroupedDevice } from '../share/grouped-device.model'
import { GroupedDeviceService } from '../share/grouped-device.service';
import { DeviceEventService } from '../share/device-event.service';
import { BehaviorSubject } from 'rxjs';
import { SupplyTabService } from './supply-tab.service';
import { StockService } from '../share/stock.service';

@Component({
  selector: 'app-supply-tab',
  templateUrl: 'supply-tab.page.html',
  styleUrls: ['supply-tab.page.scss']
})
export class SupplyTabPage implements OnInit {

  itemViewArr = new BehaviorSubject<ItemView[]>([]);
  selectedDevice = null;

  constructor(
    private supplyTabService: SupplyTabService,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.supplyTabService.changeDevice().subscribe((device) => {
      this.selectedDevice = device;
      if (device) {
        this.setItemView(device.name);
      }
    })
    this.supplyTabService.changeTerm().subscribe(term => {
      this.setItemView(this.selectedDevice);
    })
  }

  setItemView(name: string) {
    const _temp: ItemView[] = [];
    this.stockService.getStocks(name).subscribe(room => {
      for (const stock of room.stockArray) {
        let _tempArr = [];
        if (stock.alias && stock.alias.length) {
          _tempArr = [...stock.alias];
        }
        _temp.push(new ItemView(stock.name, _tempArr));
      }
      this.itemViewArr.next(_temp);
    })
  }

  setStock(stockTitle: string) {
    this.supplyTabService.setStockTitle(stockTitle);
  }

}
