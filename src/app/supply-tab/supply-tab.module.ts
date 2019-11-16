import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyTabPage } from './supply-tab.page';
import { AutocompleteSearchbarComponent } from '../share/autocomplete-searchbar/autocomplete-searchbar.component';
import { SearchHeaderComponent } from './search-header/search-header.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { SupplyTabService } from './supply-tab.service';
import { DeviceItemComponent } from './device-list/device-item/device-item.component';
import { StockSelectComponent } from './stock-select/stock-select.component';
import { StepCounterComponent } from './stock-select/step-counter/step-counter.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SupplyTabPage }])
  ],
  providers: [SupplyTabService],
  declarations: [SupplyTabPage, AutocompleteSearchbarComponent, SearchHeaderComponent, DeviceListComponent, DeviceItemComponent, StockSelectComponent, StepCounterComponent]
})
export class SupplyTabPageModule { }
