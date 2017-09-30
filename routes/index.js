const express = require('express');

const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const apiController = require('../controllers/apiController');
const passportConfig = require('../config/passport');

router.get('/', passportConfig.isAuthenticated, homeController.index);
router.get('/recent', passportConfig.isAuthenticated, homeController.recent);
router.get('/recent/page/:page', passportConfig.isAuthenticated, homeController.recent);
router.get('/snapshot/:id', passportConfig.isAuthenticated, homeController.snapshotDetails);

router.get('/api/v1/past/:limit', apiController.getLastFew);
router.get('/api/v1/people', apiController.getPeoples);
router.get('/api/v1/steps', apiController.steps);
router.get('/api/v1/steps/:sectionIdentifier', apiController.stepsOnDay);
router.get('/api/v1/excercise', apiController.excercise);
router.get('/api/v1/anAverageDay', apiController.anAverageDay);
router.get('/api/v1/coffees', apiController.coffees);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/signup', passportConfig.isAuthenticated, userController.getSignup);
router.post('/signup', userController.postSignup);

module.exports = router;
