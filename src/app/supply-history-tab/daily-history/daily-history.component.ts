import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-daily-history',
  templateUrl: './daily-history.component.html',
  styleUrls: ['./daily-history.component.scss'],
})
export class DailyHistoryComponent {
  selectedDate = new BehaviorSubject<string>('');
  private _date: string = '';

  constructor() { }

  ionViewWillEnter() {
    this.changeDate(this._date);
  }

  changeDate(date: string) {
    if (date) {
      this.selectedDate.next(date);
      this._date = date;
    }
  }

}
