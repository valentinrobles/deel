class ContractNotFound extends Error {
  constructor() {
    super('Contract Not Found');
    this.status = 404;
  }
}

module.exports = ContractNotFound;
