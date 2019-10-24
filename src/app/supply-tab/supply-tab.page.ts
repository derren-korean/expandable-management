import { Component, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import { Device } from '../share/device.model';
import { DeviceCommon } from '../share/device-common';
import { GroupedDevice } from '../share/grouped-device.model'
import { GroupedDeviceService } from '../share/grouped-device.service';

@Component({
  selector: 'app-supply-tab',
  templateUrl: 'supply-tab.page.html',
  styleUrls: ['supply-tab.page.scss']
})
export class SupplyTabPage implements OnDestroy {
  private deviceSub = new Subscription;
  private groupedDevices: GroupedDevice[] = [];
  private filteredDevices: GroupedDevice[] = [];
  private changedDevice = new BehaviorSubject<any>({});
  private _lastSelectedDevice: any;

  constructor(
    private gDService: GroupedDeviceService,
    private common: DeviceCommon
  ) { }

  ionViewDidEnter() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    });
  }

  setFilteredDevices(term: string) {
    if (!term || term.length === 0) {
      if (this._lastSelectedDevice && this._lastSelectedDevice.isChecked) {
        this._lastSelectedDevice.isChecked = false;
      }
      this.filteredDevices = [...this.groupedDevices];
      return;
    }
    this.filteredDevices = this.groupedDevices.reduce((result: GroupedDevice[], currentValue: GroupedDevice) => {
      const _serialMatch = (device: Device) => device.serialNumber.split('-').pop().startsWith(term);
      const _locationMatch = (device: Device) => device.location.toLowerCase().indexOf(term.toLowerCase()) > -1;

      const _filter = Number.isNaN(+term) ? _locationMatch : _serialMatch;
      const devices = currentValue.devices.filter(_filter);
      if (devices.length > 0) {
        result.push(new GroupedDevice(currentValue.section, devices));
      }
      return result;
    }, []);
  }

  changeDevice(device: any) {
    if (this._lastSelectedDevice && this._lastSelectedDevice.isChecked && device.isChecked) {
      this._lastSelectedDevice.isChecked = false;
    }
    this._lastSelectedDevice = device;
    this.changedDevice.next(device);
  }

  getThumbnail(name: string) {
    return this.common.getDeviceImgAddress(name);
  }

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }
}
