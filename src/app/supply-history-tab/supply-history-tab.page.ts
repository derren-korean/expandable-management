import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-supply-history-tab',
  templateUrl: 'supply-history-tab.page.html',
  styleUrls: ['supply-history-tab.page.scss']
})
export class SupplyHistoryTabPage {

  selectedDate = new BehaviorSubject<string>('');
  private _date: string = '';

  constructor() { }

  ionViewWillEnter() {
    this.changeDate(this._date);
  }

  changeDate(date: string) {
    this.selectedDate.next(date);
    this._date = date;
  }

}
