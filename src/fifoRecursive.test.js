import fifoRecursive, { createEntry } from './fifoRecursive';

const createTransaction = (time, amount) => ({time, amount});

describe('fifoRecursive', () => {
  // describe('exported method', () => {

  // });

  describe('createEntry', () => {
    it('should return the entry with the buy and sell times', () => {
      const expectedBuyTime = 'foooo1234'
      const mockBuy = createTransaction(expectedBuyTime, 0.321);

      const expecteSellTime = '4444444442eyyy';
      const mockSell = createTransaction(expecteSellTime, 0.4444);

      const { buyDate, saleDate } = createEntry(mockBuy, mockSell);
      expect(buyDate).toEqual(expectedBuyTime);
      expect(saleDate).toEqual(expecteSellTime);
    });

    it('should return the buy amount if the buy amount is to be discarded after use', () => {
      const expectedAmount = 0.12344;
      const mockBuy = createTransaction('foo', expectedAmount);
      const mockSell = createTransaction('bar', expectedAmount + 0.5);

      const { amount } = createEntry(mockBuy, mockSell);
      expect(amount).toEqual(expectedAmount);
    });

    it('should return the sell amount if the buy amount was greater and is therefore being kept', () => {
      const mockBuy = createTransaction('foo', 0.4444);
      const mockSell = createTransaction('bar', mockBuy.amount - 0.2);

      const { amount } = createEntry(mockBuy, mockSell);
      expect(amount).toEqual(mockSell.amount);
    });

    it('should still work if the buy and sell amounts are the same', () => {
      const mockBoth = createTransaction('jflksjdf', 0.44);
      const entry = createEntry(mockBoth, mockBoth);
      expect(entry).toEqual({
        amount: mockBoth.amount,
        buyDate: mockBoth.time,
        saleDate: mockBoth.time,
      });
    });
  });
});