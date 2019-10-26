import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceEventService } from '../share/device-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supply-history-tab',
  templateUrl: 'supply-history-tab.page.html',
  styleUrls: ['supply-history-tab.page.scss']
})
export class SupplyHistoryTabPage implements OnInit, OnDestroy {

  private subscription = new Subscription;

  constructor(private eventService: DeviceEventService) {
  }

  ngOnInit() {
  }

  getData() {
    this.subscription = this.eventService.getByDate(new Date()).subscribe(res => console.log(res));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe;
    }
  }

  //todo : datePicker 및 supply, query날리기 
  // refresh버튼 만들기

}
