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

  constructor(
    private gDService: GroupedDeviceService,
    private supplyTabService: SupplyTabService
  ) { }

  ngOnInit() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices(null);
    }).add(
      this.supplyTabService.deviceTerm.subscribe(term => {
        this.setFilteredDevices(term);
      })
    ).add( // 자식 컴포넌트인 device-item에서 선택된 device를 불러옴.
      this.supplyTabService.device.subscribe((device: DeviceView) => {
        if (this.checkedDevice) {
          // user가 필터되어 1개만 존재하는 장비를 다시 클릭하여 취소. 초기화를 진행한다.
          if (!device.isChecked) {
            this.resetList();
            this.checkedDevice = null;
            this.supplyTabService.setDevice(null);
            this.supplyTabService.setDeviceTerm('');
            return;
          }
          this.uncheckSelectedDevice();
        }
        this.checkedDevice = device;
        if (device) {
          this.supplyTabService.setDeviceTerm(device.getLastSerialNumber());
        }
      })
    )
  }

  resetList() {
    this.filteredDevices = [...this.groupedDevices];
  }

  // 체크박스를 라디오 버튼처럼 1개만 선택 가능하도록 함.
  uncheckSelectedDevice() {
    for (const groupedDevice of this.filteredDevices) {
      if (!this.checkedDevice) {break;}
      if (this._unCheckDevice(groupedDevice)) {
        this.supplyTabService.setDevice(null); // checkedDevice를 변경하기 때문에 loop가 아님.
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
