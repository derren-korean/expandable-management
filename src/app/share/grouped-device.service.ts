import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { Device } from './device.model';
import { GroupedDevice } from './grouped-device.model';
import { DeviceService } from './device.service';
import { HttpClient } from '@angular/common/http';

interface LocationData {
  section: string,
  locations: string[]
}

@Injectable({
  providedIn: 'root'
})
export class GroupedDeviceService implements OnDestroy {
  private deviceSub = new Subscription;
  private _groupedDevices = new BehaviorSubject<GroupedDevice[]>([]);
  private _groupLocationMap = new Map<string, string[]>();

  constructor(private deviceService: DeviceService, private http: HttpClient) {
    this._initLocationMap().then(() => {
      this.deviceSub = this.deviceService.devices.subscribe(devices => {
        this._groupedDevices.next(this._getDeviceGroup(devices));
      });
    })
      .catch(error => { console.log("initLocationMap has error"); })
  }

  get groupedDevices(): Observable<GroupedDevice[]> {
    return this._groupedDevices.asObservable();
  }

  private _initLocationMap(): Promise<void> {
    return this.http.get<LocationData[]>('../../assets/locationData.json')
      .forEach(resData => {
        for (const data of resData) {
          this._groupLocationMap.set(data.section, [...data.locations]);
        }
      });
  }

  private _getDeviceGroup(devices: Device[]): GroupedDevice[] {
    const _devices: GroupedDevice[] = [];
    this._groupLocationMap.forEach((locations: string[], section: string) => {
      _devices.push(new GroupedDevice(section, this._getLocations(locations, devices)));
    })
    return [..._devices];
  }

  private _getLocations(locations: string[], devices: Device[]): Device[] {
    const _temp: Device[] = [];
    for (const location of locations) {
      if (this._hasLocation(devices, location)) {
        this._recursiveConsume(_temp, devices, location);
      }
    }
    return [..._temp];
  }

  private _recursiveConsume(_temp: Array<Device>, origine: Array<Device>, location: string): void {
    if (!this._hasLocation(origine, location)) { return; }
    _temp.push(...origine.splice(origine.findIndex(d => d.location == location), 1));
    return this._recursiveConsume(_temp, origine, location);
  }

  private _hasLocation(arr: Device[], location): boolean {
    return arr.findIndex(el => el.location == location) > -1;
  }

  ngOnDestroy() {
    if (this.deviceSub) {
      this.deviceSub.unsubscribe();
    }
  }
}
