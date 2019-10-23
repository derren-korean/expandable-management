import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CategoryDeviceData {
  category: string, devices: string[]
}

@Injectable({
  providedIn: "root"
})

export class DeviceCommon {

  public readonly DEVICE_IMG_ADDRESS_PREFIX: string = '../../assets/'
  public readonly IMG_SUFFIX = '.png';
  public readonly CATEGORY_N_DEVICE_MAP = new Map<string, string[]>();
  public readonly CATEGORY_ARR: string[] = [];
  public readonly DEVICE_NAME_ARR: string[] = [];

  constructor(private http: HttpClient) {
    this._initCategoryDeviceMap()
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
}