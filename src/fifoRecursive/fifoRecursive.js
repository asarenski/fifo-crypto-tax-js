import Queue from "../Queue";

const fifoRecursive = (q, sell, collected) => {
  const buy = q.dequeue();
  if (!buy) {
      throw new Error(`value was undefined ${buy}, fix map of sale transactions!`);
  }
  if (buy.amount - sell.amount >= 0) {
      const entry = createFifoEntry(buy, sell);
      const subtractedBuy = {
        ...buy,
        amount: buy.amount - sell.amount
      };

      const recursedQ = new Queue(q.array);
      if (subtractedBuy.amount > 0) {
        recursedQ.restack(subtractedBuy);
      }

      return {
        recursedQ,
        recursedSells: [...collected, entry],
      };
  }
  
  const entry = createFifoEntry(buy, sell);
  return fifoRecursive(q, sell, [...collected, entry]);
};

export default fifoRecursive;