require('babel-polyfill');
import { parseAsync } from './csvParser';
import _ from 'lodash';
import validateCsvOutput from './validateCsvOutput'; 

// Note: only use the history from GDAX. The buys and sells throw things off as that misses certain 'match' entries.
// still need to figure out what those match entries are representing.

const historyTypes = {
    MATCH: 'match',
    WITHDRAWAL: 'withdrawal',
    DEPOSIT: 'deposit',
};

const requiredCsvOutputKeys = [
    'amount',
    'buyDate',
    'buyPrice',
    'buyTotal',
    'saleDate',
    'salePrice',
    'totalSale',
];

const historyFilePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const historyJson = await parseAsync(historyFilePath);
    const historySum = _.chain(historyJson)
        .reduce((sum, { type, amount }) => {
            const floatAmount = parseFloat(amount);
            return floatAmount ? sum += floatAmount : sum;
        }, 0)
        .value();

    console.log('history sum: ', historySum);
})();