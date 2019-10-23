
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';


import { Stock } from './stock.model';
import { Device } from './device.model';
import { DeviceEvent, EventType } from './device-event.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceEventService {
  constructor(private http: HttpClient, private dEventService: DeviceEventService) { }

  supplyStock(device: Device, stock: Stock) {
    // new DeviceEvent(null, device.serialNumber, device.category, EventType.supply, new Date().toISOString(), user.workingGroup)
    // this.http.post('', {
    //   new DeviceEvent(null, )
    // })
    return this.http.post('', {}).pipe(take(1), tap(data => {
      return true;
    }))
  }
}