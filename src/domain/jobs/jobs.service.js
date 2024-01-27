const { sequelize } = require('../../infrastructure/model');
const jobsRepository = require('../../infrastructure/repositories/jobs.repository');
const profileRepository = require('../../infrastructure/repositories/profile.repository');
const profileService = require('../profile/profile.service');
const InsufficientFunds = require('../errors/InsufficientFunds.error');
const UnpaidJobNotFound = require('../errors/UnpaidJobNotFound.error');

const getUnpaidJobs = async ({ profileId }) => {
  const unpaidJobs = await jobsRepository.getUnpaidJobs(profileId);
  return unpaidJobs;
};

const payJob = async ({ profileId, jobId }) => {
  const txn = await sequelize.transaction();
  const dbOptions = { transaction: txn, Lock: txn.LOCK.UPDATE };

  try {
    const unpaidJob = await jobsRepository.getUnpaidJobById(profileId, jobId, dbOptions);

    if (!unpaidJob) {
      throw new UnpaidJobNotFound();
    }

    const contract = unpaidJob.get('Contract');
    
    const [client,contractor] = await Promise.all([
      profileRepository.getProfileById(profileId, dbOptions),
      await profileRepository.getProfileById(contract.get('ContractorId'), dbOptions)
    ])

    const jobPrice = unpaidJob.get('price');

    if (client.get('balance') < jobPrice) {
      throw new InsufficientFunds();
    }

    const [,, resultContractorProfile] = await Promise.all([
      jobsRepository.setJobAsPaid(unpaidJob.id, { transaction: txn }),
      profileService.updateBalance(client.id, jobPrice, profileService.DECREASE, { transaction: txn }),
      profileService.updateBalance(contractor.id, jobPrice, profileService.INCREASE, { transaction: txn }),
    ]);

    await txn.commit();
    return resultContractorProfile;
  } catch (err) {
    txn.rollback();
    throw err;
  }
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
