const mongoose = require('mongoose');
const moment = require('moment');

const Snapshot = mongoose.model('Snapshot');

exports.getLastFew = async (req, res) => {
  const limit = parseFloat(req.params.limit);

  const snapshots = await Snapshot
    .find()
    .limit(limit);

  res.json(snapshots);
};

exports.getPeoples = async (req, res) => {
  const aMonthAgo = moment().subtract(1, 'M');

  const peopleSummary = await Snapshot
    .find({ 'responses.questionPrompt': 'Who are you with?' })
    .sort({ date: -1 })
    .where('date').gt(aMonthAgo)
    .select('responses date');

    // .countOccurrences('responses');
  res.json(peopleSummary);
};

exports.steps = async (req, res) => {
  const aMonthAgo = moment().subtract(1, 'M');

  const stepSummary = await Snapshot
    .find()
    .sort({ date: -1 })
    .where('date').gt(aMonthAgo)
    .select('steps date -_id');

  res.json(stepSummary);
};
