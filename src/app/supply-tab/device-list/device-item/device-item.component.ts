import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceView } from '../../supply-tab.service';
import { DeviceCommon } from 'src/app/share/device-common';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss'],
})
export class DeviceItemComponent implements OnInit {

  @Input() device: DeviceView;
  @Output() deviceSelected = new EventEmitter<DeviceView>();
  constructor(private common: DeviceCommon) { }

  ngOnInit() {}

  selectDevice(device: DeviceView) {
    this.deviceSelected.emit(device);
  }

  getThumbnail(name: string) {
    return this.common.getDeviceImgAddress(name);
  }

}
