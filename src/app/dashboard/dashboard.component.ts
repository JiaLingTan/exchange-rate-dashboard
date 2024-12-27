import { Component, OnInit } from '@angular/core';
import { ExchangeRateComponent } from '../exchange-rate/exchange-rate.component';
import { ConvertorComponent } from '../convertor/convertor.component';
import { CurrencyService } from '../service/currency.service';
import { Observable, share } from 'rxjs';
import { CurrenciesConversionData } from '../shared/models/currency.interface';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ExchangeRateComponent, ConvertorComponent, AsyncPipe, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  supportedCurrencies$: Observable<CurrenciesConversionData>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.supportedCurrencies$ = this.currencyService
      .getCurrencies()
      .pipe(share());
  }
}
