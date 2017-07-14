const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  responses: {
    items: {
      properties: {
        questionPrompt: {
          type: String
        },
        uniqueIdentifier: {
          type: String
        },
        tokens: [{
          uniqueIdentifier: String,
          text: [String]
        }],
        answeredOptions: {
          items: [String],
        },
      },
      type: Object
    },
    type: Array
  },
  altitude: {
    adjustedPressure: Number,
    floorsAscended: Number,
    floorsDescended: Number,
    gpsAltitudeFromLocation: Number,
    gpsRawAltitude: Number,
    pressure: Number,
    uniqueIdentifier: String
  },
  audio: {
    avg: Number,
    peak: Number,
    uniqueIdentifier: String
  },
  background: Number,
  battery: Number,
  connection: Number,
  date: Date,
  draft: Number,
  location: {
    altitude: Number,
    course: Number,
    horizontalAccuracy: Number,
    latitude: Number,
    longitude: Number,
    placemark: {
      administrativeArea: String,
      country: String,
      locality: String,
      name: String,
      postalCode: String,
      region: String,
      subAdministrativeArea: String,
      subLocality: String,
      thoroughfare: String,
      uniqueIdentifier: String
    },
    speed: Number,
    timestamp: String,
    uniqueIdentifier: String,
    verticalAccuracy: Number
  },
  reportImpetus: Number,
  sectionIdentifier: String,
  steps: Number,
  uniqueIdentifier: String,
  weather: {
    dewpointC: Number,
    feelslikeC: Number,
    feelslikeF: Number,
    latitude: Number,
    longitude: Number,
    precipTodayIn: Number,
    precipTodayMetric: Number,
    pressureIn: Number,
    pressureMb: Number,
    relativeHumidity: String,
    stationID: String,
    tempC: Number,
    tempF: Number,
    uniqueIdentifier: String,
    uv: Number,
    visibilityKM: Number,
    visibilityMi: Number,
    weather: String,
    windDegrees: Number,
    windDirection: String,
    windGustKPH: Number,
    windGustMPH: Number,
    windKPH: Number,
    windMPH: Number
  },
  photoSet: {
    photos: [{
      sensingMode: Number,
      depth: Number,
      longitudeRef: String,
      software: String,
      pixelHeight: Number,
      apertureValue: Number,
      meteringMode: Number,
      sceneCaptureType: Number,
      uniqueIdentifier: String,
      isoSpeed: Number,
      latitude: Number,
      dateTime: Date,
      make: String,
      exposureMode: Number,
      pixelWidth: Number,
      orientation: Number,
      longitude: Number,
      fNumber: Number,
      assetUrl: String,
      exposureProgram: Number,
      exposureTime: Number,
      model: String,
      whiteBalance: Number,
      focalLength: Number,
      flash: Number,
      resolutionUnit: Number,
      latitudeRef: String
    }],
    uniqueIdentifier: String
  }
}, {
  strict: true
});

snapshotSchema.statics.countOccurrences = function (q) {
  return this.aggregate([
    // { $match: '$tags' },
    // { $unwind: '$tags' },
    { $group: { _id: `$${q}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

snapshotSchema.statics.dailySummary = function () {
  // TODO: Maybe this would work better?
  // Sort reports by $sectionIdentifier desc.
  // Find $sectionIdentifier of date where reportImpetus === 5, aka waking up.
  // Then find the next report where reportImpetus === 4, aka sleeping.
  // Then return those reports and reports in bewteen.
  // https://stackoverflow.com/questions/8136652/query-mongodb-on-month-day-year-of-a-datetime
  return this.aggregate([
    { $group: {
      _id: { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } },
      snapshots: { $push: { _id: '$_id', date: '$date', responses: '$responses' } }
    } },
    { $unwind: '$snapshots' },
    { $sort: { 'snapshots.date': 1 } },
    { $group: { _id: '$_id', count: { $sum: 1 }, snapshots: { $push: '$snapshots' } } },
    { $project: {
      year: '$_id.year',
      month: '$_id.month',
      day: '$_id.day',
      snapshots: '$snapshots',
      count: 1,
      _id: 0
    } },
    { $sort: { year: -1, month: -1, day: -1 } }
  ]);
};

const Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
