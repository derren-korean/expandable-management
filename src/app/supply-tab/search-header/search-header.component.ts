import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DeviceCommon} from '../../share/device-common';
import { Device } from '../../share/device.model';
import { Stock } from '../../share/stock.model';
import { StockService, StockHouse } from '../../share/stock.service';
import { SupplyTabService, DeviceView } from '../supply-tab.service';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements OnInit, OnDestroy {

  // ionChange로 값을 변경할 때마다 stockService로 emit
  @ViewChild('deviceTerm', { static: true }) deviceTerm: string;

  private subscription = new Subscription;
  private _stockHouse: StockHouse;
  selectedDevice: Device = null;
  selectedStock: Stock = null;
  stockCount: number = 1;

  constructor(
    private common: DeviceCommon,
    private stockService: StockService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.subscription = this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);

      this.subscription.add(
        this.supplyTabService.device.subscribe((device: DeviceView) => {
          if (device && this._stockHouse && this._stockHouse.stockHouse.length) {
            this.selectedDevice = device;
            this.deviceTerm = device.getLastSerialNumber();
            if (!device.isChecked) {
              this.reset(device);
            }
          }
        })
      )
    }).add(
      this.supplyTabService.stockTitle.subscribe(title => {
        this.selectStock(title);
      })
    ).add(
      this.supplyTabService.stockCount.subscribe(count => {
        this.stockCount = count;
      })
    )
  }

  emitFilterTerm(term: string) {
    // etd 한정으로 쓰이는 조건. 선택된 장비가 없음에도 자동완성 창이 뜨는 버그
    if (term.length < 4) {
      this.selectedDevice = null;
    }
    this.selectedStock = null;
    this.supplyTabService.setTerm(term);
  }

  selectStock(stockTitle: string) {
    this.selectedStock = this._getStock(stockTitle);
    this.supplyTabService.setStock(this.selectedStock);
  }

  private _getStock(title: string) {
    let stock: Stock = null;
    if (!this.selectedDevice || !title) {return stock;}
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, this.selectedDevice.name)) {
        stock = stockRoom.stockArray.find(_stock => {
          return this.common.isSameName(_stock.name, title) || (_stock.alias ? _stock.alias.some(_alias => this.common.isSameName(_alias, title)) : false);
        })
        if (stock) {return false};
      }
    })
    return stock;
  }

  reset(device: any) {
    this.selectedStock = null;
    this.selectedDevice = null;
    this.deviceTerm = ''; // 자동으로 device 리스트 초기화 trigger함
  }

  supplySotck() {
    this.supplyTabService.saveSupply(this.selectedDevice, this.selectedStock);
    this.reset(this.selectedDevice);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
