const mongoose = require('mongoose');

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

  res.render('home', {
    title: 'Home',
    summary
  });
};

exports.recent = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 27;
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

  // res.json(weeklySummary);

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
  res.render('snapshot', {
    title: 'Snapshot Summary',
    snapshot
  });
};
