import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyHistoryTabPage } from './supply-history-tab.page';
import { DatetimePickerComponent } from './daily-history/datetime-picker/datetime-picker.component';
import { ExpandableLedgerComponent } from './daily-history/expandable-ledger/expandable-ledger.component';
import { DailyHistoryComponent } from './daily-history/daily-history.component';
import { DeviceStockComponent } from './device-stock/device-stock.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(
      [
        { 
          path: '', 
          component: SupplyHistoryTabPage,
          children: [
            {
              path: 'daily',
              component: DailyHistoryComponent
            },
            {
              path: 'device',
              component: DeviceStockComponent
            }
          ]
        }
      ]
      )
  ],
  declarations: [
    SupplyHistoryTabPage, 
    DatetimePickerComponent, 
    ExpandableLedgerComponent,
    DailyHistoryComponent,
    DeviceStockComponent
  ]
})
export class SupplyHistoryTabPageModule { }
