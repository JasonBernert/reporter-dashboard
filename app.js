const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sassMiddleware = require('node-sass-middleware');
const helpers = require('./helpers');

/* Load environment variables from .env file*/
dotenv.load({ path: 'variables.env' });

/* Passport configuration  */
// const passportConfig = require('./config/passport');

/* Create Express server. */
const app = express();

/* Connect to MongoDB. */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// import all of our models
require('./models/Snapshot');
// require('./models/User');

/* Controllers (route handlers).*/
const homeController = require('./controllers/homeController');
// const userController = require('./controllers/user');

/* Express configuration. */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/css'),
  dest: path.join(__dirname, 'public/css'),
  // debug: true,
  outputStyle: 'compressed',
  prefix: '/css'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET,
  store: new MongoStore({
    url: process.env.DATABASE,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.h = helpers;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/* Primary app routes. */
app.get('/', homeController.index);
app.get('/api/:limit', homeController.test);
// app.get('/test', homeController.getAwakeSnaps);
// app.get('/people', homeController.getPeople);
app.get('/recent', homeController.recent);
app.get('/recent/page/:page', homeController.recent);
app.get('/snapshot/:id', homeController.snapshotDetails);

/* Error Handler */
app.use(errorHandler());

/* Start Express server */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;
