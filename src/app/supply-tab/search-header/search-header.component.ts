import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import { ItemView, DeviceCommon } from '../../share/device-common';
import { Device } from '../../share/device.model';
import { Stock } from '../../share/stock.model';
import { StockService, StockHouse } from '../../share/stock.service';
import { DeviceEventService } from '../../share/device-event.service';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('deviceTerm', { static: true }) deviceTerm: string;
  @Input() deviceChanged = new BehaviorSubject<any>({});
  @Output() termChanged = new EventEmitter<string>();

  private subscription = new Subscription;
  private _stockHouse: StockHouse;
  private selectedDevice: Device;
  private selectedStock: Stock;
  private isDeviceAndSotckSelected: boolean = false;
  itemViewArr = new BehaviorSubject<ItemView[]>([]);

  constructor(
    private common: DeviceCommon,
    private stockService: StockService,
    private dEventService: DeviceEventService
  ) { }

  ngOnInit() {
    this.subscription = this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);
    });
    this.subscription.add(
      this.deviceChanged.subscribe(device => {
        if (this._stockHouse && this._stockHouse.stockHouse.length) {
          this.selectedDevice = device;
          this.setItemView(device.name);
          this.deviceTerm = device.serialNumber.split('-').pop();
          if (!device.isChecked) {
            this.reset(device);
          }
        }
      })
    )
  }

  emitFilterTerm(term: string) {
    if (this.selectedStock) {
      this.selectedStock = null;
      this.isDeviceAndSotckSelected = false;
    }
    this.termChanged.emit(term);
    if (this.selectedDevice) {
      this.setItemView(this.selectedDevice.name);
    }
  }

  selectStock(title) {
    let _stock: Stock;
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, this.selectedDevice.name)) {
        this.selectedStock = stockRoom.stockArray.find(stock => {
          return this.common.isSameName(stock.name, title) || stock.alias.some(alias => this.common.isSameName(alias, title))
        })
      }
    })
  }

  changeSandMode(title: string) {
    if (title && title.length) {
      this.selectStock(title);
      this.isDeviceAndSotckSelected = true;
    } else {
      this.isDeviceAndSotckSelected = false;
    }
  }

  setItemView(name: string) {
    const _temp: ItemView[] = [];
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, name)) {
        for (const stock of stockRoom.stockArray) {
          let _tempArr = [];
          if (stock.alias && stock.alias.length) {
            _tempArr = [...stock.alias];
          }
          _temp.push(new ItemView(stock.name, _tempArr));
        }
      }
    })
    this.itemViewArr.next(_temp);
  }

  supplySotck() {
    if (this.selectedDevice && this.selectedStock) {
      console.log(this.selectedDevice, this.selectedStock);
      this.reset(this.selectedDevice);
      this.dEventService.supplyStock(this.selectedDevice, this.selectedStock).subscribe(a => {
      })
    }
  }

  reset(device: any) {
    this.selectedDevice = null;
    this.selectedStock = null;
    this.deviceTerm = ''; // 자동으로 device 리스트 초기화 trigger함
    this.isDeviceAndSotckSelected = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
