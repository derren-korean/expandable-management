import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FailureHistoryTabPage } from './failure-history-tab.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FailureHistoryTabPage }])
  ],
  declarations: [FailureHistoryTabPage]
})
export class FailureHistoryTabPageModule { }
