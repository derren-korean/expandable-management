import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { SupplyTabService, DeviceView } from '../supply-tab.service';
import { StockService } from '../../share/stock.service';
import { ItemView } from '../../share/device-common';
import { Stock } from 'src/app/share/stock.model';

@Component({
  selector: 'app-stock-select',
  templateUrl: './stock-select.component.html',
  styleUrls: ['./stock-select.component.scss'],
})
export class StockSelectComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  stockItemViewArr = new BehaviorSubject<ItemView[]>([]);
  selectedDevice:DeviceView = null;
  selectedStock:Stock = null;
  searchbarSize:number = 12;
  counterSize:number = 0;

  constructor(
    private supplyTabService: SupplyTabService,
    private stockService: StockService
  ) { }

  // 검색 조건이 변경시, stock은 보이지 않도록 한다.
  // 장비가 선택된 경우에만 stock이 보인다.

  hasSelectedDeviceNumber = (serialNumber) => serialNumber.length === 4 && this.selectedDevice && this.selectedDevice.getLastSerialNumber() === serialNumber

  ngOnInit() {
    this.subscription = this.supplyTabService.term.subscribe(term => {
      // 선택하지 않았을 수 있음. (selectedDevice는 이전에 선택한 장비일 수 있음.)
      if (this.hasSelectedDeviceNumber(term)) {
        return;
      }
      this.selectedDevice = null;
      this.setStockItemView(null);
    }).add(
      this.supplyTabService.device.subscribe((device) => {
        this.selectedDevice = device;
        if (device) {
          this.setStockItemView(device.name);
        }
      })
    ).add(
      this.supplyTabService.stock.subscribe(stock => {
        if (stock) {
          this._setViewSize(9, 3);
        } else {
          this._setViewSize(12, 0);
        }
        this.selectedStock = stock;
      })
    )
  }
    setStockItemView(DeviceName: string) {
      const _temp: ItemView[] = [];
      this.stockService.getStocks(DeviceName).subscribe(room => {
        for (const stock of room.stockArray) {
          let _tempArr = [];
          if (stock.alias && stock.alias.length) {
            _tempArr = [...stock.alias];
          }
          _temp.push(new ItemView(stock.name, _tempArr));
        }
      })
      this.stockItemViewArr.next(_temp);
    }
  
    // selected by user
    setStock(stockTitle: string) {
      this.supplyTabService.setStockTitle(stockTitle);
    }

    // not selected just searching
    // bug when typed full right word ex) 샘플트랩; stock must be selected! but autocomplete should not be removed.
    clearStock(ev: any) {
      this.supplyTabService.setStockTitle(ev.target.value);
    }
  
    _setViewSize(searchBar:number, counter:number) {
      this.searchbarSize = searchBar;
      this.counterSize = counter;
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
  }
