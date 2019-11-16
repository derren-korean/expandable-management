import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GroupedDeviceService } from '../../share/grouped-device.service';
import { GroupedDevice } from '../../share/grouped-device.model';
import { Device } from '../../share/device.model';
import { SupplyTabService, DeviceView } from '../supply-tab.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit, OnDestroy {

  filteredDevices: GroupedDevice[] = [];
  private deviceSub = new Subscription;
  private groupedDevices: GroupedDevice[] = [];
  private checkedDevice: DeviceView = null;

  constructor(
    private gDService: GroupedDeviceService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    }).add(
      this.supplyTabService.term.subscribe(term => {
        this.setFilteredDevices(term);
      })
    ).add(
      this.supplyTabService.device.subscribe((device: DeviceView) => {
        this.checkedDevice = device;
      })
    )
  }

  resetSelectedDevice() {
    for (const groupedDevice of this.filteredDevices) {
      if (!this.checkedDevice) {break;}
      if (this._unCheckDevice(groupedDevice)) {break;}
    }
  }

  _unCheckDevice(groupedDevice: GroupedDevice) {
    return groupedDevice.devices.some((device: DeviceView) => {
      if (device.isChecked) {
        device.isChecked = false;
        this.checkedDevice = null;
        return true;
      }
    })
  }

  setFilteredDevices(term: string) {
    if (!term || term.length === 0) {
      this.resetSelectedDevice();
      this.filteredDevices = [...this.groupedDevices];
      return;
    }
    this.filteredDevices = this.groupedDevices.reduce((result: GroupedDevice[], currentValue: GroupedDevice) => {
      const _serialMatch = (device: Device) => device.getLastSerialNumber().startsWith(term);
      const _locationMatch = (device: Device) => device.location.toLowerCase().indexOf(term.toLowerCase()) > -1;

      const _filter = Number.isNaN(+term) ? _locationMatch : _serialMatch;
      const devices = currentValue.devices.filter(_filter);
      if (devices.length > 0) {
        result.push(new GroupedDevice(currentValue.section, devices));
      }
      return result;
    }, []);
    if (this.filteredDevices.length > 1) {
      this.resetSelectedDevice();
    }
  }

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }

}
