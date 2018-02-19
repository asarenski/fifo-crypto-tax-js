import async from 'async';
import axios from 'axios';

const asyncGet = (urls, rateLimitTime) => {
  console.log('getting pricing from gdax...');
  let count = 1;
  return new Promise((resolve, reject) => {
      async.mapLimit(urls, 1, ({ key, url }, callback) => {
          return axios.get(url)
          .then(res => {
              const message = `position ${count} of ${urls.length}`;
              process.stdout.write(count === urls.length ? message : message + '\r');
              count += 1;
              setTimeout(() => (callback(null, { key, data: res.data })), rateLimitTime);
          })
          .catch(e => { throw e });
      }, (err, results) => {
          if (err) throw err;
          resolve(results);
      });
  });
};

export default asyncGet;