import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from './device.model';
import { Stock } from './stock.model';

interface CategoryDeviceData {
  category: string, devices: string[]
}

export class ItemView {
  constructor(
    public title: string,
    public subTitles: string[]
  ) { }
}

export interface SupplyData {
  device: Device,
  stock: Stock
}

@Injectable({
  providedIn: "root"
})

export class DeviceCommon {

  public readonly DEVICE_IMG_ADDRESS_PREFIX: string = '../../assets/'
  public readonly IMG_SUFFIX = '.png';
  public readonly CATEGORY_N_DEVICE_MAP = new Map<string, string[]>();
  public readonly DEVICENAME_N_STOCKNAME_MAP = new Map<string, string[]>();
  public readonly CATEGORY_ARR: string[] = [];
  public readonly DEVICE_NAME_ARR: string[] = [];


  constructor(private http: HttpClient) {
    this._initCategoryDeviceMap();
    this._initDeviceStockNameMap();
  }

  isSameName(name1: string, name2: string) {
    return name1.trim().toLowerCase() === name2.trim().toLowerCase();
  }

  getDeviceImgAddress(deviceName: string) {
    return this.DEVICE_IMG_ADDRESS_PREFIX + deviceName + this.IMG_SUFFIX;
  }

  private _initCategoryDeviceMap() {
    this.http.get<CategoryDeviceData[]>('../../assets/categoryNDeviceNameData.json').forEach(arr => {
      for (const data of arr) {
        this.CATEGORY_N_DEVICE_MAP.set(data.category, data.devices);
        this.CATEGORY_ARR.push(data.category);
        this._pushDeviceName(data.devices);
      }
    })
  }

  private _pushDeviceName(deviceNames: string[]) {
    for (const name of deviceNames) {
      this.DEVICE_NAME_ARR.push(name);
    }
  }

  private _initDeviceStockNameMap() {
    this.http.get<Stock[]>('../../assets/stockList.json')
      .forEach((stocks: Stock[]) => {
        this.DEVICE_NAME_ARR.forEach((name: string) => {
          const _tempArr: Stock[] = stocks.filter(s => s.deviceNames[0] === name);
          if (!_tempArr || !_tempArr.length) { return };
          if (!this.DEVICENAME_N_STOCKNAME_MAP.get(_tempArr[0].deviceNames[0])) {
            this.DEVICENAME_N_STOCKNAME_MAP.set(_tempArr[0].deviceNames[0], _tempArr.map(s => s.name));
          }
        })
      })
  }

  private _pushStocks = (stock: Stock) => {
    if (!this.DEVICENAME_N_STOCKNAME_MAP.get(stock.deviceNames[0])) {
      this.DEVICENAME_N_STOCKNAME_MAP.set(stock.deviceNames[0], []);
    }
  }
}