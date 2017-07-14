exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.addCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

exports.weatherIcons = {
  Overcast: 'wi-cloudy',
  'Partly Cloudy': 'wi-day-cloudy',
  'Scattered Clouds': 'wi-cloud',
  'Mostly Cloudy': 'wi-cloudy',
  Clear: 'wi-day-sunny',
  Rain: 'wi-showers',
  'Light Rain': 'wi-sprinkle',
  'Heavy Rain': 'wi-rain',
  Snow: 'wi-snow',
  'Ice Pellets': 'wi-hail',
  Fog: 'wi-fog'
};
