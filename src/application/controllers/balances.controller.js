const assert = require('assert');
const createHttpError = require('http-errors');
const balancesService = require('../../domain/balances/balances.service');

const depositMoney = async (req, res, next) => {
  try {
    const { profile } = req;
    const { userId } = req.params;
    const { amount } = req.body;
    assert(amount, createHttpError.BadRequest('Amount can not be empty'));
    assert(amount>0, createHttpError.BadRequest('Amount must be greater than zero'))
    const contracts = await balancesService.depositMoney({ profile, userId, amount: Number(amount) });
    res.status(200).json(contracts).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  depositMoney,
};
