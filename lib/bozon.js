var gulp = require('gulp');
var utils = require('./utils');
var Settings = require('./settings');

var bozon = {
  Settings: Settings,

  utils: utils,

  task: function () {
    return gulp.task.apply(gulp, arguments);
  },

  src: function (suffix) {
    return gulp.src(utils.source(suffix));
  },

  dest: function (suffix) {
    return gulp.dest(utils.destination(suffix));
  }
}

module.exports = bozon
