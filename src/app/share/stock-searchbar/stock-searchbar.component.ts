import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Device } from '../device.model';
import { StockHouse, StockService } from '../stock.service';
import { NgModel, NgForm } from '@angular/forms';
import { Stock } from '../stock.model';
import { Subject, Observable } from 'rxjs';
import { DeviceCommon } from '../device-common';

// todo: class만들어서 ion-item><ion-label> <h2>{{name}}<p>alias 보이도록
// todo: 재사용성을 위해서, 리스트를 부모가 넘겨주는 방식으로.

@Component({
  selector: 'app-stock-searchbar',
  templateUrl: './stock-searchbar.component.html',
  styleUrls: ['./stock-searchbar.component.scss'],
})
export class StockSearchbarComponent implements OnInit {

  @Input() selectedDevice: Device;
  @Output() stockSelected = new EventEmitter<Stock>();
  @ViewChild('itemTerm', { static: true }) itemTerm: string;
  private isItemAvailable = false;
  private items: string[] = [];
  private _stockHouse: StockHouse;

  constructor(private stockService: StockService, private common: DeviceCommon) { }

  ngOnInit() {
    this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);
    })
  }

  private _isEqualToSelectedItemRoom = (stockRoom) => this.common.isSameName(stockRoom.roomName, this.selectedDevice.name);

  initializeItems() {
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this._isEqualToSelectedItemRoom(stockRoom)) {
        this.items = stockRoom.getNames();
      }
    })
  }

  getItems(ev: any) {
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.isItemAvailable = false;
    }
  }

  _getStockBySelectedName(name): Stock {
    let _stock: Stock;
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this._isEqualToSelectedItemRoom(stockRoom)) {
        _stock = stockRoom.stockArray.find(stock => {
          return this.common.isSameName(stock.name, name) || stock.alias.some(alias => this.common.isSameName(alias, name))
        })
      }
    })
    return _stock;
  }

  fillSearchBarWithSelectedName(name: string) {
    this.itemTerm = name;
    this.isItemAvailable = false;
    this.stockSelected.emit(this._getStockBySelectedName(name));
  }

}
