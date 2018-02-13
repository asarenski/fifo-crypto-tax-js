import createSellEntry from './createSellEntry';

const mockTransaction = (time, amount) => ({time, amount});

describe('createSellEntry', () => {
  it('should return the entry with the buy and sell times', () => {
    const expectedBuyTime = 'foooo1234'
    const mockBuy = mockTransaction(expectedBuyTime, 0.321);

    const expecteSellTime = '4444444442eyyy';
    const mockSell = mockTransaction(expecteSellTime, 0.4444);

    const { buyDate, saleDate } = createSellEntry(mockBuy, mockSell);
    expect(buyDate).toEqual(expectedBuyTime);
    expect(saleDate).toEqual(expecteSellTime);
  });

  it('should return the buy amount if the buy amount is to be discarded after use', () => {
    const expectedAmount = 0.12344;
    const mockBuy = mockTransaction('foo', expectedAmount);
    const mockSell = mockTransaction('bar', expectedAmount + 0.5);

    const { amount } = createSellEntry(mockBuy, mockSell);
    expect(amount).toEqual(expectedAmount);
  });

  it('should return the sell amount if the buy amount was greater and is therefore being kept', () => {
    const mockBuy = mockTransaction('foo', 0.4444);
    const mockSell = mockTransaction('bar', mockBuy.amount - 0.2);

    const { amount } = createSellEntry(mockBuy, mockSell);
    expect(amount).toEqual(mockSell.amount);
  });

  it('should still work if the buy and sell amounts are the same', () => {
    const mockBoth = mockTransaction('jflksjdf', 0.44);
    const entry = createSellEntry(mockBoth, mockBoth);
    expect(entry).toEqual({
      amount: mockBoth.amount,
      buyDate: mockBoth.time,
      saleDate: mockBoth.time,
    });
  });
});