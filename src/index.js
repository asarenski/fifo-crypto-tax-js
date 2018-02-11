require('babel-polyfill');
import _ from 'lodash';
import { parseAsync } from './csvParser';
import validate from './validateCsvOutput';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';
import convertHistoryTypes from './convertHistoryTypes';

_.mixin({
    convertHistoryTypes
});

// Note: only use the history from GDAX. The buys and sells throw things off as that misses certain 'match' entries.
// still need to figure out what those match entries are representing.

const historyFilePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const historyJson = await parseAsync(historyFilePath);
    const result = _.chain(historyJson)
        .parseHistoryJsonTypes()
        .convertHistoryTypes()
        .reduce(() => {

        })
        .value();

    console.log('result: ', result);
})();