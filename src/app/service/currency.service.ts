import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CurrenciesConversionData,
  CurrencyRateInfo,
} from '../shared/models/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private basePath =
    'https://v6.exchangerate-api.com/v6/6edcc17bbcb2cdf30ac867cf/';
  private basePathCurrencyLayer =
    'https://api.currencylayer.com/timeframe?access_key=c0526b62c37750ac00ba4b42713098f1';

  constructor(private http: HttpClient) {}

  getExchangeRate(code: string): Observable<CurrencyRateInfo> {
    return this.http
      .get<{
        conversion_rates: any;
        base_code: string;
      }>(`${this.basePath}latest/${code}`)
      .pipe(
        map(({ conversion_rates, base_code }) => ({
          conversionRates: {
            code: Object.keys(conversion_rates),
            ...conversion_rates,
          },
          baseCode: base_code,
        })),
      );
  }

  getCurrencies(): Observable<CurrenciesConversionData> {
    return this.http
      .get<{ [key: string]: string }>('assets/currencies.json')
      .pipe(
        map((currencies) => ({
          code: Object.keys(currencies),
          ...currencies,
        })),
      );
  }

  pairCurrencyWithAmount(amount: string, from: string, to: string) {
    return this.http.get(`${this.basePath}pair/${from}/${to}/${amount}`);
  }

  compareTheCurrency(
    currencies: string,
    startDate: string,
    endDate: string,
    source: string,
  ) {
    return this.http.get(
      `${this.basePathCurrencyLayer}&currencies=${currencies}&start_date=${startDate}&end_date=${endDate}&source=${source}`,
    );
  }
}
