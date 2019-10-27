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

  private selectedDate: string = '';

  private subscription = new Subscription;
  deviceEvents = [];

  constructor(
    private eventService: DeviceEventService,
    private common: DeviceCommon
  ) { }

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
      // _categoryOrder (category: OrderedDeviceEvent) => 
      //order by : deviceCategory | stockOrder | termial
      console.log(deviceEvents.sort(this._compareWithCommonMapValues(this.common.DEVICE_NAME_ARR, "deviceName", "terminal")));

    });
  }

  private _compareWithCommonMapValues = (ref_arr: string[], first_key: string, last_key: string) => {
    return (a: DeviceEvent, b: DeviceEvent) => {
      if (!a.hasOwnProperty(first_key) || !b.hasOwnProperty(first_key)) {
        // property doesn't exist on either object
        return 0;
      }

      const _isStringNHasArr = (a) => (ref_arr && ref_arr.length) && (typeof a[first_key] === 'string');
      const categoryA = _isStringNHasArr(a) ?
        ref_arr.indexOf(a[first_key]) : a[first_key];
      const categoryB = _isStringNHasArr(b) ?
        ref_arr.indexOf(b[first_key]) : b[first_key];
      //orderBy deviceCategory
      if (categoryA != categoryB) {
        return categoryA - categoryB;
      }
      //orderBy stockOrder
      const _stockNameArr: string[] = this.common.DEVICENAME_N_STOCKNAME_MAP.get(a.deviceName);
      const stockNameOrderA = _stockNameArr.indexOf(a.stockName);
      const stockNameOrderB = _stockNameArr.indexOf(a.stockName);
      if (stockNameOrderA != stockNameOrderB) {
        return stockNameOrderA - stockNameOrderB;
      }
      //orderBy terminal
      return (+a[last_key]) - (+b[last_key]);
    };
  }

}
