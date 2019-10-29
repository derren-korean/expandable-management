import { Component, OnDestroy } from '@angular/core';

import { Device } from '../share/device.model';
import { DeviceCommon, SupplyData } from '../share/device-common';
import { GroupedDevice } from '../share/grouped-device.model'
import { GroupedDeviceService } from '../share/grouped-device.service';
import { DeviceEventService } from '../share/device-event.service';

@Component({
  selector: 'app-supply-tab',
  templateUrl: 'supply-tab.page.html',
  styleUrls: ['supply-tab.page.scss']
})
export class SupplyTabPage {
  constructor(
    private dEventService: DeviceEventService
  ) { }
}
