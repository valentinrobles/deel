class ReceiverProfileNotFound extends Error {
  constructor() {
    super('Receiver Profile Not Found');
    this.status = 404;
  }
}

module.exports = ReceiverProfileNotFound;
