import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { Stock } from './stock.model';
import { DeviceCommon } from './device-common';

class StockRoom {
  constructor(
    public roomName: string,
    public stockArray: Stock[]
  ) { }

  getNames() {
    return this.stockArray.reduce((names: string[], stock) => {
      names.push(stock.name);
      if (stock.alias && stock.alias.length) {
        names = names.concat(stock.alias);
      }
      return names;
    }, []);
  }
}

export class StockHouse {
  constructor(
    public stockHouse: StockRoom[]
  ) { }
}

@Injectable({
  providedIn: 'root'
})

export class StockService {

  private _stocks = new BehaviorSubject<Stock[]>([]);
  private _stockHouse = new BehaviorSubject<StockHouse>(new StockHouse([]));

  constructor(private http: HttpClient, private common: DeviceCommon) {
    this._initStocks();
  }

  get stockHouse() {
    return this._stockHouse.asObservable();
  }

  getStocks(roomName: string) {
    return this.stockHouse.pipe(take(1), switchMap((house: StockHouse) => {
      return house.stockHouse.filter(room => room.roomName === roomName);
    }))
  }

  private _initStockHouse() {
    const _temp: StockHouse = new StockHouse([]);
    for (const deviceName of this.common.DEVICE_NAME_ARR) {
      _temp.stockHouse.push(new StockRoom(deviceName, []));
    }
    this._stockHouse.next(_temp);
  }

  private _initStocks() {
    this.http.get<Stock[]>('../../assets/stockList.json')
      .forEach(this._pushStocks)
      .then(() => this._initStockHouse());
  }

  private _pushStocks = (stocks: Stock[]) => {
    const _stockArr: Stock[] = [];
    stocks.forEach(stock => this._createAndPush(stock, _stockArr));
    this._stocks.next(_stockArr);
  }

  private _createAndPush = (stock, _stockArr) => {
    const __stock: Stock = new Stock(stock.id, stock.deviceNames, stock.name, stock.alias, stock.unit);
    _stockArr.push(__stock);
    this._pushStockRoom(__stock);
  }

  private _pushStockRoom(stock: Stock) {
    this._stockHouse.forEach(arr => {
      for (const room of arr.stockHouse) {
        if (stock.deviceNames.some(deivceName => this.common.isSameName(room.roomName, deivceName))) {
          room.stockArray.push(stock)
        }
      }
    })
  }

}