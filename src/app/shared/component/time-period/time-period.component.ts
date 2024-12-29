import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export type PERIOD = '48h' | '1W' | '1M';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-time-period',
  standalone: true,
  imports: [MatButtonModule, NgClass, MatButtonToggleModule],
  templateUrl: './time-period.component.html',
})
export class TimePeriodComponent {
  @Input()
  currentPeriod: PERIOD;
  @Output()
  onPeriodClick = new EventEmitter<PERIOD>();
}
