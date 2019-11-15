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

  constructor(
    private gDService: GroupedDeviceService,
    private supplyTabService: SupplyTabService
  ) { }

    // TODO : 장비가 바뀔때 만, resetSelectedDevice를 실행 해야 함.
  ngOnInit() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    }).add(
      this.supplyTabService.term.subscribe(term => {
        this.setFilteredDevices(term);
      })
    );
  }

  resetSelectedDevice() {
    this.filteredDevices.forEach(groupedDevices => {
      groupedDevices.devices.forEach((device: DeviceView) => {
        if (device.isChecked) {
          device.isChecked = false;
        }
      })
    })
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

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }

}
