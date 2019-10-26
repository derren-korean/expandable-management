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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe;
    }
  }

  // todo: refresh 버튼으로 최신화 하기.
  // todo: 값 디스플레이하기.
  getSupplyHistory(date: string) {
    this.eventService.getSupplyHistoryByDate(new Date(date)).subscribe(res => {
      console.log(res);
    })
  }

}
