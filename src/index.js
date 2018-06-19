require('babel-polyfill');
import _ from 'lodash';
import json2csv from 'json2csv';
import { writeFileSync, existsSync } from 'fs';
import { parseAsync } from './util/csvParser';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertTypeToBuyOrSell from './convertTypeToBuyOrSell';
import { convertedHistoryTypes } from './constants';
import Queue from './Queue';
import fifoRecursive from './fifoRecursive/fifoRecursive';
import { createUrlsFromSellEntries, processPricingData, getPricingData } from './gdaxPricing';
import fixFloat from './util/fixFloat';

_.mixin({
    parseHistoryJsonTypes,
    convertTypeToBuyOrSell,
});

// Note: only use the history from GDAX. The buys and sells throw things off as that misses certain 'match' entries.
// still need to figure out what those match entries are representing.

const BASE_DIRECTORY = '/home/asarenski/Downloads';
const inputHistoryPath = `${BASE_DIRECTORY}/account.csv`;
const outputPath = `${BASE_DIRECTORY}/output.csv`;

if (!existsSync(inputHistoryPath)) {
    throw new Error(`ERROR: file at: ${inputHistoryPath} does not exist.\nPlease put a gdax history.csv in ${BASE_DIRECTORY}`);
}

(async function() {
    const historyJson = await parseAsync(inputHistoryPath);
    if (_.isEmpty(historyJson)) {
        throw new Error('History is empty. Please review the input data.');
    }
    const buysAndSells = _.chain(historyJson)
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

    const { buys: leftoverBuys, sellEntries } = _.chain(buysAndSells.sells)
        .map(({ ...props, amount }) => ({ ...props, amount: Math.abs(amount) }))
        .reduce(({ buys, sellEntries }, sell) => {
            const { buyQueue, sellEntries: newEntries } = fifoRecursive(buys, sell);
            return {
                buys: new Queue(buyQueue.array),
                sellEntries: [...sellEntries, ...newEntries]
            };
        }, {
            buys: new Queue(buysAndSells.buys.array),
            sellEntries: []
        })
        .value();

    if (!_.isEmpty(leftoverBuys.array)) {
        console.log("leftover buys: \n", leftoverBuys.array);
        throw new Error('Leftover buys after calculating fifo. This means history.csv does not have a sum of zero. Please re-check history.csv and fix any mistakes.');
    }

    const urls = createUrlsFromSellEntries(sellEntries);
    const rawPricingData = await getPricingData(urls);
    const pricingByTimeStamp = processPricingData(rawPricingData)

    const processedSellEntries = sellEntries.map((entry) => {
        const { amount, buyDate, saleDate } = entry;
        const buyPrice = pricingByTimeStamp[buyDate.format()];
        const buyTotal = fixFloat(amount * buyPrice);
        const salePrice = pricingByTimeStamp[saleDate.format()];
        const totalSale = fixFloat(amount * salePrice);
        return {
            amount,
            buyDate: buyDate.format(),
            buyPrice,
            buyTotal,
            saleDate: saleDate.format(),
            salePrice,
            totalSale,
        };
    });

    const fields = ['amount', 'buyDate', 'buyPrice', 'buyTotal', 'saleDate', 'salePrice', 'totalSale'];
    const csv = json2csv({ fields, data: processedSellEntries });
    writeFileSync(outputPath, csv);
    console.log(`\nOutput written to: ${outputPath}`);
})();