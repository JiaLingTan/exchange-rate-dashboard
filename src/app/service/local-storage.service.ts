import { Injectable } from '@angular/core';
import {
  CurrenciesConversionData,
  CurrencyRateInfo,
} from '../shared/models/currency.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  isOnlineSub$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.setupOnlineListener();
  }

  setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnlineSub$.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnlineSub$.next(false);
    });
  }

  loadStoredRate(key: string): CurrenciesConversionData | CurrencyRateInfo {
    return JSON.parse(localStorage.getItem(key));
  }

  saveRateToStorage(
    key: string,
    value: CurrenciesConversionData | CurrencyRateInfo,
  ) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
