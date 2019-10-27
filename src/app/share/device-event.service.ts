import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take, map } from 'rxjs/operators';
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
  category: string,
  deviceName: string,
  stockName: string,
  createdDate: string,
  serialNumber: string
}

interface SupplyRestRes {
  [name: string]: SupplyRest
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
        return res;
      }))
  }

  // firebase 데이터의 특성상 ISO을 사용하므로, 한국시간으로 보려면 new Date(ISOString)을 사용.
  // qeury가독성을 위해 split, join, replace를 사용함.
  getSupplyHistoryByDate(date: Date): Observable<DeviceEvent[]> {
    const startAt = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const endAt = new Date(date.setHours(23, 59, 59, 999)).toISOString();
    const query = `https://${this.projectId}.firebaseio.com/supplyEvent.json?
    orderBy="createdDate"&
    startAt="${startAt}"&
    endAt="${endAt}"&
    print=pretty`;
    return this.http.get<SupplyRestRes>(
      query.split("\n").join("").replace(/\s/gi, "")
    ).pipe(
      take(1),
      tap(null, (error => {
        console.log(error);
      })),
      map(resData => {
        const _temp: DeviceEvent[] = []
        for (const name in resData) {
          if (resData.hasOwnProperty(name)) {
            const deviceEvent: SupplyRest = resData[name];
            let id = null;
            if (deviceEvent.id) {
              id = deviceEvent.id;
            }
            _temp.push(
              new DeviceEvent(id, EventType.supply, deviceEvent.terminal, deviceEvent.category, deviceEvent.deviceName, deviceEvent.stockName, new Date(deviceEvent.createdDate), deviceEvent.serialNumber)
            )
          }
        }
        return [..._temp]
      })
    )
  }
}

