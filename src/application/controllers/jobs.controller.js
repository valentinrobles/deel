const assert = require('assert');
const createHttpError = require('http-errors');
const jobsService = require('../../domain/jobs/jobs.service');

const getUnpaidJobs = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const unpaidJobs = await jobsService.getUnpaidJobs({ profileId });
    res.status(200).json(unpaidJobs).end();
  } catch (error) {
    next(error);
  }
};

const payJob = async (req, res, next) => {
  try {
    const { profile } = req;
    const jobId = req.params.job_id;
    assert(jobId, createHttpError.BadRequest());
    const payedJob = await jobsService.payJob({ profileId: profile.id, jobId });
    res.status(200).json(payedJob).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
