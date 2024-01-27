const assert = require('assert');
const createHttpError = require('http-errors');
const contractsService = require('../../domain/contracts/contracts.service');

const getContracts = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const contracts = await contractsService.getContracts({ profileId });
    res.status(200).json(contracts).end();
  } catch (err) {
    next(err);
  }
};

const getContractById = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const contractId = req.params.id;
    assert(contractId, createHttpError.BadRequest());
    const contract = await contractsService.getContractById({ profileId, contractId });
    res.status(200).json(contract).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getContracts,
  getContractById,
};
