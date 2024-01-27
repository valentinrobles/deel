const dayjs = require('dayjs');
const adminRepository = require('../../infrastructure/repositories/admin.repository');
const BestProfessionNotFound = require('../errors/BestProfessionNotFound.error');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const getBestProfession = async ({ startDate, endDate }) => {
  const startDateWithFormat = (startDate && dayjs(startDate).format(dateFormat)) || dayjs().format(dateFormat);
  const endDateWithFormat = (endDate && dayjs(endDate).format(dateFormat)) || dayjs().format(dateFormat);

  console.log(`Method: getBestProfession - Getting the best profession from: ${startDate} to ${endDate}`)

  const bestProfession = await adminRepository.getBestProfession(startDateWithFormat, endDateWithFormat);

  if (!bestProfession) {
    throw new BestProfessionNotFound();
  }
  return bestProfession; 
};

const getBestClients = async ({ startDate, endDate, limit }) => {
  const startDateWithFormat = (startDate && dayjs(startDate).format(dateFormat)) || dayjs().format(dateFormat);
  const endDateWithFormat = (endDate && dayjs(endDate).format(dateFormat)) || dayjs().format(dateFormat);

  console.log(`Method: getBestClients - Getting the best clients from: ${startDate} to ${endDate}`)

  const bestClients = await adminRepository.getBestClients(startDateWithFormat, endDateWithFormat, limit);
  return bestClients;
};

module.exports = { getBestProfession, getBestClients };
