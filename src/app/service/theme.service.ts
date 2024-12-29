import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkModeSub$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  getDarkMode() {
    return this.darkModeSub$.asObservable();
  }

  setDarkMode(curDarkMode: boolean) {
    const toggleDarkMode = !curDarkMode;
    this.darkModeSub$.next(toggleDarkMode);

    if (toggleDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.setAttribute('data-bs-theme', 'light');
    }
  }
}
