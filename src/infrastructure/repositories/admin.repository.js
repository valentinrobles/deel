const { Op } = require('sequelize');
const {
  Job, Contract, Profile, sequelize,
} = require('../model');

const DEFAULT_BEST_CLIENTS_LIMIT = 2;

const getBestProfession = async (startDate, endDate) => {
  return await Job.findOne({
      attributes: [
          [sequelize.fn('SUM', sequelize.col('Job.price')), 'totalAmount'],
          [sequelize.col('Contract->Contractor.profession'), 'profession'],
      ],
      include: [
          {
              model: Contract,
              required: true,
              include: [
                  {
                      model: Profile,
                      as: 'Contractor',
                      required: true
                  },
              ],
          },
      ],
      where: {
          paid: 1,
          paymentDate: {
              [Op.between]: [startDate, endDate],
          },
      },
      group: ['Contract->Contractor.profession'],
      order: [[sequelize.literal('totalAmount'), 'DESC']],
  })
}


const getBestClients = async (startDate, endDate, limit = DEFAULT_BEST_CLIENTS_LIMIT) => {
  return await Job.findAll({
      attributes: [
          [sequelize.col('Contract->Client.id'), 'id'],
          [sequelize.col('Contract->Client.firstName'), 'firstName'],
          [sequelize.col('Contract->Client.lastName'), 'lastName'],
          [sequelize.fn('SUM', sequelize.col('Job.price')), 'totalAmount'],
      ],
      include: [
          {
              model: Contract,
              required: true,
              include: [
                  {
                      model: Profile,
                      as: 'Client',
                      required: true
                  },
              ],
          },
      ],
      where: {
          paid: 1,
          paymentDate: {
              [Op.between]: [startDate, endDate],
          },
      },
      group: ['Contract->Client.id'],
      order: [[sequelize.literal('totalAmount'), 'DESC']],
      limit: limit,
  })
}

module.exports = { getBestProfession, getBestClients };
