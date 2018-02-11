import { requiredCsvOutputKeys } from './constants';

const validate = (obj, requiredKeys) => {
  requiredKeys.forEach((key) => {
      const value = obj[key];
      if (_.isNil(value)) {
          console.log('error parsing object: ', obj);
          throw new Error(`Cannot return nil object for any required keys! key: ${key}, value: ${value}`);
      }
  });

  return {
      amount,
      buyDate,
      buyPrice,
      buyTotal,
      saleDate,
      salePrice,
      totalSale
  };
}

const validateOutputJson= (objects) => {
    objects.forEach(object => validate(object, requiredCsvOutputKeys));
};

export default validateOutputJson;