import { TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { CurrencyService } from '../service/currency.service';
import { of } from 'rxjs';
import { CurrenciesConversionData } from '../shared/models/currency.interface';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  describe('.ngOnInit()', () => {
    it('should perform an endpoint call to get the supported currency', (done) => {
      spyOn<CurrencyService, any>(
        TestBed.inject(CurrencyService),
        'getCurrencies',
      ).and.returnValue(
        of({
          code: ['USD', 'AED', 'AFN'],
          USD: 'United States Dollar',
          AED: 'United Arab Emirates Dirham',
          AFN: 'Afghan Afghani',
        } as CurrenciesConversionData),
      );
      const component =
        TestBed.createComponent(DashboardComponent).componentInstance;

      component.ngOnInit();
      component.supportedCurrencies$.subscribe((currencies) => {
        expect(currencies).toEqual({
          code: ['USD', 'AED', 'AFN'],
          USD: 'United States Dollar',
          AED: 'United Arab Emirates Dirham',
          AFN: 'Afghan Afghani',
        } as CurrenciesConversionData);
        done();
      });
    });
  });
});
