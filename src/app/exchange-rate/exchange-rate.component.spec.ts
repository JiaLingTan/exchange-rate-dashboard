import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ExchangeRateComponent } from './exchange-rate.component';
import { CurrencyService } from '../service/currency.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EMPTY, of, take, toArray } from 'rxjs';

describe('ExchangeRateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRateComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  describe('When the component is ready', () => {
    it('should defined the display columns', () => {
      const component = TestBed.createComponent(
        ExchangeRateComponent,
      ).componentInstance;

      expect(component.displayedColumns).toEqual([
        'COMPARE_CHECKBOX',
        'CURRENCY',
        'AMOUNT',
      ]);
    });

    it('should field got search and baseCode', () => {
      const component = TestBed.createComponent(
        ExchangeRateComponent,
      ).componentInstance;

      expect(component.searchField.value).toEqual('');
      expect(component.basedCodeField.value).toEqual('USD');
    });
  });

  describe('.ngOnInit()', () => {
    describe('and when the based code value change', () => {
      it('should perform endpoint call to get the exchange rate', (done) => {
        const getExchangeRateSpy = spyOn<CurrencyService, any>(
          TestBed.inject(CurrencyService),
          'getExchangeRate',
        ).and.returnValue(
          of({
            conversionRates: {
              code: ['EUR', 'CHF'],
              EUR: 0.94523,
              CHF: 0.880864,
            },
            baseCode: 'USD',
          }),
        );
        const component = TestBed.createComponent(
          ExchangeRateComponent,
        ).componentInstance;
        component.ngOnInit();
        component.exchangeRates$.subscribe((data) => {
          expect(getExchangeRateSpy).toHaveBeenCalledWith('USD' as any);
          expect(data).toEqual({
            conversionRates: {
              code: ['EUR', 'CHF'],
              EUR: 0.94523,
              CHF: 0.880864,
            },
            baseCode: 'USD',
          });
          done();
        });
      });
    });

    describe('and when the sort change', () => {
      it('should sort the rates accordingly', (done) => {
        spyOn<CurrencyService, any>(
          TestBed.inject(CurrencyService),
          'getExchangeRate',
        ).and.returnValue(
          of({
            conversionRates: {
              code: ['EUR', 'CHF'],
              EUR: 0.94523,
              CHF: 0.880864,
            },
            baseCode: 'USD',
          }),
        );

        const component = TestBed.createComponent(
          ExchangeRateComponent,
        ).componentInstance;
        component.supportedCurrencies = {
          code: ['CHF', 'EUR'],
          CHF: 'Swiss Franc',
          EUR: 'Euro',
        };
        component.ngOnInit();

        component.sortedRates$.pipe(take(2), toArray()).subscribe((rates) => {
          expect(rates[0]).toEqual([
            {
              code: 'CHF',
              name: 'Swiss Franc',
              amount: 0.880864,
              url: 'https://flagsapi.com/CH/flat/32.png',
            },
            {
              code: 'EUR',
              name: 'Euro',
              amount: 0.94523,
              url: 'https://flagsapi.com/EU/flat/32.png',
            },
          ]);
          expect(rates[1]).toEqual([
            {
              code: 'EUR',
              name: 'Euro',
              amount: 0.94523,
              url: 'https://flagsapi.com/EU/flat/32.png',
            },
            {
              code: 'CHF',
              name: 'Swiss Franc',
              amount: 0.880864,
              url: 'https://flagsapi.com/CH/flat/32.png',
            },
          ]);
          done();
        });
        component.sortSub$.next({ order: 'desc', field: 'AMOUNT' });
      });
    });

    describe('and when the search value change', () => {
      it('should filter the list', fakeAsync(() => {
        spyOn<CurrencyService, any>(
          TestBed.inject(CurrencyService),
          'getExchangeRate',
        ).and.returnValue(
          of({
            conversionRates: {
              code: ['EUR', 'CHF', 'ALL', 'AUD'],
              EUR: 0.94523,
              CHF: 0.880864,
              ALL: 94.6641,
              AUD: 1.6065,
            },
            baseCode: 'USD',
          }),
        );

        const component = TestBed.createComponent(
          ExchangeRateComponent,
        ).componentInstance;
        component.supportedCurrencies = {
          code: ['CHF', 'EUR', 'ALL', 'AUD'],
          CHF: 'Swiss Franc',
          EUR: 'Euro',
          ALL: 'Albanian Lek',
          AUD: 'Australian Dollar',
        };
        component.ngOnInit();

        component.sortedRates$.pipe(take(2), toArray()).subscribe((rates) => {
          expect(rates[0]).toEqual([
            {
              code: 'ALL',
              name: 'Albanian Lek',
              amount: 94.6641,
              url: 'https://flagsapi.com/AL/flat/32.png',
            },
            {
              code: 'AUD',
              name: 'Australian Dollar',
              amount: 1.6065,
              url: 'https://flagsapi.com/AU/flat/32.png',
            },
            {
              code: 'CHF',
              name: 'Swiss Franc',
              amount: 0.880864,
              url: 'https://flagsapi.com/CH/flat/32.png',
            },
            {
              code: 'EUR',
              name: 'Euro',
              amount: 0.94523,
              url: 'https://flagsapi.com/EU/flat/32.png',
            },
          ]);
          expect(rates[1]).toEqual([
            {
              code: 'ALL',
              name: 'Albanian Lek',
              amount: 94.6641,
              url: 'https://flagsapi.com/AL/flat/32.png',
            },
            {
              code: 'AUD',
              name: 'Australian Dollar',
              amount: 1.6065,
              url: 'https://flagsapi.com/AU/flat/32.png',
            },
          ]);
        });
        component.searchField.setValue('AL');
        tick(500);
      }));
    });
  });

  describe('.compareRates()', () => {
    it('should perform an endpoint call to retrieve the comparison rate', () => {
      const compareCurrencySpy = spyOn<CurrencyService, any>(
        TestBed.inject(CurrencyService),
        'compareTheCurrency',
      ).and.returnValue(EMPTY);
      const component = TestBed.createComponent(
        ExchangeRateComponent,
      ).componentInstance;
      jasmine.clock().mockDate(new Date('2024-11-25T02:23:10.748+0000'));

      component.compareRates(['EUR', 'CHF'], 'USD', '1M');
      expect(compareCurrencySpy).toHaveBeenCalledWith(
        'EUR,CHF' as any,
        '2024-10-25' as any,
        '2024-11-25' as any,
        'USD' as any,
      );
    });

    it('should update the comparison data', (done) => {
      const compareCurrencySpy = spyOn<CurrencyService, any>(
        TestBed.inject(CurrencyService),
        'compareTheCurrency',
      ).and.returnValue(
        of({
          quotes: {
            '2024-11-27': { USDEUR: 0.946755, USDCHF: 0.882197 },
            '2024-11-28': { USDEUR: 0.946849, USDCHF: 0.88242 },
            '2024-11-29': { USDEUR: 0.94525, USDCHF: 0.881018 },
            '2024-11-30': { USDEUR: 0.94523, USDCHF: 0.880864 },
          },
        } as any),
      );
      const component = TestBed.createComponent(
        ExchangeRateComponent,
      ).componentInstance;
      jasmine.clock().mockDate(new Date('2024-11-25T02:23:10.748+0000'));

      component.comparison$.subscribe((data) => {
        expect(data).toEqual({
          metrics: [
            { date: '2024-11-27', EUR: 0.946755, CHF: 0.882197 },
            { date: '2024-11-28', EUR: 0.946849, CHF: 0.88242 },
            { date: '2024-11-29', EUR: 0.94525, CHF: 0.881018 },
            { date: '2024-11-30', EUR: 0.94523, CHF: 0.880864 },
          ],
          baseCode: 'USD',
        });
        done();
      });
      component.compareRates(['EUR', 'CHF'], 'USD', '1M');
      expect(compareCurrencySpy).toHaveBeenCalledWith(
        'EUR,CHF' as any,
        '2024-10-25' as any,
        '2024-11-25' as any,
        'USD' as any,
      );
    });
  });
});
