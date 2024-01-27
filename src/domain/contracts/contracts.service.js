const contractsRepository = require('../../infrastructure/repositories/contracts.repository');
const ContractNotFound = require('../errors/ContractNotFound.error');

const getContracts = async ({ profileId }) => {
  console.log(`Method: getContracts - Getting contracts from profileId: ${profileId}`);
  const contracts = await contractsRepository.getContracts(profileId);
  return contracts;
};

const getContractById = async ({ profileId, contractId }) => {
  console.log(`Method: getContractById - Getting contract from profileId: ${profileId} and contractId: ${contractId}`);
  const contract = await contractsRepository.getContractById(profileId, contractId);

  if (!contract) {
    throw new ContractNotFound();
  }
  return contract;
};

module.exports = {
  getContracts,
  getContractById,
};
