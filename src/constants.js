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

export {
  historyTypes,
  convertedHistoryTypes,
  requiredCsvOutputKeys,
};