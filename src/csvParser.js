import csv from 'csvtojson';

const  parseAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        csv()
        .fromFile(filePath)
        .on('end_parsed', (jsonArray) => {
            resolve(jsonArray);
        });
    });
};

export { parseAsync };