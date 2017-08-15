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
  // const aMonthAgo = moment().subtract(1, 'M');

  // const peopleSummary = await Snapshot
  //   .find({ 'responses.questionPrompt': 'Who are you with?' })
  //   .sort({ date: -1 })
  //   .where('date').gt(aMonthAgo)
  //   .select('responses date');

  const peopleSummary = await Snapshot
    .aggregate([{ $unwind: '$responses' },
               { $match: { 'responses.questionPrompt': 'Who are you with?' } },
               { $project: { 'responses.tokens.text': 1, date: 1 } }])
    .limit(10);

  res.json(peopleSummary);
};

exports.steps = async (req, res) => {
  // const aMonthAgo = moment().subtract(1, 'M');
  const aWeekAgo = moment().subtract(1, 'w');

  const stepSummary = await Snapshot
    .find()
    .sort({ date: -1 })
    .where('date').gt(aWeekAgo)
    .select('steps date -_id');

  res.json(stepSummary);
};
