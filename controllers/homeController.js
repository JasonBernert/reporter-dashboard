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
  const limit = 7;
  const skip = (page * limit) - limit;

  // const d = { sectionIdentifier: '1-2017-7-3' };
  //
  const weeklySummaryPromise = Snapshot
    .dailySummary()
    .skip(skip)
    .limit(limit)
    .sort({ date: 1 });

  const countPromise = Snapshot.count();

  const [weeklySummary, count] = await Promise.all([weeklySummaryPromise, countPromise]);

  const pages = Math.ceil(count / limit);
  if (!weeklySummary.length && skip) {
    req.flash('info', 'Page does not exist!');
    res.redirect(`/stores/page/${pages}`);
    return;
  }

  res.render('recent', {
    title: 'Recent Snapshots',
    weeklySummary,
    page,
    pages,
    count
  });
};

exports.test = async (req, res) => {
  const limit = parseFloat(req.params.limit);

  const snapshots = await Snapshot
    .find()
    .limit(limit);
  res.json(snapshots);
};

exports.getAwakeSnaps = async (req, res) => {
  const q = { 'responses.questionPrompt': 'How did you sleep?' };

  const awakeSnaps = await Snapshot
    .find(q)
    .sort({ date: -1 })
    .limit(10);

  res.json(awakeSnaps);
};

// exports.getPeople = async (req, res) => {
//   const q = { 'responses.questionPrompt': 'Who are you with?' };
//   const peopleSummary = await Snapshot.countOccurrences('responses');
//   res.json(peopleSummary);
// };

exports.snapshotDetails = async (req, res) => {
  const _id = req.params.id;
  const q = { _id };
  const snapshot = await Snapshot.find(q);
  res.json(snapshot);
};
