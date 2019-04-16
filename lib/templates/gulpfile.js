const { task } = require('gulp');
const { build, watch } = require('bozon/lib/tasks');

task('build', build);
task('watch', watch);
