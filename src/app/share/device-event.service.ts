import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Stock } from './stock.model';
import { Device } from './device.model';
import { DeviceEvent, EventType } from './device-event.model';
import { AuthService } from '../auth/auth.service';

interface SupplyRest {
  id?: string,
  type: string,
  terminal: string,
  category: string,
  deviceName: string,
  stockName: string,
  createdDate: string,
  serialNumber: string,
  location: string // 불출 당시의 장소
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
    private dEventService: DeviceEventService,
    private authService: AuthService
  ) {
    this.projectId = environment.firebase.projectId;
  }

  supplyStock(device: Device, stock: Stock) {
    let token;
    this.authService.token.subscribe(_token => token = _token);
    let userId;
    this.authService.userId.subscribe(_userId => userId = _userId)
    return this.http.post(
      `https://${this.projectId}.firebaseio.com/supplyEvent.json?auth=${token}`,
      {
        "id": userId,
        "type": EventType.supply,
        "terminal": "1", // user.terminal
        "category": device.category,
        "deviceName": device.name,
        "stockName": stock.name,
        "createdDate": new Date().toISOString(),
        "serialNumber": device.serialNumber,
        "location": device.location
      }).pipe(take(1), tap(res => {
        return res;
      }))
  }

  // firebase 데이터의 특성상 ISO을 사용하므로, 한국시간으로 보려면 new Date(ISOString)을 사용.
  // qeury가독성을 위해 split, join, replace를 사용함.
  getSupplyHistoryByDate(date: Date): Observable<DeviceEvent[]> {
    let token;
    this.authService.token.subscribe(_token => token = _token);
    // 비니지스 아워: 9 to next day 8.
    const startAt = new Date(date.setHours(9, 0, 0, 0)).toISOString();
    date.setDate(date.getDate() + 1);
    const endAt = new Date(date.setHours(8, 59, 59, 999)).toISOString();
    const query = `https://${this.projectId}.firebaseio.com/supplyEvent.json?
    orderBy="createdDate"&
    startAt="${startAt}"&
    endAt="${endAt}"&
    print=pretty&
    auth=${token}`;
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
              new DeviceEvent(id, EventType.supply, deviceEvent.terminal, deviceEvent.category, deviceEvent.deviceName, deviceEvent.stockName, new Date(deviceEvent.createdDate), deviceEvent.serialNumber.split("-").pop(), deviceEvent.location)
            )
          }
        }
        return [..._temp]
      })
    )
  }

  // // // 네트웍 안될때 가상의 데이터 만들기
  // getSupplyHistoryByDate(date: Date) {
  //   return this.http.get<SupplyRest[]>('../../../assets/noNetworkData.json').pipe(take(1), map(data => {
  //     const temp: DeviceEvent[] = [];
  //     data.forEach(res => {
  //       temp.push(new DeviceEvent(res.id, EventType.supply, res.terminal, res.category, res.deviceName, res.stockName, new Date(res.createdDate), res.serialNumber.split("-").pop(), res.location));
  //     })
  //     return temp;
  //   }))
  // }
}

