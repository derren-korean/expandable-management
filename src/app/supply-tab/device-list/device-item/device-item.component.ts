import { Component, OnInit, Input } from '@angular/core';
import { SupplyTabService, DeviceView } from '../../supply-tab.service';
import { DeviceCommon } from 'src/app/share/device-common';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss'],
})
export class DeviceItemComponent implements OnInit {

  @Input() device: DeviceView;
  constructor(private common: DeviceCommon, private supplyTabService: SupplyTabService) { }

  ngOnInit() {}

  changeDevice(device: DeviceView) {
    this.supplyTabService.setDevice(device);
  }

  getThumbnail(name: string) {
    return this.common.getDeviceImgAddress(name);
  }

}
