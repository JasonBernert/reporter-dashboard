const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/../variables.env') });
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Snapshot = require('../models/Snapshot');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '/reporter-export.json'), 'utf-8'));
const snapshots = data.snapshots;

async function loadData() {
  try {
    await Snapshot.insertMany(snapshots);
    console.log('Uploading data complete!');
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

loadData();
