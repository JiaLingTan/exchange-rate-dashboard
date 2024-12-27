import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrenciesConversionData } from '../shared/models/currency.interface';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyService } from '../service/currency.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-convertor',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './convertor.component.html',
  styleUrl: './convertor.component.css',
})
export class ConvertorComponent {
  @Input()
  supportedCurrencies: CurrenciesConversionData;
  form: FormGroup;
  convertedDataSub$ = new BehaviorSubject<any>('');
  convertedData$ = this.convertedDataSub$.asObservable();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
  ) {
    this.form = this.fb.group({
      amount: new FormControl('1.00', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      from: new FormControl('USD', Validators.required),
      to: new FormControl('EUR', Validators.required),
    });
  }

  onSubmit(amount: string, from: string, to: string) {
    this.currencyService
      .pairCurrencyWithAmount(amount, from, to)
      .subscribe((data) => this.convertedDataSub$.next(data));
  }
}
