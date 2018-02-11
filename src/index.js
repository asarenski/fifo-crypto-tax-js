require('babel-polyfill');
import { parseAsync } from './csvParser';
import _ from 'lodash';

const historyFilePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const historyJson = await parseAsync(historyFilePath);
    const result = _.chain(historyJson)
        .filter(({ type }) => type !== 'match')
        .reduce((sum, { type, amount }) => {
            const floatAmount = parseFloat(amount);
            switch (type) {
                case 'withdrawal':
                    return sum -= floatAmount;
                case 'deposit':
                    return sum += floatAmount;
                default:
                    return sum;
            }
        }, 0)
        .value();
    console.log("sum is : ", result);
})();