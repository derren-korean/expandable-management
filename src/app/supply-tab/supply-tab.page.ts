import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgModel, NgControl } from '@angular/forms';
import { Device } from '../share/device.model';
import { DeviceCommon } from '../share/device-common';
import { GroupedDevice } from '../share/grouped-device.model'
import { GroupedDeviceService } from '../share/grouped-device.service';
import { StockService, StockHouse } from '../share/stock.service';
import { DeviceEventService } from '../share/device-event.service';
import { Stock } from '../share/stock.model';

@Component({
  selector: 'app-supply-tab',
  templateUrl: 'supply-tab.page.html',
  styleUrls: ['supply-tab.page.scss']
})
export class SupplyTabPage implements OnDestroy {

  //todo : 2개의 컴포넌트로 나뉜다, listComponent, SearchComponent 

  @ViewChild('deviceTerm', { static: true }) deviceTerm: string;
  private isLoading = false;
  private deviceSub = new Subscription;
  private groupedDevices: GroupedDevice[] = [];
  private filteredDevices: GroupedDevice[] = [];

  private selectedDevice: Device;
  private selectedStock: Stock;

  private isDeviceAndSotckSelected: boolean = false;

  constructor(
    private gDService: GroupedDeviceService,
    private deviceCommon: DeviceCommon,
    private dEventService: DeviceEventService
  ) { }

  ionViewDidEnter() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices();
    });
  }

  setFilteredDevices() {
    if (!this.deviceTerm || this.deviceTerm.length === 0) {
      this.filteredDevices = [...this.groupedDevices];
      return;
    }
    this.filteredDevices = this.groupedDevices.reduce((result: GroupedDevice[], currentValue: GroupedDevice) => {
      const _serialMatch = (device: Device) => device.serialNumber.split('-').pop().startsWith(this.deviceTerm);
      const _locationMatch = (device: Device) => device.location.toLowerCase().indexOf(this.deviceTerm.toLowerCase()) > -1;

      const _filter = Number.isNaN(+this.deviceTerm) ? _locationMatch : _serialMatch;
      const devices = currentValue.devices.filter(_filter);
      if (devices.length > 0) {
        result.push(new GroupedDevice(currentValue.section, devices));
      }
      return result;
    }, []);
  }

  selectDevice(device: Device) {
    this.selectedDevice = device;
    this.deviceTerm = device.serialNumber.split('-').pop();
    // auto-focus기능 추가
  }

  getThumbnail(name: string) {
    return this.deviceCommon.getDeviceImgAddress(name);
  }

  ngOnDestroy() {
    if (this.deviceSub) { this.deviceSub.unsubscribe(); }
  }

  reset(device: any) {
    if (device.isChecked) {
      this.selectedDevice = null;
      this.selectedStock = null;
      this.deviceTerm = '';
      this.isDeviceAndSotckSelected = false;
      device.isChecked = !device.isChecked;
      this.setFilteredDevices();
    }
  }

  readyToSend(stock: Stock) {
    if (stock && stock.name.length) {
      this.selectedStock = stock;
      this.isDeviceAndSotckSelected = true;
    }
  }

  supplySotck() {
    if (this.selectDevice && this.selectedStock) {
      this.isLoading = true;
      this.reset(this.selectedDevice);
      this.dEventService.supplyStock(this.selectedDevice, this.selectedStock).subscribe(a => {
        console.log(a);
        this.isLoading = false;
      })
    }
  }

}
