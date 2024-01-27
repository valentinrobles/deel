class BestProfessionNotFound extends Error {
  constructor() {
    super('Best Profession not found for given dates');
    this.status = 404;
  }
}

module.exports = BestProfessionNotFound;
