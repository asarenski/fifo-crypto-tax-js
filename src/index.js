require('babel-polyfill');
import _ from 'lodash';
import moment from 'moment';
import { parseAsync } from './util/csvParser';
import validateOutputJson from './validateOutputJson';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertTypeToBuyOrSell from './convertTypeToBuyOrSell';
import { convertedHistoryTypes } from './constants';
import Queue from './Queue';
import fifoRecursive from './fifoRecursive/fifoRecursive';
import asyncGet from './util/asyncGet';

_.mixin({
    parseHistoryJsonTypes,
    convertTypeToBuyOrSell,
});

// Note: only use the history from GDAX. The buys and sells throw things off as that misses certain 'match' entries.
// still need to figure out what those match entries are representing.

const historyFilePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const historyJson = await parseAsync(historyFilePath);
    const organizedTransactions = _.chain(historyJson)
        .parseHistoryJsonTypes()
        .convertTypeToBuyOrSell()
        .reduce((acc, curr) => {
            const { buys, sells } = acc;
            switch (curr.convertedType) {
                case convertedHistoryTypes.BUY:
                    const q = new Queue(buys.array);
                    q.enqueue(curr);
                    return {
                        buys: q,
                        sells,
                    };
                case convertedHistoryTypes.SELL:
                    return {
                        buys: new Queue(buys.array),
                        sells: [...sells, curr],
                    };
            }
        }, {
            buys: new Queue(),
            sells: [],
        })
        .value();

    const { buys: leftoverBuys, sellEntries } = _.chain(organizedTransactions.sells)
        .map(({ ...props, amount }) => ({ ...props, amount: Math.abs(amount) }))
        .reduce(({ buys, sellEntries }, sell) => {
            const { buyQueue, sellEntries: newEntries } = fifoRecursive(buys, sell);
            return {
                buys: new Queue(buyQueue.array),
                sellEntries: [...sellEntries, ...newEntries]
            };
        }, {
            buys: new Queue(organizedTransactions.buys.array),
            sellEntries: []
        })
        .value();

    if (!_.isEmpty(leftoverBuys.array)) {
        console.log("leftover buys: \n", leftoverBuys.array);
        throw new Error('Leftover buys after calculating fifo. This means history.csv does not have a sum of zero. Please re-check history.csv and fix any mistakes.');
    }

    // gdax api
    // https://docs.gdax.com/#api
    // https://api.gdax.com/products/btc-usd/candles?start=2018-02-10T01:00:00&end=2018-02-10T01:00:05&granularity=300
    // const [ gdaxTime, gdaxLow, gdaxHigh, gdaxOpen, gdaxClose, gdaxVolume ] = gdaxResponse;
    // Notes: Setting a 1 minute difference between start and end time gives 1 result with a 5 min granularity

    const buildUrl = (start, end) => {
        const FIVE_MINUTE_GRANULAR = 300;
        return `https://api.gdax.com/products/btc-usd/candles?start=${start}&end=${end}&granularity=${FIVE_MINUTE_GRANULAR}`;
    };

    const urls = _.chain(sellEntries)
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

    const GDAX_RATE_LIMIT_IN_MILLIS = 700;
    const rawPricingData = await asyncGet(urls, GDAX_RATE_LIMIT_IN_MILLIS);
    const processedPricingData = rawPricingData.map(({ key, data }) => {
        const [[,,, gdaxOpen ]] = data;
        return { key, price: gdaxOpen };
    });

    console.log(processedPricingData);
})();