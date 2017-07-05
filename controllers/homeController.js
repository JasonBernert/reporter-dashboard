const mongoose = require('mongoose');

const Snapshot = mongoose.model('Snapshot');

exports.index = async (req, res) => {
  const count = await Snapshot.count();

  const firstSnap = await Snapshot
    .find()
    .sort({ date: 1 })
    .limit(1);

  const first = firstSnap[0];

  res.render('home', {
    title: 'Home',
    count,
    first
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
    // .select('responses')
    .sort({ data: 'desc' })
    .limit(10);

  res.json(awakeSnaps);
};
