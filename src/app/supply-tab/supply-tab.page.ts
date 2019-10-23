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
  private _stockHouse: StockHouse;

  private selectedDevice: Device;
  private selectedStock: Stock;

  private isDeviceAndSotckSelected: boolean = false;

  constructor(
    private gDService: GroupedDeviceService,
    private common: DeviceCommon,
    private dEventService: DeviceEventService,
    private stockService: StockService
  ) { }

  ionViewDidEnter() {
    this.deviceSub = this.gDService.groupedDevices.subscribe(groupedDevices => {
      this.groupedDevices = [...groupedDevices];
      this.setFilteredDevices();
    });
    this.deviceSub.add(
      this.stockService.stockHouse.subscribe(arr => {
        this._stockHouse = new StockHouse([...arr.stockHouse]);
      })
    )
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
    console.log("check the device is null. when reset is called.")
    this.selectedDevice = device;
    this.deviceTerm = device.serialNumber.split('-').pop();

    // auto-focus기능 추가
  }

  getThumbnail(name: string) {
    return this.common.getDeviceImgAddress(name);
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

  private _isEqualToSelectedItemRoom = (stockRoom) => this.common.isSameName(stockRoom.roomName, this.selectedDevice.name);

  getSelectedDeviceStocks() {
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this._isEqualToSelectedItemRoom(stockRoom)) {
        return stockRoom.getNames();
      }
    })
  }

  changeSandMode(stock: Stock) {
    if (stock && stock.name.length) {
      this.selectedStock = stock;
      this.isDeviceAndSotckSelected = true;
    } else {
      this.isDeviceAndSotckSelected = false;
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
