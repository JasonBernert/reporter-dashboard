exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.addCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
