# Exchange Rate Dashboard

This is an interactive Exchange Rate Dashboard that allows users to monitor and compare exchange rates between multiple currencies.
The platform provides real-time rates, allows comparison of up to three currencies,
and displays historical trends through an interactive chart.

Please note that this project uses the free APIs from [CurrencyLayer](https://currencylayer.com/documentation)
and [ExchangeRate-api](https://www.exchangerate-api.com/docs/overview). These free API plans have monthly usage limits, which may be reached over time.
If you encounter any issues with API limits, you can easily update the API Access Key in the currency service file.

### Prerequisites

- [NPM](https://www.npmjs.com/get-npm)
- [Google Chrome](https://www.google.com/chrome/browser/desktop/)

### Setting up Dev

```shell
git clone git@github.com:JiaLingTan/exchange-rate-dashboard.git
npm install
```

This will pull the code from the git repository and install all the needed dependencies for the application

## Development server

```shell
ng serve
```

or

```shell
npm start
```

To start the dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```shell
ng build
```

To build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

```shell
ng test
```

or

```shell
npm test
```

To execute the unit tests via [Karma](https://karma-runner.github.io).
