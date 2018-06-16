import moment from 'moment';
import parseHistoryJsonTypes from './parseHistoryJsonTypes';

describe('parseHistoryJsonTypes', () => {
  it('should take the stringified version of gdax history obj', () => {
    const now = moment();
    const fiveHoursFromNow = now.add(5, 'hours');
    const inputs = [
      {
        type: "bleh",
        time: now.format(),
        amount: "12.36"
      },
      {
        type: "bleh2",
        time: fiveHoursFromNow.format(),
        amount: "5.42"
      },
    ];

    const expected = [
      {
        type: "bleh",
        time: moment(now.format()),
        amount: parseFloat("12.36")
      },
      {
        type: "bleh2",
        time: moment(fiveHoursFromNow.format()),
        amount: parseFloat("5.42")
      }
    ];

    const actual = parseHistoryJsonTypes(inputs);

    expect(actual).toEqual(expected);
  });
});