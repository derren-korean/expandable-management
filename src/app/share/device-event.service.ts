
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';

import { Stock } from './stock.model';
import { Device } from './device.model';
import { DeviceEvent, EventType } from './device-event.model';
import { Observable } from 'rxjs';
import { SupplyData } from './device-common';

interface SupplyRest {
  id: string,
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

  constructor(private http: HttpClient, private dEventService: DeviceEventService) {
    this.http.get<{ projectId: string }>('../../assets/databaseData.json').forEach(data => {
      this.projectId = data.projectId;
    });
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
