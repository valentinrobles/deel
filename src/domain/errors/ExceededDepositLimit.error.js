class ExceededDepositLimit extends Error {
  constructor(limit) {
    super(`Exceeded Deposit Limit. Deposit available ${limit}`);
    this.status = 400;
  }
}

module.exports = ExceededDepositLimit;
