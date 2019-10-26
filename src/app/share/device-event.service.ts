
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Stock } from './stock.model';
import { Device } from './device.model';
import { DeviceEvent, EventType } from './device-event.model';
import { SupplyData } from './device-common';

interface SupplyRest {
  id?: string,
  type: string,
  terminal: string,
  deviceName: string,
  createdDate: string,
  serialNumber: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceEventService {

  private projectId: string = '';

  constructor(
    private http: HttpClient,
    private dEventService: DeviceEventService
  ) {
    this.projectId = environment.firebase.projectId;
  }

  supplyStock(device: Device, stock: Stock) {
    return this.http.post(
      `https://${this.projectId}.firebaseio.com/supplyEvent.json`,
      {
        "id": null,
        "type": EventType.supply,
        "terminal": "1", // user.terminal
        "category": device.category,
        "deviceName": device.name,
        "stockName": stock.name,
        "createdDate": new Date().toISOString(),
        "serialNumber": device.serialNumber
      }).pipe(take(1), tap(res => {
        return res
      }))
  }

  // firebase 데이터의 특성상 ISO을 사용하므로, 한국시간으로 보려면 new Date(ISOString)을 사용.
  getByDate(date: Date) {
    const startAt = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const endAt = new Date(date.setHours(23, 59, 59, 999)).toISOString();
    return this.http.get(
      `https://${this.projectId}.firebaseio.com/supplyEvent.json?orderBy="createdDate"&startAt="${startAt}"&endAt="${endAt}"&print=pretty`
    ).pipe((take(1), tap(res => {
      return res;
    })))
  }
}

