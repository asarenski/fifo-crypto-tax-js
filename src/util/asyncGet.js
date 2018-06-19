import async from 'async';
import axios from 'axios';
import CountMessenger from './CountMessenger';

const asyncGet = (urls, rateLimitTime) => {
  const countMessenger = new CountMessenger('urlCount', urls.length);
  return new Promise((resolve) => {
    async.mapLimit(urls, 1, ({ key, url }, callback) => {
      return axios.get(url)
        .then(res => {
          process.stdout.write(countMessenger.messageAndCount());
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