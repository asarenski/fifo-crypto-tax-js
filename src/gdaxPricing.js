import _ from 'lodash';
import moment from 'moment';
import asyncGet from './util/asyncGet';
import * as constants from './constants';

// gdax api
// https://docs.gdax.com/#api
// https://api.gdax.com/products/btc-usd/candles?start=2018-02-10T01:00:00&end=2018-02-10T01:00:05&granularity=300
// const [ gdaxTime, gdaxLow, gdaxHigh, gdaxOpen, gdaxClose, gdaxVolume ] = gdaxResponse;
// Notes: Setting a 1 minute difference between start and end time gives 1 result with a 5 min granularity

const TARGETED_SECURITY = constants.gdaxUsdSecurities.BTC_USD;

const buildUrl = (start, end) => {
  const FIVE_MINUTE_GRANULAR = 300;
  return `https://api.gdax.com/products/${TARGETED_SECURITY}/candles?start=${start}&end=${end}&granularity=${FIVE_MINUTE_GRANULAR}`;
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
    .map(({ key, momentObj }) => {
      const url = buildUrl(momentObj.format(), momentObj.add(1, 'minutes').format());
      return {
        key,
        url,
      };
    })
    //.take(3) // DEBUGGING
    .value();
}

export function getPricingData(urls) {
  console.log('getting pricing from gdax...');
  const GDAX_RATE_LIMIT_IN_MILLIS = 700;
  return asyncGet(urls, GDAX_RATE_LIMIT_IN_MILLIS);
}

export function processPricingData(rawPricingData) {
  return rawPricingData.reduce((acc, { key, data }) => {
    const [[,,, gdaxOpen ]] = data;
    return {...acc, [key]: gdaxOpen };
  }, {});
}
