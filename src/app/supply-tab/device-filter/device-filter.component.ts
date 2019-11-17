import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplyTabService, DeviceView } from '../supply-tab.service';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-device-filter',
  templateUrl: './device-filter.component.html',
  styleUrls: ['./device-filter.component.scss'],
})
export class DeviceFilterComponent implements OnInit {
@ViewChild('deviceTerm', { static: true }) deviceTerm: string;
  constructor(private supplyTabService: SupplyTabService) { }

  ngOnInit() {
    this.supplyTabService.device.subscribe((device: DeviceView) => {
      if (device) {
        this.setTerm(device.getLastSerialNumber());
      }
    }).add(
      // 장비 uncheck을 통해서 term의 조건을 지정할 수 있다. 이 패턴 때문에 emitFilterTerm이 2번 호출됨...
      this.supplyTabService.deviceTerm.subscribe((deviceTerm: string) => {
        this.setTerm(deviceTerm);
      })
    )
  }

  setTerm(term: string) {
    if (this.deviceTerm !== term) {
      this.deviceTerm = term;
    }
  }

  emitFilterTerm(term: string) {
    this.supplyTabService.setDeviceTerm(term);
  }

}
