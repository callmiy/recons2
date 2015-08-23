"use strict";

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var webpack = require('webpack');
var browserSync = require('browser-sync').create()

var baseStaticJs = './core_recons/static/core_recons/js'
var baseStaticCss = './core_recons/static/core_recons/css'
var bower = './bower_components'

var letterOfCredit = require('./letter_of_credit/build.config')
var payment = require('./payment/build.config')

var lessFiles = [
  './payment/static/payment/**/*.less'
]

gulp.task('initial-css', function() {
  return gulp.src([
    bower + '/bootstrap/dist/css/bootstrap.css',
    bower + '/jquery-ui/themes/smoothness/jquery-ui.css',
    baseStaticCss + '/recons-base.css'
  ])
    .pipe(plugins.concat('compiled.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(baseStaticCss))
})

gulp.task('initial-js', function() {
  return gulp.src(bower + '/jquery/dist/jquery.js')
    .pipe(plugins.addSrc.append(bower + '/angular/angular.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-route/angular-route.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-animate/angular-animate.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-ui-router/release/angular-ui-router.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-resource/angular-resource.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-cookies/angular-cookies.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-bootstrap/ui-bootstrap-tpls.js'))
    .pipe(plugins.addSrc.append(bower + '/angular-modal-service/dst/angular-modal-service.js'))
    .pipe(plugins.addSrc.append(bower + '/bootstrap/dist/js/bootstrap.js'))
    .pipe(plugins.addSrc.append(bower + '/jquery-ui/jquery-ui.js'))
    .pipe(plugins.addSrc.append(bower + '/papa-parse/papaparse.js'))
    .pipe(plugins.addSrc.append(bower + '/underscore/underscore.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/lib.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/FileSaver.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/directives/kanmii-number-format.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/directives/kanmii-to-upper.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('compiled.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(baseStaticJs))
})

gulp.task('less', function() {
  return gulp.src(lessFiles, {base: '.'})
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({suffix: '.min', extname: '.css'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(''))
})

gulp.task('webpack-letter-of-credit', function() {
  return gulp.src(letterOfCredit.entry)
    .pipe(plugins.webpack(letterOfCredit.webpackConfig, webpack))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(letterOfCredit.destDir))
})

gulp.task('webpack-payment', function() {
  return gulp.src(payment.entry)
    .pipe(plugins.webpack(payment.webpackConfig, webpack))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(payment.destDir))
})

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'localhost:8000',
    files: ['**/*.html', '**/*.css', '**/*.js']
  })
})

gulp.task('initial', ['initial-js', 'initial-css'])

gulp.task('webpack', ['webpack-letter-of-credit', 'webpack-payment'])

gulp.task('watch', function() {
  gulp.watch(lessFiles, ['less'])
})

gulp.task('default', ['initial', 'watch', 'webpack'])
