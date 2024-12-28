import { TestBed } from '@angular/core/testing';

import { ConvertorComponent } from './convertor.component';
import { CurrencyService } from '../service/currency.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, take, throwError, toArray } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ConvertorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertorComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  describe('.constructor()', () => {
    it('should generate the convertor form', () => {
      const component =
        TestBed.createComponent(ConvertorComponent).componentInstance;

      expect(component.form.value).toEqual({
        amount: '1.00',
        from: 'USD',
        to: 'EUR',
      });
    });
  });

  describe('.onSubmit()', () => {
    it('should perform endpoint call to pair currency with amount', (done) => {
      spyOn<CurrencyService, any>(
        TestBed.inject(CurrencyService),
        'pairCurrencyWithAmount',
      ).and.returnValue(
        of({
          time_last_update_unix: 1734825601,
          time_next_update_unix: 1734912001,
          base_code: 'USD',
          target_code: 'EUR',
          conversion_rate: 0.96,
          conversion_result: 575.04,
        }),
      );

      const component =
        TestBed.createComponent(ConvertorComponent).componentInstance;

      component.convertedData$.pipe(take(2), toArray()).subscribe((data) => {
        expect(data[1]).toEqual({
          time_last_update_unix: 1734825601,
          time_next_update_unix: 1734912001,
          base_code: 'USD',
          target_code: 'EUR',
          conversion_rate: 0.96,
          conversion_result: 575.04,
        });
        done();
      });
      component.onSubmit('599', 'USD', 'EUR');
    });

    it('should show a snackbar if fail to retrieve the data', () => {
      spyOn<CurrencyService, any>(
        TestBed.inject(CurrencyService),
        'pairCurrencyWithAmount',
      ).and.returnValue(throwError(() => new Error('Server Error')));
      const openSnackSpy = spyOn<MatSnackBar, any>(
        TestBed.inject(MatSnackBar),
        'open',
      );

      const component =
        TestBed.createComponent(ConvertorComponent).componentInstance;
      component.onSubmit('599', 'USD', 'EUR');
      expect(openSnackSpy).toHaveBeenCalledOnceWith(
        'There is an error. Please try again later' as any,
        '' as any,
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['notification-error'],
        } as any,
      );
    });
  });
});
