angular = require('angular');
var ionic = require('./assets/lib/ionic/release/js/ionic.bundle.min');
const bussiness = require('./modules/business');
require('./assets/styles/ionic.min.css');
require('./assets/lib/calendar-pk/release/css/calendar_pk.min.css');
require('./assets/lib/ionic-filter-bar/release/ionic.filter.bar.min.css');
ngCache = require('angular-cache');
ngCookies = require('angular-cookies');
angular.module("app",[ionic,bussiness.name ,'calendar_pk',ngCookies,ngCache])
    .config(['$stateProvider', '$urlRouterProvider', require('./config.route')])
    .controller("AppCtrl",  require('./app.controller'));
const appConfig = require('./app.config');