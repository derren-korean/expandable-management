import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DeviceEvent } from '../../share/device-event.model';
import { DeviceCommon } from '../../share/device-common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DeviceEventService } from '../../share/device-event.service';

class ExpandableCard {
  constructor(
    public title: string,//stockName
    public deviceEvents: DeviceEvent[]
  ) { }
}

class ExpandableChart {
  constructor(
    public subTitle: string,//deviceName
    public cards: ExpandableCard[]
  ) { }
}

@Component({
  selector: 'app-expandable-ledger',
  templateUrl: './expandable-ledger.component.html',
  styleUrls: ['./expandable-ledger.component.scss'],
})
export class ExpandableLedgerComponent implements OnInit, OnDestroy {

  @Input() date = new BehaviorSubject<string>('');
  private subscription = new Subscription;
  expandableBook: ExpandableChart[] = [];

  constructor(private common: DeviceCommon, private eventService: DeviceEventService) { }

  ngOnInit() {
    this.subscription = this.date.subscribe(_date => {
      this.subscription.add(this.eventService.getSupplyHistoryByDate(new Date(_date))
        .subscribe((deviceEvents: DeviceEvent[]) => {
          //order by : deviceCategory | stockOrder
          this.setBook(deviceEvents);
        }));
    })
  }

  setBook(deviceEvents: DeviceEvent[]) {
    if (!deviceEvents || deviceEvents.length === 0) {
      this.expandableBook = [];
      return;
    }
    const charts: ExpandableChart[] = [];
    // map을 사용해서, 지정된 순서인 stockName으로 ordering
    this.common.DEVICENAME_N_STOCKNAME_MAP.forEach((stockNames: string[], _deviceName: string) => {
      if (deviceEvents.some(e => e.deviceName === _deviceName)) {
        charts.push(
          new ExpandableChart(_deviceName,
            this._getCard(_deviceName, stockNames, deviceEvents))
        );
      }
    })
    this.expandableBook = charts;
  }

  _getCard(deviceName: string, stockNames: string[], deviceEvents: DeviceEvent[]) {
    const cards: ExpandableCard[] = [];
    stockNames.forEach((_stockName: string) => {
      if (deviceEvents.some(e => e.stockName === _stockName)) {
        cards.push(
          new ExpandableCard(_stockName,
            deviceEvents.filter(e => e.deviceName === deviceName && e.stockName === _stockName))
        );
      }
    })
    return cards;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
