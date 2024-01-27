class UnpaidJobNotFound extends Error {
  constructor() {
    super('Unpaid Job Not Found');
    this.status = 404;
  }
}

module.exports = UnpaidJobNotFound;
