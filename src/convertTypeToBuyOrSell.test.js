import { historyTypes, convertedHistoryTypes } from "./constants";
import convertTypeToBuyOrSell from "./convertTypeToBuyOrSell";

describe('convertTypeToBuyOrSell', () => {
  it('takes a list of gdax history objects and adds a converted type field with value buy or sell', () => {
    const testCases = [
      {
        type: historyTypes.MATCH,
        amount: parseFloat('12.53'),
        expectedType: convertedHistoryTypes.BUY
      },
      {
        type: historyTypes.MATCH,
        amount: parseFloat('-12.53'),
        expectedType: convertedHistoryTypes.SELL
      },
      {
        type: historyTypes.WITHDRAWAL,
        amount: parseFloat('-12.53'),
        expectedType: convertedHistoryTypes.SELL
      },
      {
        type: historyTypes.DEPOSIT,
        amount: parseFloat('-12.53'),
        expectedType: convertedHistoryTypes.BUY
      },
    ];

    const actuals = convertTypeToBuyOrSell(testCases);

    actuals.forEach((convertedHistObj) => {
      expect(convertedHistObj.convertedType).toEqual(convertedHistObj.expectedType);
    });
  });
});