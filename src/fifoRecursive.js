import Queue from "./Queue";

const createEntry = (buy, sell) => {
  const amount = buy.amount - sell.amount >= 0 ? sell.amount : buy.amount; 
  return {
    amount,
    buyDate: buy.time,
    saleDate: sell.time,
  };
};

const fifoRecursive = (q, sell, collected) => {
  const buy = q.dequeue();
  if (!buy) {
      throw new Error(`value was undefined ${buy}, fix map of sale transactions!`);
  }
  if (buy.amount - sell.amount >= 0) {
      const entry = createEntry(buy, sell);
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
  
  const entry = createEntry(buy, sell);
  return fifoRecursive(q, sell, [...collected, entry]);
};

export { createEntry };
export default fifoRecursive;