import { historyTypes, convertedHistoryTypes } from './constants';

const convertType = (type, amount) => {
  switch (type) {
    case historyTypes.MATCH:
      return parseFloat(amount) > 0 ? convertedHistoryTypes.BUY : convertedHistoryTypes.SELL;
    case historyTypes.WITHDRAWAL:
      return convertedHistoryTypes.SELL
    case historyTypes.DEPOSIT:
      return convertedHistoryTypes.BUY
  }
};

const convertTypeToBuyOrSell = (historyObjects) => {
  return historyObjects.map((historyObject) => {
    return {
      convertedType: convertType(historyObject.type, historyObject.amount),
      ...historyObject,
    };
  });
};

export default convertTypeToBuyOrSell;