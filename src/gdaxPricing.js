import moment from 'moment';
import _ from 'lodash';
import asyncGet from './util/asyncGet';
import * as constants from './constants';

// gdax api
// https://docs.gdax.com/#api
// https://api.gdax.com/products/btc-usd/candles?start=2018-02-10T01:00:00&end=2018-02-10T01:00:05&granularity=300
// const [ gdaxTime, gdaxLow, gdaxHigh, gdaxOpen, gdaxClose, gdaxVolume ] = gdaxResponse;
// Notes: Setting a 1 minute difference between start and end time gives 1 result with a 5 min granularity

export const TARGETED_SECURITY = constants.gdaxUsdSecurities.BTC_USD;

export const buildUrl = (start, end) => {
  const FIVE_MINUTE_GRANULAR = 300;
  return `https://api.gdax.com/products/${TARGETED_SECURITY}/candles?start=${start}&end=${end}&granularity=${FIVE_MINUTE_GRANULAR}`;
};

/**
 * Given a list of transaction dates this method will generate
 * the necessary urls, which could be used to look at security pricing
 * around the given buy or sale date.
 *
 * @param {object[]} sellEntries - Sales of a particular security.
 * @returns {object[]} Array of formatted date and corresponding url.
 */
export function createUrlsFromSellEntries(sellEntries) {
  return _.chain(sellEntries)
    .reduce((acc, sellEntry) => {
      const { buyDate, saleDate } = sellEntry;
      const formattedBuy = buyDate.format();
      const formattedSale = saleDate.format();
      return { ...acc, [formattedBuy]: 1, [formattedSale]: 1 };
    }, {})
    .keys()
    .map(key => ({ key, momentObj: moment(key) }))
    .map(({ key, momentObj }) => {
      const url = buildUrl(momentObj.format(), moment(momentObj).add(1, 'minutes').format());
      return { key, url };
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
