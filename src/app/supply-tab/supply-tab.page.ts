import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Device } from '../share/device.model';
import { DeviceCommon, ItemView } from '../share/device-common';
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
  itemViewArr: ItemView[] = [];

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
    this.selectedDevice = device;
    this.deviceTerm = device.serialNumber.split('-').pop();
    this.setItemView(device.name);
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

  setItemView(name: string) {
    this.itemViewArr = [];
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, name)) {
        for (const stock of stockRoom.stockArray) {
          let _tempArr = [];
          if (stock.alias && stock.alias.length) {
            _tempArr = [...stock.alias];
          }
          this.itemViewArr.push(new ItemView(stock.name, _tempArr));
        }
      }
    })
  }

  selectStock(title) {
    let _stock: Stock;
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, this.selectedDevice.name)) {
        this.selectedStock = stockRoom.stockArray.find(stock => {
          return this.common.isSameName(stock.name, title) || stock.alias.some(alias => this.common.isSameName(alias, title))
        })
      }
    })
  }

  changeSandMode(title: string) {
    if (title && title.length) {
      this.selectStock(title);
      this.isDeviceAndSotckSelected = true;
    } else {
      this.isDeviceAndSotckSelected = false;
    }
  }

  supplySotck() {
    if (this.selectedDevice && this.selectedStock) {
      this.isLoading = true;
      this.reset(this.selectedDevice);
      this.dEventService.supplyStock(this.selectedDevice, this.selectedStock).subscribe(a => {
        console.log(a);
        this.isLoading = false;
      })
    }
  }

}
