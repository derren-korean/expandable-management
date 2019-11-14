import { Component, OnInit } from '@angular/core';
import { GroupedDeviceService } from '../../share/grouped-device.service';
import { Subscription } from 'rxjs';
import { GroupedDevice } from '../../share/grouped-device.model';
import { Device } from '../../share/device.model';
import { DeviceCommon } from '../../share/device-common';
import { SupplyTabService } from '../supply-tab.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {

  private deviceSub = new Subscription;
  filteredDevices: GroupedDevice[] = [];
  private groupedDevices: GroupedDevice[] = [];
  private _lastSelectedDevice: any;

  constructor(
    private common: DeviceCommon,
    private gDService: GroupedDeviceService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    });
    this.deviceSub.add(
      this.supplyTabService.changeTerm().subscribe(term => {
        this.setFilteredDevices(term);
      })
    );
  }

  resetSelectedDevice() {
    if (this._lastSelectedDevice && this._lastSelectedDevice.isChecked) {
      this._lastSelectedDevice.isChecked = false;
      this.changeDevice(null);
    }
  }

  setFilteredDevices(term: string) {
    if (!term || term.length === 0) {
      this.resetSelectedDevice();
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
    if (this.filteredDevices.length > 1) {
      this.resetSelectedDevice();
    }
  }

  changeDevice(device: any) {
    if (device && this._lastSelectedDevice && this._lastSelectedDevice.isChecked && device.isChecked) {
      this._lastSelectedDevice.isChecked = false;
    }
    this._lastSelectedDevice = { ...device };
    this.supplyTabService.setDevice(device);
  }

  getThumbnail(name: string) {
    return this.common.getDeviceImgAddress(name);
  }

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }

}
