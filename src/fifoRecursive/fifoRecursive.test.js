import fifoRecursive from './fifoRecursive';
import Queue from '../Queue';
import moment from 'moment';

const mockTransaction = (amount, time) => ({amount, time});
const generateSellEntry = (amount, buyDate, saleDate) => ({amount, buyDate, saleDate});

describe('fifoRecursive', () => {
  it('creates one entry if sell amount equal to one buy amount', () => {
    const buy1 = mockTransaction(0.222, moment().subtract(10, 'minutes'));
    const buy2 = mockTransaction(0.111, moment().subtract(30, 'minutes'))
    const buys = new Queue([buy2, buy1]);

    const sell = mockTransaction(0.222, moment());
    const { buyQueue, sellEntries } = fifoRecursive(buys, sell);

    expect(buyQueue).toEqual(new Queue([buy2]));
    expect(sellEntries).toEqual([
      generateSellEntry(buy1.amount, buy1.time, sell.time),
    ]);
  });

  it('creates multiple sale entries if sell amount equal to multiple buy amounts', () => {
    const buy1 = mockTransaction(0.222, moment().subtract(10, 'minutes'));
    const buy2 = mockTransaction(0.111, moment().subtract(30, 'minutes'))
    const buys = new Queue([buy2, buy1]);

    const sell = mockTransaction(0.333, moment());
    const { buyQueue, sellEntries } = fifoRecursive(buys, sell);

    expect(buyQueue).toEqual(new Queue());
    expect(sellEntries).toEqual([
      generateSellEntry(buy1.amount, buy1.time, sell.time),
      generateSellEntry(buy2.amount, buy2.time, sell.time),
    ]);
  });
});