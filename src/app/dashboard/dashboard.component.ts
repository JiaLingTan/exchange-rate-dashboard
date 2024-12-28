import { Component, OnInit } from '@angular/core';
import { ExchangeRateComponent } from '../exchange-rate/exchange-rate.component';
import { ConvertorComponent } from '../convertor/convertor.component';
import { CurrencyService } from '../service/currency.service';
import { Observable, of, share, switchMap, tap } from 'rxjs';
import { CurrenciesConversionData } from '../shared/models/currency.interface';
import { AsyncPipe, NgIf } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ExchangeRateComponent, ConvertorComponent, AsyncPipe, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  supportedCurrencies$: Observable<CurrenciesConversionData>;
  isOnline$: Observable<boolean>;

  constructor(
    private currencyService: CurrencyService,
    private localStorage: LocalStorageService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isOnline$ = this.localStorage.isOnlineSub$.asObservable();
    this.supportedCurrencies$ = this.isOnline$.pipe(
      switchMap((isOnline) => {
        if (isOnline) {
          return this.currencyService
            .getCurrencies()
            .pipe(
              tap((supportedCurrencies) =>
                this.localStorage.saveRateToStorage(
                  'supported-currencies',
                  supportedCurrencies,
                ),
              ),
            );
        } else {
          this.snackBar.open(
            'You are currently offline and the rate may be outdated',
            '',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['notification-warning'],
            },
          );
          return of(
            this.localStorage.loadStoredRate(
              'supported-currencies',
            ) as CurrenciesConversionData,
          );
        }
      }),
      share(),
    );
  }
}
