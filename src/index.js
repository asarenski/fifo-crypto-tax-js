require('babel-polyfill');
import { parseAsync } from './csvParser';

const filePath = '/home/asarenski/Downloads/history.csv';
(async function() {
    const csvAsJSON = await parseAsync(filePath);
    console.log(csvAsJSON);
    console.log('end...');
})();