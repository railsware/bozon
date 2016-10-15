require('bozon/lib/tasks');

//== Bozon tasks =============================================================================
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
// ===========================================================================================

// If you want to use CoffeeScript or any other compiled to Javascript language
// in your project, you can add corresponding gulp plugin to package.json
// include it and define task that will compile your code:
//
// coffee = require('gulp-coffee');
//
// bozon.task('scripts:main', function() {
//   return bozon.src('javascripts/main/**/*.coffee')
//     .pipe(coffee({bare: true}))
//     .pipe(bozon.dest('javascripts/main'));
// });

// If you want to use Sass or Stylus in your project, you can add corresponding
// gulp plugin to package.json, include it and define task that will compile
// your code:
//
// sass = require('gulp-sass');
//
// bozon.task('styles', function() {
//   return bozon.src('stylesheets/application.sass').pipe(sass.sync({
//     outputStyle: 'expanded',
//     precision: 10
//   }).on('error', sass.logError)).pipe(bozon.dest('stylesheets'));
// });

//== Using the "build"-pipeline ==============================================================
//
// If you want to add individual/additional task to the build-pipeline, you can
// use `bozon.buildTask` instead of `bozon.task`. This is adding a new task to
// the end of the build-pipeline.
//
// Bozons build-pipeline contains the following tasks in the given order:
// 1. scripts:main
// 2. scripts:renderer
// 3. styles
// 4. html
// 5. images
// 6. config
//
// If you want to add your task into a defined position, use
// `bozon.buildTaskBefore(existingTaskName, newTaskName, [dependencies,] taskFunction)` or
// `bozon.buildTaskAfter(existingTaskName, newTaskName, [dependencies,] taskFunction)`.
//
// For example:
//
// sass = require('gulp-sass');
//
// bozon.buildTaskAfter('styles', 'styles:sass', function() {
//   return bozon.src('stylesheets/**/*.sass').pipe(sass.sync({
//     outputStyle: 'expanded',
//     precision: 10
//   }).on('error', sass.logError)).pipe(bozon.dest('stylesheets'));
// });
//
//============================================================================================

//== Task names that are already used by bozon ===============================================
//
// html, styles, images, scripts:main, scripts:renderer, prepare:app
//
//============================================================================================
