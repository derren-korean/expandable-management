import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent implements OnInit {
  @ViewChild('datetimePicker', { static: true }) datetimePicker: IonDatetime;
  @Input() inputDate: string;
  @Output() dateChanged = new EventEmitter<string>();

  customPickerOptions: any;
  constructor() {
    this.customPickerOptions = {
      buttons: [{
        text: '취소',
        handler: () => {
        }
      }, {
        text: '선택',
        handler: (data: { day: { text: string }, month: { text: string }, year: { text: string } }) => {
          this.datetimePicker.value = new Date(data.year.text + "-" + data.month.text + "-" + data.day.text).toISOString();
          this.dateChanged.emit(this.datetimePicker.value);
        }
      }]
    }
  }

  ngOnInit() {
    this.datetimePicker.value = this.inputDate;
    this.dateChanged.emit(this.datetimePicker.value);
  }

}
