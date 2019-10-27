import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceEventService } from '../share/device-event.service';
import { Subscription } from 'rxjs';
import { DeviceEvent } from '../share/device-event.model';
import { DeviceCommon } from '../share/device-common';
import { StockService } from '../share/stock.service';

@Component({
  selector: 'app-supply-history-tab',
  templateUrl: 'supply-history-tab.page.html',
  styleUrls: ['supply-history-tab.page.scss']
})
export class SupplyHistoryTabPage implements OnInit, OnDestroy {

  private categoryOrder;
  private selectedDate: string = '';

  private subscription = new Subscription;
  deviceEvents = [];

  constructor(
    private eventService: DeviceEventService,
    private common: DeviceCommon,
    private stockService: StockService
  ) {
  }


  ngOnInit() {
    if (!this.selectedDate) {
      this.selectedDate = new Date().toDateString();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe;
    }
  }

  // todo: refresh 버튼으로 최신화 하기.
  // todo: 값 디스플레이하기.
  getSupplyHistory(date: string) {
    this.selectedDate = date;
    this.subscription = this.eventService.getSupplyHistoryByDate(new Date(date)).subscribe((deviceEvents: DeviceEvent[]) => {
      // this._getHistoryByDeviceCategory(deviceEvents);
      // _categoryOrder (category: OrderedDeviceEvent) => 
      //order by : deviceCategory | stockOrder | termial | location
      console.log(deviceEvents.sort(this._compareWithCommonMapValues(this.common.DEVICE_NAME_ARR, "deviceName")));
      this.stockService.getStockNamesMap().subscribe(stockMap => {
        console.log(stockMap)
      })
    });
  }

  private _compareWithCommonMapValues = (ref_arr: string[], key) => {
    return (a: DeviceEvent, b: DeviceEvent) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const _isStringNHasArr = (a) => (ref_arr && ref_arr.length) && (typeof a[key] === 'string');

      const varA = _isStringNHasArr(a) ?
        ref_arr.indexOf(a[key]) : a[key];
      const varB = _isStringNHasArr(b) ?
        ref_arr.indexOf(b[key]) : b[key];

      return varA - varB;
    };
  }

}
