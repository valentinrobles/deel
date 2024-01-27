const { Op } = require('sequelize');
const { Contract } = require('../model');

const getContracts = async (profileId) => Contract.findAll(
  {
    where: {
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      status: {
        [Op.not]: 'terminated',
      },
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  },
);

const getContractById = async (profileId, contractId) => Contract.findOne({
  where: {
    id: contractId,
    [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
  },
});

module.exports = {
  getContracts,
  getContractById,
};
