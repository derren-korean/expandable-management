import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GroupedDeviceService } from '../../share/grouped-device.service';
import { GroupedDevice } from '../../share/grouped-device.model';
import { Device } from '../../share/device.model';
import { SupplyTabService, DeviceView } from '../supply-tab.service';

// role: device-filter의 값대로 View를 뿌린다.
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
  private _deviceTerm: string = null;

  constructor(
    private gDService: GroupedDeviceService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    })
    .add(
      this.supplyTabService.deviceTerm.subscribe((term: string) => {
        if (this._deviceTerm !== term) {
          this.setFilteredDevices(term);
        }
        this._deviceTerm = term;
      })
    )
  }

  // 선택한 장비를 리스트 맨 위에 놓고, deviceFilter의 값을 바꾸지 않는게 나을 수도 있다.
  // 장소보다 시리얼 넘버로 찾을 가능성이 높기 때문에 이렇게 설정 하였다.
  // 필터리스트에 선택된 1개 or 전부를 그린다.
  changeList(device: DeviceView) {
    if (this.checkedDevice && !device.isChecked) {
      this.resetList();
    }
    const deviceTerm: string = device.isChecked ? device.getLastSerialNumber() : '';
    const _device = device.isChecked ? device : null;
    
    this.checkedDevice = _device;
    this.supplyTabService.setDevice(_device);
    this.supplyTabService.setDeviceTerm(deviceTerm);
  }

  resetList() {
    this.filteredDevices = [...this.groupedDevices];
  }

  // 체크박스를 라디오 버튼처럼 1개만 선택 가능하도록 함.
  uncheckSelectedDevice() {
    for (const groupedDevice of this.filteredDevices) {
      if (!this.checkedDevice) {break;}
      if (this._unCheckDevice(groupedDevice)) {
        this.supplyTabService.setDevice(null);
        break;
      }
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
      this.resetList();
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
      this.uncheckSelectedDevice();
    }
  }

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }

}
