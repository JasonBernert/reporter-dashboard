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
  const limit = 10;
  const skip = (page * limit) - limit;

  const snapshotsPromise = Snapshot
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 });

  const countPromise = Snapshot.count();

  const [snapshots, count] = await Promise.all([snapshotsPromise, countPromise]);

  const pages = Math.ceil(count / limit);
  if (!snapshots.length && skip) {
    req.flash('info', 'Page does not exist!');
    res.redirect(`/stores/page/${pages}`);
    return;
  }

  res.render('recent', {
    title: 'Recent Snapshots',
    snapshots,
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
