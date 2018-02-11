import { parseAsync } from './csvParser';

const filePath = '/home/asarenski/Downloads/history.csv';
parseAsync(filePath).then((data) => {
    console.log('data');
    console.log(data);
});
// const thing = await parseAsync(filePath);
// console.log('data is: ');
// console.log(thing);

console.log('end of index...');