import async from 'async';
import axios from 'axios';

const asyncGet = (urls, rateLimitTime) => {
  let urlCount = 1;
  return new Promise((resolve, reject) => {
    async.mapLimit(urls, 1, ({ key, url }, callback) => {
      return axios.get(url)
        .then(res => {
          const message = `position ${urlCount} of ${urls.length}`;
          process.stdout.write(urlCount === urls.length ? message : message + '\r');
          urlCount += 1;
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