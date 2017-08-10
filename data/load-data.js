const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/../variables.env') });
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Snapshot = require('../models/Snapshot');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '/reporter-export.json'), 'utf-8'));
const snapshots = data.snapshots;

async function deleteData() {
  console.log('Deleting snapshot data...');
  await Snapshot.remove();
  console.log('Data deleted.');
  process.exit();
}

async function loadData() {
  try {
    console.log('Loading snapshot data...');
    await Snapshot.insertMany(snapshots);
    console.log('Loading data complete!');
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
