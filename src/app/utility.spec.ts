import {
  formatData,
  getPeriod,
  sortByAlphabetical,
  sortByNumber,
} from './utility';

describe('.sortByAlphabetical', () => {
  describe('and when sort in ascending order', () => {
    it('should sort the currencies in ascending order based on the base currency code', () => {
      const items = sortByAlphabetical(
        [
          {
            amount: 1,
            code: 'USD',
            name: 'United States Dollar',
            url: 'https://flagsapi.com/US/flat/32.png',
          },
          {
            amount: 0.96,
            code: 'EUR',
            name: 'Euro',
            url: 'https://flagsapi.com/EU/flat/32.png',
          },
          {
            amount: 3.6725,
            code: 'AED',
            name: 'United Arab Emirates Dirham',
            url: 'https://flagsapi.com/AE/flat/32.png',
          },
          {
            amount: 155.6622,
            code: 'JMD',
            name: 'Jamaican Dollar',
            url: 'https://flagsapi.com/JM/flat/32.png',
          },
        ],
        'asc',
        'USD',
      );

      expect(items).toEqual([
        {
          amount: 1,
          code: 'USD',
          name: 'United States Dollar',
          url: 'https://flagsapi.com/US/flat/32.png',
        },
        {
          amount: 3.6725,
          code: 'AED',
          name: 'United Arab Emirates Dirham',
          url: 'https://flagsapi.com/AE/flat/32.png',
        },
        {
          amount: 0.96,
          code: 'EUR',
          name: 'Euro',
          url: 'https://flagsapi.com/EU/flat/32.png',
        },
        {
          amount: 155.6622,
          code: 'JMD',
          name: 'Jamaican Dollar',
          url: 'https://flagsapi.com/JM/flat/32.png',
        },
      ]);
    });
  });

  describe('and when sort in descending order', () => {
    it('should sort the currencies in descending order based on the base currency code', () => {
      const items = sortByAlphabetical(
        [
          {
            amount: 1,
            code: 'USD',
            name: 'United States Dollar',
            url: 'https://flagsapi.com/US/flat/32.png',
          },
          {
            amount: 0.96,
            code: 'EUR',
            name: 'Euro',
            url: 'https://flagsapi.com/EU/flat/32.png',
          },
          {
            amount: 3.6725,
            code: 'AED',
            name: 'United Arab Emirates Dirham',
            url: 'https://flagsapi.com/AE/flat/32.png',
          },
          {
            amount: 155.6622,
            code: 'JMD',
            name: 'Jamaican Dollar',
            url: 'https://flagsapi.com/JM/flat/32.png',
          },
        ],
        'desc',
        'USD',
      );

      expect(items).toEqual([
        {
          amount: 1,
          code: 'USD',
          name: 'United States Dollar',
          url: 'https://flagsapi.com/US/flat/32.png',
        },
        {
          amount: 155.6622,
          code: 'JMD',
          name: 'Jamaican Dollar',
          url: 'https://flagsapi.com/JM/flat/32.png',
        },
        {
          amount: 0.96,
          code: 'EUR',
          name: 'Euro',
          url: 'https://flagsapi.com/EU/flat/32.png',
        },
        {
          amount: 3.6725,
          code: 'AED',
          name: 'United Arab Emirates Dirham',
          url: 'https://flagsapi.com/AE/flat/32.png',
        },
      ]);
    });
  });
});

