import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Device } from '../../share/device.model';
import { Stock } from '../../share/stock.model';
import { SupplyTabService } from '../supply-tab.service';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements OnInit, OnDestroy {

  private subscription = new Subscription;
  //todo : selected Items readonly
  _selectedDevice: Device = null;
  _selectedStock: Stock = null;
  _stockCount: number = 1;

  constructor(
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.subscription = this.supplyTabService.device.subscribe(device => {
      this._selectedDevice = device;
    }).add(
      this.supplyTabService.stock.subscribe(stock => {
        this._selectedStock = stock;
    })).add(
      this.supplyTabService.stockCount.subscribe(count => {
        this._stockCount = count;
    }))
  }

  supplySotck() {
    this.supplyTabService.saveSupply(this._selectedDevice, this._selectedStock, this._stockCount);
    this.reset();
  }

  reset() {
    this._selectedDevice = null;
    this._selectedStock = null;
    this._stockCount = 1;
    this.supplyTabService.setDevice(null);
    this.supplyTabService.setStock(null);
    this.supplyTabService.setStockCount(1);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
