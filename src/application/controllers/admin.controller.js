const adminService = require('../../domain/admin/admin.service');

const getBestProfession = async (req, res, next) => {
  try {
    const { start: startDate, end: endDate } = req.query;
    const bestProfession = await adminService.getBestProfession({ startDate, endDate });
    res.status(200).json(bestProfession).end();
  } catch (err) {
    next(err);
  }
};

const getBestClients = async (req, res, next) => {
  try {
    const { start: startDate, end: endDate, limit } = req.query;
    const bestClients = await adminService.getBestClients({ startDate, endDate, limit });
    res.status(200).json(bestClients).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBestProfession,
  getBestClients,
};
