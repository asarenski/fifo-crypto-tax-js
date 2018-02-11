import moment from 'moment';

const parseHistoryJsonTypes = (objects) => {
  return objects.map(({
    type,
    time,
    amount
  }) => {
    return {
      type: type,
      time: moment(time),
      amount: parseFloat(amount),
    };
  });
};

export default parseHistoryJsonTypes;