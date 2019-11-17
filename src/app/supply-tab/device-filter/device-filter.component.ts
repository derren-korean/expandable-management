import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplyTabService, DeviceView } from '../supply-tab.service';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-device-filter',
  templateUrl: './device-filter.component.html',
  styleUrls: ['./device-filter.component.scss'],
})
export class DeviceFilterComponent implements OnInit {
  // role: 
  // 자신의 filter값을 device-list로 보내주는 작업,

// ionChange로 값을 변경할 때마다 stockService로 emit
@ViewChild('deviceTerm', { static: true }) deviceTerm: IonSearchbar;
 private prevTerm: string = null;

  constructor(private supplyTabService: SupplyTabService) { }

  ngOnInit() {
    this.supplyTabService.device.subscribe((device: DeviceView) => {
      if (device) {
        this.setValue(device.getLastSerialNumber());
      }
    }).add(
      // 장비 uncheck을 통해서 term의 조건을 지정할 수 있다.
      this.supplyTabService.deviceTerm.subscribe((deviceTerm: string) => {
        this.deviceTerm.getInputElement().then((el) => { 
          if (deviceTerm !== el.value) {
            this.setValue(deviceTerm);
          }
        })
      })
    )
  }

  setValue(text: string) {
    this.deviceTerm.getInputElement().then((el) => { 
      el.value = text;
    })
  }

  emitFilterTerm(term: any) {
    this.supplyTabService.setDeviceTerm(term.target.value);
  }

}
