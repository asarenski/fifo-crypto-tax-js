require('babel-polyfill');
import _ from 'lodash';
import { parseAsync } from './csvParser';
import validateOutputJson from './validateOutputJson';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertTypeToBuyOrSell from './convertTypeToBuyOrSell';
import { convertedHistoryTypes } from './constants';
import Queue from './Queue';
import fifoRecursive from './fifoRecursive/fifoRecursive';

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

    const result = _.chain(organizedTransactions.sells)
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

    console.log('result: ', result);
})();