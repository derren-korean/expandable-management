import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { SupplyTabService, DeviceView } from '../supply-tab.service';
import { StockService, StockHouse } from '../../share/stock.service';
import { ItemView, DeviceCommon } from '../../share/device-common';
import { Stock } from 'src/app/share/stock.model';

@Component({
  selector: 'app-stock-select',
  templateUrl: './stock-select.component.html',
  styleUrls: ['./stock-select.component.scss'],
})
export class StockSelectComponent implements OnInit, OnDestroy {
  // device가 선택된 경우에만 작동한다.
  private subscription: Subscription;
  private _stockHouse: StockHouse;
  
  stockItemViewArr = new BehaviorSubject<ItemView[]>([]);
  _selectedDevice: DeviceView = null;
  selectedStock:Stock = null;
  searchbarSize:number = 12;
  counterSize:number = 0;

  constructor(
    private common: DeviceCommon,
    private supplyTabService: SupplyTabService,
    private stockService: StockService
  ) { }

  // 검색 조건이 변경시, stock은 보이지 않도록 한다.
  // 장비가 선택된 경우에만 stock이 보인다.

  hasSelectedDeviceNumber = (serialNumber) => serialNumber.length === 4 && this._selectedDevice && this._selectedDevice.getLastSerialNumber() === serialNumber

  ngOnInit() {
    this.subscription = this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);
    }).add(
      this.supplyTabService.device.subscribe((device: DeviceView) => {
        this._selectedDevice = device;
        if (device) {
          if (this._stockHouse && this._stockHouse.stockHouse.length) {
            this.setStockItemView(device.name);
            return;
          } 
        }
        this.selectStock(null);
      })
    ).add(
      this.supplyTabService.stock.subscribe(stock => {
        this.selectedStock = stock;
        if (stock) {
          this._setViewSize(9, 3);
        } else {
          this._setViewSize(12, 0);
        }
      })
    )
  }

  selectStock(stockTitle: string) {
    this.selectedStock = this._getStock(stockTitle);
    this.supplyTabService.setStock(this.selectedStock);
  }

  private _getStock(title: string) {
    let stock: Stock = null;
    if (!this._selectedDevice || !title) {return stock;}
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, this._selectedDevice.name)) {
        stock = stockRoom.stockArray.find(_stock => {
          return this.common.isSameName(_stock.name, title) || (_stock.alias ? _stock.alias.some(_alias => this.common.isSameName(_alias, title)) : false);
        })
        if (stock) {return false};
      }
    })
    return stock;
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
    this.selectStock(stockTitle);
  }

  // not selected just searching
  // bug when typed full right word ex) 샘플트랩; stock must be selected! but autocomplete should not be removed.
  clearStock(ev: any) {
    this.selectStock(ev.target.value);
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
