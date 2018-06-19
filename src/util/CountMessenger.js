class CountMessenger {
  constructor(totalCount, messagePrefix) {
    this.count = 1;
    this.totalCount = totalCount;
    this.messagePrefix = messagePrefix ? messagePrefix + ' ' : '';
  }

  isMaxReached() {
    return this.count === this.totalCount;
  }

  completedMessage() {
    return `${this.messagePrefix}completed with ${this.count} of ${this.totalCount}\r`;
  }

  messageAndCount() {
    if (this.isMaxReached()) {
      return this.completedMessage();
    }

    const message = `${this.messagePrefix}${this.count} of ${this.totalCount}`;
    this.count += 1;
    return message;
  }
}
export default CountMessenger;