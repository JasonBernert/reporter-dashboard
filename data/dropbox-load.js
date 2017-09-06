const path = require('path');
const Dropbox = require('dropbox');
const mongoose = require('mongoose');
const moment = require('moment');

require('dotenv').config({ path: path.join(__dirname, '/../variables.env') });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
const Snapshot = require('../models/Snapshot');

async function loadData(snapshots, mostRecent) {
  try {
    console.log('Checking files for new snapshots...');
    const newSnapshots = [];
    snapshots.forEach((snapshot) => {
      if (moment(snapshot.date).isAfter(mostRecent)) {
        newSnapshots.push(snapshot);
      }
    });
    if (newSnapshots.length === 0) {
      console.log('No new snapshots.');
      process.exit();
    }
    console.log(`Uploading ${newSnapshots.length} snapshots...`);
    await Snapshot.insertMany(newSnapshots);
    console.log('Uploading data complete!\n');
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

async function getData(sharedLinks) {
  try {
    const snapshots = [];
    await Promise.all(sharedLinks.map(async (sharedLink) => {
      const file = await dbx.sharingGetSharedLinkFile({ url: sharedLink.url });
      const data = JSON.parse(file.fileBinary);
      const dailySnapshots = data.snapshots;
      dailySnapshots.map(dailySnapshot => snapshots.push(dailySnapshot));
    }));
    return snapshots;
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

async function getDropboxList(mostRecent) {
  try {
    const recentFile = moment(mostRecent).subtract(1, 'day').format('YYYY-MM-DD');
    const response = await dbx.filesListFolder({ path: '/apps/reporter-app' });
    const entries = response.entries.sort((a, b) => new Date(b.name.split('-reporter')[0]) - new Date(a.name.split('-reporter')[0]));

    const paths = [];
    entries.forEach((entry) => {
      const fileDate = entry.name.split('-reporter')[0];
      if (moment(fileDate).isSameOrAfter(recentFile)) {
        paths.push(entry.path_lower);
      }
    });
    console.log(`${paths.length} new ${paths.length === 1 ? 'file' : 'files'} in dropbox.`);
    return paths;
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

async function findNewestSnapshot() {
  try {
    const mostRecentSnap = await Snapshot
      .find()
      .sort({ date: -1 })
      .limit(1);
    // TODO: If there are no documents in the DB, default to oldest possible date.
    const mostRecentFormated = moment(mostRecentSnap[0].date).format('LLL');
    console.log(`\nThe latest snapshot in your database is from ${mostRecentFormated}.`);
    return mostRecentSnap[0].date;
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

async function update() {
  const mostRecent = await findNewestSnapshot();
  const pathList = await getDropboxList(mostRecent);
  const sharedLinks = [];
  await Promise.all(pathList.map(async (path) => {
    const sharedLink = await dbx.sharingCreateSharedLink({ path });
    sharedLinks.push(sharedLink);
  }));
  const snapshots = await getData(sharedLinks);
  await loadData(snapshots, mostRecent);
  process.exit();
}

update();
