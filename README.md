## Example history object
```js
{
  type: 'match',
  time: '2017-12-30T13:53:26.729Z',
  amount: '-0.01265226',
  balance: '0',
  'amount/balance unit': 'BTC',
  'transfer id': '',
  'trade id': '31255964',
  'order id': '9e780179-f65d-474a-96ff-e2dd5be5e7ba'
}
```

## parseHistoryJsonTypes will parse the inital types to:
```js
{
  type: string,
  time: moment,
  amount: float,
}
```

## convertTypeToBuyOrSell
```js
{
  convertedType: BUY | SELL
  type: string,
  time: moment,
  amount: float,
}
```

## desired output schema
```js
{
  amount,
  buyDate,
  buyPrice,
  buyTotal,
  saleDate,
  salePrice,
  totalSale,
}
```