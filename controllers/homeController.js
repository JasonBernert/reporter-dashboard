const mongoose = require('mongoose');
const request = require('request');

const Snapshot = mongoose.model('Snapshot');

exports.index = async (req, res) => {
  const count = await Snapshot.count();
  const commonState = await Snapshot.countOccurrences('location.placemark.administrativeArea');
  const commonCity = await Snapshot.countOccurrences('location.placemark.locality');

  const firstSnap = await Snapshot
    .find()
    .sort({ date: 1 })
    .limit(1);
  const firstSnapshot = firstSnap[0];

  const summary = {
    firstDate: firstSnapshot.date,
    commonCity: commonCity[0]._id,
    commonState: commonState[0]._id,
    count,
  };

  // const sleepCycles = await Snapshot.find({ 'responses.questionPrompt': 'How did you sleep?' }).count();

  const sleepSummary = await Snapshot
    .aggregate([{ $sort: { date: -1 } },
                { $unwind: '$responses' },
                { $match: { 'responses.questionPrompt': 'How did you sleep?' } },
                { $limit: 14 },
                { $unwind: '$responses.answeredOptions' },
                { $sortByCount: '$responses.answeredOptions' },
                { $project: { _id: 1, sleep: '$count', rate: { $divide: ['$count', 14] } } },
                { $sort: { rate: -1 } },
    ]);

  res.render('home', {
    title: 'Reporter Dashboard',
    summary,
    sleepSummary
  });
};

exports.recent = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 7;
  const skip = (page * limit) - limit;

  const weeklySummaryPromise = Snapshot
    .dailySummary()
    .skip(skip)
    .limit(limit);

  const countPromise = Snapshot.dailySummary();
  const [weeklySummary, count] = await Promise.all([weeklySummaryPromise, countPromise]);
  const snapsCount = weeklySummary.reduce((sum, week) => sum + week.count, 0);
  const pages = Math.ceil(count.length / limit);
  if (!weeklySummary.length && skip) {
    req.flash('info', 'Page does not exist!');
    res.redirect('/recent');
    return;
  }

  res.render('recent', {
    title: 'Recent Snapshots',
    weeklySummary,
    page,
    pages,
    snapsCount
  });
};

exports.snapshotDetails = async (req, res) => {
  const _id = req.params.id;
  const q = { _id };
  const snapshot = await Snapshot.find(q);
  if (!snapshot.length) {
    req.flash('errors', 'Snapshot does not exist!');
    res.redirect('/recent');
    return;
  }
  res.render('snapshot', {
    title: 'Snapshot Summary',
    snapshot
  });
};
