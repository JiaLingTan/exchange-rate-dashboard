export interface Currency {
  code: string;
  name: string;
  amount: number;
  url: string;
}

export interface CurrenciesConversionData {
  code: string[];

  [key: string]: number | string | string[];
}

export interface CurrencyRateInfo {
  conversionRates: CurrenciesConversionData;
  baseCode: string;
}
