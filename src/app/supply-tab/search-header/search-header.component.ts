import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { DeviceCommon} from '../../share/device-common';
import { Device } from '../../share/device.model';
import { Stock } from '../../share/stock.model';
import { StockService, StockHouse } from '../../share/stock.service';
import { SupplyTabService } from '../supply-tab.service';

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

  constructor(
    private common: DeviceCommon,
    private stockService: StockService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.subscription = this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);

      this.subscription.add(
        this.supplyTabService.changeDevice().subscribe(device => {
          if (device && this._stockHouse && this._stockHouse.stockHouse.length) {
            this.selectedDevice = device;
            this.deviceTerm = device.serialNumber.split('-').pop();
            if (!device.isChecked) {
              this.reset(device);
            }
          }
        })
      )
    });
    this.subscription.add(
      this.supplyTabService.changeStockTitle().subscribe(title => {
        this.selectStock(title);
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
    if (!stockTitle || !stockTitle.length) {
      this.selectedStock = null;
      return;
    }
    this.selectedStock = this._getStock(stockTitle)
  }

  private _getStock(title: string) {
    let stock: Stock = null;
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, this.selectedDevice.name)) {
        stock = stockRoom.stockArray.find(stock => {
          return this.common.isSameName(stock.name, title) || stock.alias.some(alias => this.common.isSameName(alias, title))
        })
        if (stock) return false;
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