describe('.sortByNumber', () => {
  describe('and when sort in ascending order', () => {
    it('should sort the currencies in ascending order based on the amount', () => {
      const items = sortByNumber(
        [
          {
            amount: 155.6622,
            code: 'JMD',
            name: 'Jamaican Dollar',
            url: 'https://flagsapi.com/JM/flat/32.png',
          },
          {
            amount: 1,
            code: 'USD',
            name: 'United States Dollar',
            url: 'https://flagsapi.com/US/flat/32.png',
          },
          {
            amount: 0.96,
            code: 'EUR',
            name: 'Euro',
            url: 'https://flagsapi.com/EU/flat/32.png',
          },
          {
            amount: 3.6725,
            code: 'AED',
            name: 'United Arab Emirates Dirham',
            url: 'https://flagsapi.com/AE/flat/32.png',
          },
        ],
        'asc',
        'USD',
      );

      expect(items).toEqual([
        {
          amount: 1,
          code: 'USD',
          name: 'United States Dollar',
          url: 'https://flagsapi.com/US/flat/32.png',
        },
        {
          amount: 0.96,
          code: 'EUR',
          name: 'Euro',
          url: 'https://flagsapi.com/EU/flat/32.png',
        },
        {
          amount: 3.6725,
          code: 'AED',
          name: 'United Arab Emirates Dirham',
          url: 'https://flagsapi.com/AE/flat/32.png',
        },
        {
          amount: 155.6622,
          code: 'JMD',
          name: 'Jamaican Dollar',
          url: 'https://flagsapi.com/JM/flat/32.png',
        },
      ]);
    });
  });

  describe('and when sort in descending order', () => {
    it('should sort the currencies in descending order based on the base currency code', () => {
      const items = sortByNumber(
        [
          {
            amount: 1,
            code: 'USD',
            name: 'United States Dollar',
            url: 'https://flagsapi.com/US/flat/32.png',
          },
          {
            amount: 0.96,
            code: 'EUR',
            name: 'Euro',
            url: 'https://flagsapi.com/EU/flat/32.png',
          },
          {
            amount: 3.6725,
            code: 'AED',
            name: 'United Arab Emirates Dirham',
            url: 'https://flagsapi.com/AE/flat/32.png',
          },
          {
            amount: 155.6622,
            code: 'JMD',
            name: 'Jamaican Dollar',
            url: 'https://flagsapi.com/JM/flat/32.png',
          },
        ],
        'desc',
        'USD',
      );

      expect(items).toEqual([
        {
          amount: 1,
          code: 'USD',
          name: 'United States Dollar',
          url: 'https://flagsapi.com/US/flat/32.png',
        },
        {
          amount: 155.6622,
          code: 'JMD',
          name: 'Jamaican Dollar',
          url: 'https://flagsapi.com/JM/flat/32.png',
        },
        {
          amount: 3.6725,
          code: 'AED',
          name: 'United Arab Emirates Dirham',
          url: 'https://flagsapi.com/AE/flat/32.png',
        },
        {
          amount: 0.96,
          code: 'EUR',
          name: 'Euro',
          url: 'https://flagsapi.com/EU/flat/32.png',
        },
      ]);
    });
  });
});

describe('.formatData()', () => {
  it('should format the data ', () => {
    const items = formatData(
      {
        '2024-11-27': { USDEUR: 0.946755, USDCHF: 0.882197 },
        '2024-11-28': { USDEUR: 0.946849, USDCHF: 0.88242 },
        '2024-11-29': { USDEUR: 0.94525, USDCHF: 0.881018 },
        '2024-11-30': { USDEUR: 0.94523, USDCHF: 0.880864 },
      },
      ['EUR', 'CHF'],
      'USD',
    );

    expect(items).toEqual([
      { date: '2024-11-27', EUR: 0.946755, CHF: 0.882197 },
      { date: '2024-11-28', EUR: 0.946849, CHF: 0.88242 },
      { date: '2024-11-29', EUR: 0.94525, CHF: 0.881018 },
      { date: '2024-11-30', EUR: 0.94523, CHF: 0.880864 },
    ] as any);
  });
});

describe('.getPeriod()', () => {
  it('should return 2 days if the period is 48h', () => {
    const range = getPeriod('48h', new Date('2024-11-27T02:23:10.748+0000'));

    expect(range).toEqual({
      startDate: new Date('2024-11-25T02:23:10.748+0000'),
      endDate: new Date('2024-11-27T02:23:10.748+0000'),
    });
  });
  it('should return a week if the period is 1W', () => {
    const range = getPeriod('1W', new Date('2024-11-27T02:23:10.748+0000'));

    expect(range).toEqual({
      startDate: new Date('2024-11-20T02:23:10.748+0000'),
      endDate: new Date('2024-11-27T02:23:10.748+0000'),
    });
  });

  it('should return a month if the period is 1M', () => {
    const range = getPeriod('1M', new Date('2024-11-27T02:23:10.748+0000'));

    expect(range).toEqual({
      startDate: new Date('2024-10-27T02:23:10.748+0000'),
      endDate: new Date('2024-11-27T02:23:10.748+0000'),
    });
  });
});
