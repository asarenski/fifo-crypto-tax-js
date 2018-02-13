import { fixFloat } from '../mathUtil';

const createFifoEntry = (buy, sell) => {
  const amount = fixFloat(buy.amount - sell.amount) >= 0 ? fixFloat(sell.amount) : fixFloat(buy.amount);
  return {
    amount,
    buyDate: buy.time,
    saleDate: sell.time,
  };
};

export default createFifoEntry;