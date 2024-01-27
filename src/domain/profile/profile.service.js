const { Profile } = require('../../infrastructure/model');

const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

const updateBalance = async (profileId, price, operationType, options) => {
  const profile = await Profile.findOne({ where: { id: profileId } });
  const profileBalance = profile.get('balance');
  const newProfileBalance = operationType === INCREASE ? profileBalance + price : profileBalance - price;
  profile.set({
    balance: newProfileBalance,
  });
  return profile.save({ ...options });
};

module.exports = {
  updateBalance,
  INCREASE,
  DECREASE,
};
