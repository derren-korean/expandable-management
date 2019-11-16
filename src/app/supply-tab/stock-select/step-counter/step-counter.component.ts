import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplyTabService } from '../../supply-tab.service';

@Component({
  selector: 'app-step-counter',
  templateUrl: './step-counter.component.html',
  styleUrls: ['./step-counter.component.scss'],
})
export class StepCounterComponent implements OnInit, OnDestroy {

  count: number = 1;
  constructor(private supplyService: SupplyTabService) { }

  ngOnInit() {
    this.count = 1;
    this.supplyService.setStockCount(1);
  }

  increase() {
    this.supplyService.setStockCount(++this.count);
  }

  decrease() {
    if (this.count > 1) {
      this.supplyService.setStockCount(--this.count);
    }
  }

  ngOnDestroy() {
    this.supplyService.setStockCount(1);
  }

}
