require('babel-polyfill');
import _ from 'lodash';
import { parseAsync } from './csvParser';
import validate from './validateCsvOutput';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertHistoryTypes from './convertHistoryTypes';
import { convertedHistoryTypes } from './constants';
import Queue from './Queue';

_.mixin({
    parseHistoryJsonTypes,
    convertHistoryTypes,
});

// Note: only use the history from GDAX. The buys and sells throw things off as that misses certain 'match' entries.
// still need to figure out what those match entries are representing.

const historyFilePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const historyJson = await parseAsync(historyFilePath);
    const result = _.chain(historyJson)
        .parseHistoryJsonTypes()
        .convertHistoryTypes()
        .reduce((acc, curr) => {
            switch (curr.type) {
                case convertedHistoryTypes.BUY:
                  buys.enqueue(curr);
                case convertedHistoryTypes.SELL:
                  sells.push(curr);
            }
        }, {
            buys: new Queue(),
            sells: [],
        })
        .value();

    console.log('result: ', result);
})();