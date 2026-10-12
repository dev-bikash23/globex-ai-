# Currency Integration (Frankfurter API / European Central Bank)

## Overview
GlobeX AI integrates real-time currency exchange rates and list of supported currencies using the **Frankfurter API** (published by the European Central Bank).

## Technical Specs
- **Provider**: Frankfurter (`FrankfurterCurrencyProvider`)
- **Data Source**: European Central Bank (ECB)
- **API Key**: Not required
- **Base URL**: `https://api.frankfurter.app`
- **Cache TTL**:
  - Exchange Rates: 6 hours (`currency_rates` cache)
  - Currencies List: 24 hours (`supported_currencies` cache)

## Features
- **Direct Rates**: Fetched for EUR and ~33 supported major base currencies.
- **Cross-Rate Pivot Calculation**: When non-EUR base currencies (such as INR, JPY, GBP) are requested against target currencies, rates are computed dynamically via EUR pivot (`EUR -> Target / EUR -> Base`).
- **Identity Conversion**: Returns 1.0 rate instantly when base == target.

## Endpoints Implemented
- `GET /api/v1/currency/rates?base={BASE}&target={TARGET}` (Public endpoint)
- `GET /api/v1/currency/currencies` (Public endpoint)