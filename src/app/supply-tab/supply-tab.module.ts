import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyTabPage } from './supply-tab.page';
import { StockSearchbarComponent } from '../share/stock-searchbar/stock-searchbar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SupplyTabPage }])
  ],
  declarations: [SupplyTabPage, StockSearchbarComponent]
})
export class SupplyTabPageModule { }
