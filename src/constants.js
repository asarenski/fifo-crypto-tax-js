const historyTypes = {
  MATCH: 'match',
  WITHDRAWAL: 'withdrawal',
  DEPOSIT: 'deposit',
};

const convertedHistoryTypes = {
  BUY: 'BUY',
  SELL: 'SELL',
};

const requiredCsvOutputKeys = [
  'amount',
  'buyDate',
  'buyPrice',
  'buyTotal',
  'saleDate',
  'salePrice',
  'totalSale',
];

const gdaxUsdSecurities = {
  BTC_USD: 'btc-usd',
  ETH_USD: 'eth-usd',
  LTC_USD: 'ltc-usd',
  BCH_USD: 'bch-usd',
};

export {
  historyTypes,
  convertedHistoryTypes,
  requiredCsvOutputKeys,
  gdaxUsdSecurities,
};