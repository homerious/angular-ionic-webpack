'use strict';
require('../../assets/lib/ionic-filter-bar/release/ionic.filter.bar.min.css');
var filterBar = require('../../assets/lib/ionic-filter-bar/release/ionic.filter.bar.min');

module.exports = angular.module("app.business",
    [filterBar.name,'ionic-datepicker']);


//把所有js文件引入
function importAll (r) {
    r.keys().forEach(r);
}
importAll(require.context('./', true, /\.js$/));
