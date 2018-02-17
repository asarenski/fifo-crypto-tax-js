import Queue from '../Queue';
import createSellEntry from './createSellEntry';
import { fixFloat } from '../util/mathUtil';

const fifoRecursive = (q, sell, collected = []) => {
  const buy = q.dequeue();
  if (!buy) {
      throw new Error(`Value was ${buy}. This means the amount sum is not zero. Something is wrong with the csv.`);
  }

  if (fixFloat(buy.amount - sell.amount) >= 0) {
      const entry = createSellEntry(buy, sell);
      const remainingBuy = {
        ...buy,
        amount: fixFloat(buy.amount - sell.amount)
      };

      const buyQueue = new Queue(q.array);
      if (remainingBuy.amount > 0) {
        buyQueue.restack(remainingBuy);
      }

      return {
        buyQueue,
        sellEntries: [...collected, entry],
      };
  }

  const sellEntry = {
    ...sell,
    amount: buy.amount
  };
  const entry = createSellEntry(buy, sellEntry);

  const remainingSell = {
    ...sell,
    amount: fixFloat(sell.amount - buy.amount)
  };
  return fifoRecursive(q, remainingSell, [...collected, entry]);
};

export default fifoRecursive;