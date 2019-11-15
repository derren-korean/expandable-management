import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Device } from '../share/device.model';

interface DeviceData {
  name: string,
  serialNumber: string,
  terminalNumber: string,
  location: string,
  station: string,
  installedDate: number[],
  status: string,
  category: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private _devices = new BehaviorSubject<Device[]>([]);

  private _createDevice(data: DeviceData): Device {
    return new Device(null, data.name, data.serialNumber, data.location, data.terminalNumber, data.category);
  }

  constructor(private http: HttpClient) {
    this.http.get<DeviceData[]>('../../assets/deviceData.json')
      .forEach(resData => {
        const _device: Device[] = [];
        for (const data of resData) {
          _device.push(this._createDevice(data));
          this._devices.next([..._device]);
        }
      })
  }

  get devices() {
    return this._devices.asObservable();
  }
}