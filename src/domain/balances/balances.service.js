const { sequelize } = require('../../infrastructure/model');
const jobsRepository = require('../../infrastructure/repositories/jobs.repository');
const profileRepository = require('../../infrastructure/repositories/profile.repository');
const profileService = require('../profile/profile.service');
const ExceededDepositLimit = require('../errors/ExceededDepositLimit.error');
const ReceiverProfileNotFound = require('../errors/ReceiverProfileNotFound.error');

const CLIENT_TYPE = 'client';
const DEPOSIT_LIMIT = 0.25;

const checkDepositAmount = (amountToPay, amount) => {
  const depositLimit = amountToPay * DEPOSIT_LIMIT;
  if (amount > depositLimit) {
    throw new ExceededDepositLimit(depositLimit);
  }
};

const depositMoney = async ({ profile: payer, userId: receiverId, amount }) => {
  const txn = await sequelize.transaction();
  const dbOptions = { transaction: txn, lock: txn.LOCK.UPDATE };

  try {
    if (payer.type === CLIENT_TYPE) {
      const amountToPay = await jobsRepository.getPriceOfJobsInProgressByClient(payer.id, dbOptions);
      checkDepositAmount(amountToPay, amount);
    }

    const receiverProfile = await profileRepository.getProfileById(receiverId, dbOptions);

    if (!receiverProfile) {
      throw new ReceiverProfileNotFound();
    }

    const resultReceiverProfile = await profileService.updateBalance(receiverProfile.id, amount, profileService.INCREASE, { transaction: txn });
    await txn.commit();
    return resultReceiverProfile;
  } catch (err) {
    await txn.rollback();
    throw err;
  }
};

module.exports = {depositMoney};
