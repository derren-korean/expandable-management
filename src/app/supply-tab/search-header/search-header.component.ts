import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';

import { ItemView, DeviceCommon, SupplyData } from '../../share/device-common';
import { Device } from '../../share/device.model';
import { Stock } from '../../share/stock.model';
import { StockService, StockHouse } from '../../share/stock.service';
import { DeviceEventService } from '../../share/device-event.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
})
export class SearchHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('deviceTerm', { static: true }) deviceTerm: string;
  @Input() deviceChanged = new BehaviorSubject<any>({});
  @Output() termChanged = new EventEmitter<string>();
  @Output() sendSupply = new EventEmitter<SupplyData>();

  private subscription = new Subscription;
  private _stockHouse: StockHouse;
  private selectedDevice: Device;
  private selectedStock: Stock;
  private isDeviceAndSotckSelected: boolean = false;
  itemViewArr = new BehaviorSubject<ItemView[]>([]);

  constructor(
    private common: DeviceCommon,
    private stockService: StockService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.subscription = this.stockService.stockHouse.subscribe(arr => {
      this._stockHouse = new StockHouse([...arr.stockHouse]);
      this.http.get('../../../assets/addSpecialCaseStocks.json')
        .forEach(this.addSpecificStocks)
        .then(() => {
          this.subscription.add(
            this.deviceChanged.subscribe(device => {
              if (device.hasOwnProperty('name') && this._stockHouse && this._stockHouse.stockHouse.length) {
                this.selectedDevice = device;
                this.setItemView(device.name);
                this.deviceTerm = device.serialNumber.split('-').pop();
                if (!device.isChecked) {
                  this.reset(device);
                }
              }
            }));
        })
    });
  }

  addSpecificStocks = (data: Stock[]) => {
    data.forEach(stock => {
      this.common.CATEGORY_N_DEVICE_MAP.get("ETD").forEach(deviceName => {
        if (deviceName === stock.deviceNames[0]) {
          this._stockHouse.stockHouse.forEach(h => {
            if (h.roomName === deviceName) {
              h.stockArray.push(new Stock(stock.id, stock.deviceNames, stock.name, stock.alias, stock.unit));
            }
          })
        }
      })
    })
  }

  setItemView(name: string) {
    const _temp: ItemView[] = [];
    this._stockHouse.stockHouse.forEach(stockRoom => {
      if (this.common.isSameName(stockRoom.roomName, name)) {
        for (const stock of stockRoom.stockArray) {
          let _tempArr = [];
          if (stock.alias && stock.alias.length) {
            _tempArr = [...stock.alias];
          }
          _temp.push(new ItemView(stock.name, _tempArr));
        }
      }
    })
    this.itemViewArr.next(_temp);
  }

  resetStock() {
    if (this.selectedStock) {
      this.selectedStock = null;
      this.isDeviceAndSotckSelected = false;
    }
  }

  resetItemView() {
    if (this.selectedDevice) {
      this.setItemView(this.selectedDevice.name);
    }
  }

  emitFilterTerm(term: string) {
    this.resetStock();
    this.resetItemView(); // 검색 조건이 변경될 때마다 ItemView(autocomplete-searchbar) 리셋.
    this.termChanged.emit(term);
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


  reset(device: any) {
    this.resetStock();
    this.selectedDevice = null;
    this.deviceTerm = ''; // 자동으로 device 리스트 초기화 trigger함
  }

  supplySotck() {
    if (this.selectedDevice && this.selectedStock) {
      this.sendSupply.emit({
        device: this.selectedDevice,
        stock: this.selectedStock
      });
      this.reset(this.selectedDevice);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
