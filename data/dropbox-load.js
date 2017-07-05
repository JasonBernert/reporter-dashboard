const path = require('path');
const Dropbox = require('dropbox');
const mongoose = require('mongoose');
const moment = require('moment');

require('dotenv').config({ path: path.join(__dirname, '/../variables.env') });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
const Snapshot = require('../models/Snapshot');

async function loadData(snapshots) {
  try {
    console.log(`Uploading ${snapshots.length} new snapshots...`);
    await Snapshot.insertMany(snapshots);
    console.log('Uploading data complete!');
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
    const response = await dbx.filesListFolder({ path: '/apps/reporter-app' });
    const entries = response.entries.sort((a, b) => new Date(b.name.split('-reporter')[0]) - new Date(a.name.split('-reporter')[0]));

    const paths = [];
    entries.forEach((entry) => {
      const fileDate = entry.name.split('-reporter')[0];
      if (moment(fileDate).isAfter(mostRecent)) {
        paths.push(entry.path_lower);
      }
    });
    if (paths.length === 0) {
      console.log('Your data is up to date!');
      process.exit();
    }
    console.log(`There are ${paths.length} new files.`);
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

    const mostRecent = mostRecentSnap[0].date.toISOString().split('T')[0];
    console.log(`The latest snapshot in your database is from ${mostRecent}`);
    return mostRecent;
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
  await loadData(snapshots);
  process.exit();
}

update();
