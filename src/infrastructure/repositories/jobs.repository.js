const { Op } = require('sequelize');
const { Contract, Job } = require('../model');

const getUnpaidJobs = async (profileId) => Job.findAll({
  where: {
    paid: {
      [Op.or]: [null, 0, false]
    },
  },
  include: {
    model: Contract,
    as: 'Contract',
    where: {
      status: {
        [Op.eq]: 'in_progress',
      },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  },
});

const getUnpaidJobById = async (clientId, jobId, options) => Job.findOne({
  where: {
    id: {
      [Op.eq]: jobId,
    },
    paid: {
      [Op.or]: [null, 0, false]
    },
  },
  include: {
    model: Contract,
    as: 'Contract',
    where: {
      clientId: {
        [Op.eq]: clientId,
      },
    },
  },
  ...options,
});

const setJobAsPaid = async (jobId, options) => {
  const unpaidJob = await Job.findByPk(jobId);
  unpaidJob.set(
    { paid: true, paymentDate: new Date() },
  );
  unpaidJob.save({ ...options });
};

const getPriceOfJobsInProgressByClient = async (clientId, options) => Job.sum('price', {
  where: {
    paid: {
      [Op.is]: null,
    },
  },
  include: {
    model: Contract,
    as: 'Contract',
    where: {
      status: {
        [Op.eq]: 'in_progress',
      },
      clientId: {
        [Op.eq]: clientId,
      },
    },
  },
  ...options,
});

module.exports = {
  getUnpaidJobs,
  getUnpaidJobById,
  setJobAsPaid,
  getPriceOfJobsInProgressByClient,
};
