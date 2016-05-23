//== Bozon tasks ===============================================================
//
// Bozon carries out common tasks: start, test, clear, package
// If you want to add or override some tasks, you should require bozon:
//
// var bozon = require('bozon/lib/bozon');
//
// which acts a simple wrapper for gulp.
// So now you can use `bozon.task`,  `bozon.src` and `bozon.dest` to define
// your tasks. Bozon will handle proper app and build paths for you.
//
// If you want to add your task to the "build"-pipeline, you can use
// `bozon.buildTask` instead of `bozon.task`.
//
// =============================================================================

require('bozon/tasks/all');

// If you want to use CoffeeScript or any other compiled to Javascript language
// in your project, you can add corresponding gulp plugin to package.json
// include it and define task that will compile your code:
//
// coffee = require('gulp-coffee');
//
// bozon.task('scripts:main', function() {
//   bozon.src('javascripts/main/**/*.coffee')
//     .pipe(coffee({bare: true}))
//     .pipe(bozon.dest('javascripts/main'));
// });


// If you want to use Sass of Stylus in your project, you can add corresponding
// gulp plugin to package.json, include it and define task that will compile
// your code:
//
// sass = require('gulp-sass');
//
// bozon.task('styles', function() {
//   bozon.src('stylesheets/**/*.sass').pipe(sass.sync({
//     outputStyle: 'expanded',
//     precision: 10
//   }).on('error', sass.logError)).pipe(bozon.dest('stylesheets'));
// });

//== Task names that are already used by bozon =================================
//
// start, clear, clear:builds, clear:packages, compile, build:development,
// build:test, config, html, styles, images, scripts:main, scripts:renderer,
// package, package:test, electron, mocha, test
//
//==============================================================================
