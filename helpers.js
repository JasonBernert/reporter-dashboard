const fs = require('fs');

exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.addCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

exports.icon = name => fs.readFileSync(`./public/icons/${name}.svg`);

exports.weatherIcons = {
  Overcast: 'wi-cloudy',
  'Partly Cloudy': 'wi-day-cloudy',
  'Scattered Clouds': 'wi-cloud',
  'Mostly Cloudy': 'wi-cloudy',
  Rain: 'wi-showers',
  'Light Rain': 'wi-sprinkle',
  'Heavy Rain': 'wi-rain',
  Snow: 'wi-snow',
  'Ice Pellets': 'wi-hail',
  Fog: 'wi-fog',
  Clear: 'wi-day-sunny'
};
