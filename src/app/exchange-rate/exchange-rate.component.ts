import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CurrencyService } from '../service/currency.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CurrenciesConversionData,
  Currency,
  CurrencyRateInfo,
} from '../shared/models/currency.interface';
import {
  formatData,
  getPeriod,
  sortByAlphabetical,
  sortByNumber,
} from '../utility';
import { ExchangeRateSearchComponent } from './exchange-rate-search/exchange-rate-search.component';
import { FormControl } from '@angular/forms';
import { formatDate } from 'date-fns';
import { ExchangeRateHistoricalComponent } from './exchange-rate-historical/exchange-rate-historical.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComparisonRateAnalysis } from '../shared/models/comparison.interface';
import { PERIOD } from '../shared/component/time-period/time-period.component';
import { LocalStorageService } from '../service/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    MatSortModule,
    CommonModule,
    MatCheckboxModule,
    ExchangeRateSearchComponent,
    ExchangeRateHistoricalComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.css',
})
export class ExchangeRateComponent implements OnInit {
  @Input()
  supportedCurrencies: CurrenciesConversionData;

  displayedColumns = ['COMPARE_CHECKBOX', 'CURRENCY', 'AMOUNT'];
  exchangeRates$: Observable<CurrencyRateInfo>;
  sortedRates$: Observable<Currency[]>;
  searchField = new FormControl('');
  basedCodeField = new FormControl('USD');

  sortSub$: BehaviorSubject<{
    order: 'asc' | 'desc' | '';
    field: string;
  }> = new BehaviorSubject({ order: 'asc', field: 'CURRENCY' });
  selection = new SelectionModel(true, []);

  comparisonSub$: Subject<ComparisonRateAnalysis> = new Subject();
  comparison$: Observable<ComparisonRateAnalysis> =
    this.comparisonSub$.asObservable();

  periodSub$: Subject<PERIOD> = new BehaviorSubject<PERIOD>('1M');
  period$: Observable<PERIOD> = this.periodSub$.asObservable();

  isOnline$: Observable<boolean>;

  constructor(
    private currencyService: CurrencyService,
    private localService: LocalStorageService,
    private snackBar: MatSnackBar,
  ) {
    this.isOnline$ = this.localService.isOnlineSub$.asObservable();
  }

  ngOnInit(): void {
    this.exchangeRates$ = this.basedCodeField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith('USD'),
      withLatestFrom(this.isOnline$),
      switchMap(([code, isOnline]: [string, boolean]) => {
        this.selection.clear();
        if (isOnline) {
          return this.currencyService.getExchangeRate(code).pipe(
            tap((rate) => this.localService.saveRateToStorage(code, rate)),
            catchError((err) => {
              console.error('API call failed', err);
              return of(null);
            }),
          );
        } else {
          const storedData = this.localService.loadStoredRate(
            code,
          ) as CurrencyRateInfo;
          this.snackBar.open(
            storedData
              ? 'You are currently offline and the rate may be outdated'
              : 'You are currently offline. Unable to retrieve the latest rate',
            '',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: [
                storedData ? 'notification-warning' : 'notification-error',
              ],
            },
          );
          return of(storedData);
        }
      }),
    );

    const formattedRates$: Observable<{
      baseCode: string;
      currency: Currency[];
    }> = this.exchangeRates$.pipe(
      filter(
        (exchangeRate) =>
          exchangeRate && exchangeRate.conversionRates.code.length > 0,
      ),
      map((exchangeRate) => {
        const formattedRates: Currency[] = [];
        exchangeRate.conversionRates.code.forEach((code) =>
          formattedRates.push(<Currency>{
            code,
            name: this.supportedCurrencies[code] || '',
            amount: exchangeRate.conversionRates[code],
            url: `https://flagsapi.com/${code.substring(0, 2)}/flat/32.png`,
          }),
        );
        return { ...exchangeRate, currency: formattedRates };
      }),
    );

    const searchChanges$ = this.searchField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((value: string) => value.toLowerCase()),
      startWith(''),
    );

    this.sortedRates$ = combineLatest([
      formattedRates$,
      this.sortSub$.asObservable(),
      searchChanges$,
    ]).pipe(
      map(([formattedRates, sort, searchValue]) => {
        const filteredCurrency: Currency[] = formattedRates.currency.filter(
          (item) => {
            if (item.code === formattedRates.baseCode) {
              return true;
            }

            return (
              item.code.toLowerCase().includes(searchValue) ||
              item.name.toLowerCase().includes(searchValue)
            );
          },
        );

        return sort.field === 'CURRENCY'
          ? sortByAlphabetical(
              filteredCurrency,
              sort.order,
              formattedRates.baseCode,
            )
          : sortByNumber(filteredCurrency, sort.order, formattedRates.baseCode);
      }),
    );
  }

  compareRates(selection: string[], source: string, period: PERIOD) {
    const dateRange = getPeriod(period, new Date());
    this.periodSub$.next(period);
    this.currencyService
      .compareTheCurrency(
        selection.join(','),
        formatDate(dateRange.startDate, 'yyyy-MM-dd'),
        formatDate(dateRange.endDate, 'yyyy-MM-dd'),
        source,
      )
      .pipe(
        map((data: any) => ({
          metrics: formatData(data?.quotes, selection, source),
          baseCode: source,
        })),
        catchError((err) => {
          console.error('API call failed', err);
          return of(null);
        }),
      )
      .subscribe((comparison) => this.comparisonSub$.next(comparison));
  }
}
