class InsufficientFunds extends Error {
  constructor() {
    super('Insufficient Funds to pay job');
    this.status = 400;
  }
}

module.exports = InsufficientFunds;
