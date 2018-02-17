import _ from 'lodash';
import moment from 'moment';

const buildUrl = (start, end) => {
  const FIVE_MINUTE_GRANULAR = 300;
  return `https://api.gdax.com/products/btc-usd/candles?start=${start}&end=${end}&granularity=${FIVE_MINUTE_GRANULAR}`;
};

export function createUrlsFromSellEntries(sellEntries) {
  return _.chain(sellEntries)
    .reduce((acc, sellEntry) => {
        const { amount, buyDate, saleDate } = sellEntry;
        const formattedBuy = buyDate.format();
        const formattedSale = saleDate.format();
        if (!acc[formattedBuy]) {
            acc[formattedBuy] = 0;
        }
        if (!acc[formattedSale]) {
            acc[formattedSale] = 0;
        }
        return acc;
    }, {})
    .keys()
    .map(date => ({ key: date, momentObj: moment(date) }))
    .map(({ key, momentObj }) => ({
        key,
        url: buildUrl(momentObj.format(), momentObj.add(1, 'minutes').format())
    }))
    // .take(3) // REMOVE
    .value();
}
