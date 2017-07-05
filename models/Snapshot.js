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
  }
});

snapshotSchema.statics.getMetadata = function () {
  return this.aggregate([{ $count: 'totalSnaps' }]);
};

const Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
