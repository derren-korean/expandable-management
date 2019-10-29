import { SupplyTabPageModule } from './supply-tab.module';
import { Observable, BehaviorSubject } from 'rxjs';
import { Device } from '../share/device.model';
import { Stock } from '../share/stock.model';
import { DeviceEventService } from '../share/device-event.service';

export class SupplyTabService {

  constructor(private deviceEventService: DeviceEventService) { }

  private device = new BehaviorSubject<any>(null);
  private term = new BehaviorSubject<string>('');

  // todo: T2는 장소로만으로도 불출 할 수 있어야 한다.
  saveSupply(device: Device, stock: Stock) {
    this.deviceEventService.supplyStock(device, stock)
      .subscribe(res => {
        //todo : 성공 혹은 실패 안내하기
        console.log(res);
      })
  }

  changeDevice() {
    return this.device.asObservable();
  }

  setDevice(device: any) {
    this.device.next(device);
  }

  changeTerm() {
    return this.term.asObservable();
  }

  setTerm(term: string) {
    this.term.next(term);
  }
}