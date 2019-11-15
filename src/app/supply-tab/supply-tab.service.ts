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
  private _term = new BehaviorSubject<string>('');
  private stockTitle = new BehaviorSubject<string>(null);

  // todo: T2는 장소로만으로도 불출 할 수 있어야 한다.
  saveSupply(device: Device, stock: Stock) {
    this.deviceEventService.supplyStock(device, stock)
      .subscribe(res => {
        //todo : 성공 혹은 실패 안내하기
        console.log(res);
      })
  }

  changeStockTitle() {
    return this.stockTitle.asObservable();
  }

  setStockTitle(title: any) {
    this.stockTitle.next(title);
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
}