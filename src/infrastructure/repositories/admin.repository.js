const { Op, col } = require('sequelize');
const {
  Job, Contract, Profile, sequelize,
} = require('../model');

const DEFAULT_BEST_CLIENTS_LIMIT = 2;

const getBestProfession = async (startDate, endDate) => {
  const bestProfessions = await Profile.findAll({
    attributes: ['profession', [sequelize.fn('SUM', col('Contractor.Jobs.price')), 'total']],
    where: {
      type: 'contractor',
    },
    group: ['profession'],
    include: [
      {
        model: Contract,
        as: 'Contractor',
        attributes: [],
        include: [
          {
            model: Job,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      },
    ],
    order: [['total', 'DESC']],
  });
  return bestProfessions && bestProfessions.length && bestProfessions[0].get('total') && bestProfessions[0].dataValues;;
};

const getBestClients = async (startDate, endDate, limit = DEFAULT_BEST_CLIENTS_LIMIT) => {
  const bestClients = await Profile.findAll({
    subQuery: false,
    attributes: ['id','firstName','lastName', [sequelize.fn('SUM', col('Client.Jobs.price')), 'paid']],
    group: ['Profile.id'],
    order: [['paid', 'DESC']],
    where: { type: 'client' },
    include: [{
      model: Contract,
      attributes: [],
      as: 'Client',
      include: [{
        model: Job,
        attributes: [],
        where: { paid: true, paymentDate: { [Op.between]: [startDate, endDate] } },
      }],
    }],
    limit,
  });
  const result = bestClients.filter((bestClient) => bestClient.get('paid') !== null).map((client) => ({
    id: client.id,
    fullName: `${client.firstName} ${client.lastName}`,
    paid: client.get('paid'),
  }));
  return result;
};

module.exports = { getBestProfession, getBestClients };
