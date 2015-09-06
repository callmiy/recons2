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
var rootApp = require('./core_recons/build.config')

var lessFiles = [
  './payment/static/payment/**/*.less',
  './letter_of_credit/static/letter_of_credit/**/*.less'
]

var initialCssFiles = [
  bower + '/bootstrap/dist/css/bootstrap.css',
  bower + '/jquery-ui/themes/smoothness/jquery-ui.css',
  baseStaticCss + '/recons-base.css'
]

var lessNoCssMinFiles = [baseStaticCss + '/recons-base.less']

gulp.task('minify-html', function() {
  return gulp.src(['./**/*.raw.html'], {base: '.'})
    .pipe(plugins.changed('.', {
            hasChanged: function(stream, cb, sourceFile, targetPath) {
              targetPath = targetPath.replace(/\.raw\.html$/, '.html')
              plugins.changed.compareLastModifiedTime(stream, cb, sourceFile, targetPath)
            }
          }))
    .pipe(plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
          }))
    .pipe(plugins.rename(function(path) {
            path.basename = path.basename.replace('.raw', '')
                   }))
    .pipe(gulp.dest("."))
})

gulp.task('initial-css', function() {
  return gulp.src(initialCssFiles)
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
    .pipe(plugins.addSrc.append(baseStaticJs + '/initial/lib.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/initial/FileSaver.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/initial/directives/kanmii-number-format.js'))
    .pipe(plugins.addSrc.append(baseStaticJs + '/initial/directives/kanmii-to-upper.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('compiled.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(baseStaticJs + '/initial'))
})

gulp.task('webpack-root-app', function() {
  return gulp.src(rootApp.entry)
    .pipe(plugins.webpack(rootApp.webpackConfig, webpack))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(rootApp.destDir))
})

gulp.task('less-no-css-min', function() {
  return gulp.src(lessNoCssMinFiles, {base: '.'})
    .pipe(plugins.less())
    .pipe(plugins.rename({suffix: '', extname: '.css'}))
    .pipe(gulp.dest(''))
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

gulp.task('webpack', ['webpack-letter-of-credit', 'webpack-payment', 'webpack-root-app'])

gulp.task('watch', function() {
  gulp.watch(lessFiles, ['less'])
  gulp.watch(['./**/*.raw.html'], ['minify-html'])
  gulp.watch(lessNoCssMinFiles, ['less-no-css-min', 'initial-css'])
})

gulp.task('default', ['initial', 'webpack', 'watch'])
