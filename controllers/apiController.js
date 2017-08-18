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
  const peopleSummary = await Snapshot
    .aggregate([
      { $sort: { date: 1 } },
      { $unwind: '$responses' },
      { $match: { 'responses.questionPrompt': 'Who are you with?' } },
      { $project: { 'responses.tokens.text': 1, date: 1 } },
      { $unwind: '$responses.tokens' },
      { $group: {
        _id: '$date',
        people: { $push: '$responses.tokens.text' },
        count: { $sum: { $cond: [{ $eq: ['$responses.tokens.text', 'No One'] }, 0, 1] } }
      } },
      { $limit: 30 }
    ]);

  res.json(peopleSummary);
};

exports.steps = async (req, res) => {
  const aWeekAgo = moment().subtract(2, 'w');

  const stepSummary = await Snapshot
    .find()
    .sort({ date: -1 })
    .where('date').gt(aWeekAgo)
    .select('steps date -_id');

  res.json(stepSummary);
};

exports.stepsOnDay = async (req, res) => {
  const sectionIdentifier = req.params.sectionIdentifier;

  const dateStepSummary = await Snapshot
    .find({ sectionIdentifier })
    .select('steps date -_id');

  res.json(dateStepSummary);
};

exports.excercise = async (req, res) => {
  const lastExcercised = await Snapshot
    .aggregate([{ $unwind: '$responses' },
               { $match: { 'responses.questionPrompt': 'Did you exercise?' } },
               { $project: { 'responses.answeredOptions': 1, date: 1 } },
               { $sort: { date: -1 } },
               { $limit: 7 }
    ]);

  res.json(lastExcercised);
};
