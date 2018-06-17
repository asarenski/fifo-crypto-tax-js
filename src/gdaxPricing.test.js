import moment from 'moment';
import { buildUrl, TARGETED_SECURITY, createUrlsFromSellEntries } from './gdaxPricing';

describe('gdaxPricing', () => {
  describe('buildUrl', () => {
    it('builds a url representing a period of time from start to end with granular intervals', () => {
      const now = moment();
      const start = now.format();
      const end = now.add(4, 'days').format;
      const expectedUrl = `https://api.gdax.com/products/${TARGETED_SECURITY}/candles?start=${start}&end=${end}&granularity=300`;
      const actualUrl = buildUrl(start, end);
      expect(actualUrl).toEqual(expectedUrl);
    });
  });

  describe('createUrlsFromSellEntries', () => {
    it('should build an object with key of timestamp of transaction and associated url', () => {
      const now = moment().milliseconds(0);
      const tomorrow = moment(now).add(1, 'day');
      const dayAfterTomorrow = moment(tomorrow).add(1, 'day');
      const sellEntries = [
        { buyDate: now, saleDate: moment(now).add(1, 'hour') },
        { buyDate: tomorrow, saleDate: moment(tomorrow).add(1, 'hour') },
        { buyDate: dayAfterTomorrow, saleDate: moment(dayAfterTomorrow).add(1, 'hour') },
      ];

      const expectedUrlsObj = sellEntries.reduce((acc, sellEntry) => {
        const { buyDate, saleDate } = sellEntry;
        const formattedBuy = buyDate.format();
        const formattedSale = saleDate.format();
        return {
          ...acc,
          [formattedBuy]: buildUrl(formattedBuy, moment(buyDate).add(1, 'minutes').format()),
          [formattedSale]: buildUrl(formattedSale, moment(saleDate).add(1, 'minutes').format())
        };
      }, {});

      const expectedUrlsObjAsArray = Object.keys(expectedUrlsObj).map(key => {
        return {
          key,
          url: expectedUrlsObj[key]
        };
      });

      const actuals = createUrlsFromSellEntries(sellEntries);

      expect(expectedUrlsObjAsArray.length).toEqual(actuals.length);
      expectedUrlsObjAsArray.forEach(expected => {
        expect(actuals).toContain(expected);
      });
    });
  });
});