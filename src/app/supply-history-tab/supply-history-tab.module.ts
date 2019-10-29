import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyHistoryTabPage } from './supply-history-tab.page';
import { DatetimePickerComponent } from '../supply-history-tab/datetime-picker/datetime-picker.component';
import { ExpandableLedgerComponent } from './expandable-ledger/expandable-ledger.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SupplyHistoryTabPage }])
  ],
  declarations: [SupplyHistoryTabPage, DatetimePickerComponent, ExpandableLedgerComponent]
})
export class SupplyHistoryTabPageModule { }
