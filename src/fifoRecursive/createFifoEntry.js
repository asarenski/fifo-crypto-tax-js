const createFifoEntry = (buy, sell) => {
  const amount = buy.amount - sell.amount >= 0 ? sell.amount : buy.amount;
  console.log(amount)
  return {
    amount,
    buyDate: buy.time,
    saleDate: sell.time,
  };
};

export default createFifoEntry;