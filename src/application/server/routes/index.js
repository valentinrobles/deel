const contracts = require('./contracts.router');
const admin = require('./admin.router');
const balances = require('./balances.router');
const jobs = require('./jobs.router');

const bind = (app) => {
  app.use('/contracts', contracts);
  app.use('/admin', admin);
  app.use('/balances', balances);
  app.use('/jobs', jobs);
};

module.exports = {
  bind,
};
