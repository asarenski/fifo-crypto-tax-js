import Queue from '../Queue';
import createSellEntry from './createSellEntry';
import { fixFloat } from '../mathUtil';

const fifoRecursive = (q, sell, collected = []) => {
  // console.log('')
  const buy = q.dequeue();
  if (!buy) {
      throw new Error(`value was undefined ${buy}, fix map of sale transactions!`);
  }

  // console.log('buy amount', buy.amount);
  // console.log('sell amount', sell.amount);
  // console.log('buy - sell >= 0: ', fixFloat(buy.amount - sell.amount) === 0);

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
  
  // console.log('q is: ', q)
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