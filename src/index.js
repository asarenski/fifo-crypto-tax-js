require('babel-polyfill');
import _ from 'lodash';
import { parseAsync } from './csvParser';
import validate from './validateCsvOutput';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertTypeToBuyOrSell from './convertTypeToBuyOrSell';
import { convertedHistoryTypes } from './constants';
import Queue from './Queue';

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
        .reduce(({ buys, sellsWithCosts }, sell) => {
            // TODO call fifoRecursive for sell
            // TODO const { recursedBuys, collectedSells } = fifoRecurs;
            // return {
            //     buys: recursedbuys,
            //     sellsWithCosts: [...sellsWithCosts, ...collectedSells],
            // };
        }, {
            buys: new Queue(organizedTransactions.buys.array),
            sellsWithCosts: []
        })
        .value();

    console.log('result: ', result);
})();