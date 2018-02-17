import async from 'async';
import axios from 'axios';

const asyncGet = (urls, rateLimitTime) => {
  return new Promise((resolve, reject) => {
      async.mapLimit(urls, 1, ({ key, url }, callback) => {
          return axios.get(url)
          .then(res => {
              console.log('retrieving data...')
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