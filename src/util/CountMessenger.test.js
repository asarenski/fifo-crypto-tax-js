import CountMessenger from './CountMessenger';

describe('CountMessenger', () => {
  it('counts with prefix', () => {
    const countMessenger = new CountMessenger(15, 'something');
    expect(countMessenger.messageAndCount()).toEqual('something 1 of 15');
    expect(countMessenger.messageAndCount()).toEqual('something 2 of 15');
    expect(countMessenger.messageAndCount()).toEqual('something 3 of 15');
  });

  it('does something when it hits the max', () => {
    const countMessenger = new CountMessenger(2, 'something');
    expect(countMessenger.messageAndCount()).toEqual('something 1 of 2');
    expect(countMessenger.messageAndCount()).toEqual('something completed with 2 of 2\r');
  });

  it('doesnt have a prefix if not provided', () => {
    const countMessenger = new CountMessenger(3);
    expect(countMessenger.messageAndCount()).toEqual('1 of 3');
  });
});