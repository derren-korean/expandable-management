import { BehaviorSubject } from 'rxjs';

import { Device } from '../share/device.model';
import { Stock } from '../share/stock.model';
import { DeviceEventService } from '../share/device-event.service';

export interface DeviceView extends Device {
  isChecked?: boolean
}

export class SupplyTabService {

  constructor(private deviceEventService: DeviceEventService) { }

  private _device = new BehaviorSubject<any>(null);
  private _stock = new BehaviorSubject<Stock>(null);
  private _term = new BehaviorSubject<string>('');
  private _stockTitle = new BehaviorSubject<string>(null);
  private _stockCount = new BehaviorSubject<number>(1);

  // todo: T2는 장소로만으로도 불출 할 수 있어야 한다. serial number 를 0으로 지정한다. 그렇게하면, 유일한 값이 되지 않는다.
  // todo: 카운트도 추가해야함.
  // todo: supply-history도 변경해야함.
  saveSupply(device: Device, stock: Stock) {
    this.deviceEventService.supplyStock(device, stock)
      .subscribe(res => {
        //todo : 성공 혹은 실패 안내하기
        console.log(res);
      })
  }

  get stockTitle() {
    return this._stockTitle.asObservable();
  }

  setStockTitle(title: string) {
    this._stockTitle.next(title);
  }

  get device() {
    return this._device.asObservable();
  }

  setDevice(device: any) {
    this._device.next(device);
  }

  get term() {
    return this._term.asObservable();
  }

  setTerm(term: string) {
    this._term.next(term);
  }

  get stockCount() {
    return this._stockCount.asObservable();
  }

  setStockCount(count: number) {
    this._stockCount.next(count);
  }

  get stock() {
    return this._stock.asObservable();
  }

  setStock(stock: Stock) {
    this._stock.next(stock);
  }
}