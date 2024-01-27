const { Profile } = require('../model');

const getProfileById = async (profileId, options) => Profile.findByPk(profileId, options);

module.exports = {
  getProfileById,
};
