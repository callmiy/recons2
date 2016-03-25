"use strict";

var gulp = require( 'gulp' )
var plugins = require( 'gulp-load-plugins' )()
var webpack = require( 'webpack' )

var baseStaticJs = './core_recons/static/core_recons/js'
var baseStaticCss = './core_recons/static/core_recons/css'
var bower = './bower_components'

var lessFiles = [
  './core_recons/static/core_recons/**/*.less',
  '!./core_recons/static/core_recons/css/recons-base.less',
  './letter_of_credit/static/letter_of_credit/**/*.less',
  './contingent_report/static/contingent_report/**/*.less'
]

var initialCssFiles = [
  bower + '/bootstrap/dist/css/bootstrap.css',
  bower + '/jquery-ui/themes/smoothness/jquery-ui.css',
  bower + '/jstree/dist/themes/default/style.css',
  //baseStaticCss + '/jquery.treeview.css',
  baseStaticCss + '/recons-base.css'
]

var minifyJsFiles = [
  '!./**/*.min.js',
  './contingent_report/static/contingent_report/**/*.js',
  './letter_of_credit/static/letter_of_credit/js/lc-register-upload.js',
  './letter_of_credit/static/letter_of_credit/js/uploaded-form-m/uploaded-form-m.js',
  './letter_of_credit/static/letter_of_credit/js/process_swift/process_swift.js',
]

var lessNoCssMinFiles = [baseStaticCss + '/recons-base.less']

gulp.task( 'minify-html', function () {
  return gulp.src( ['./**/*.raw.html'], { base: '.' } )
    .pipe( plugins.changed( '.', {
      hasChanged: function (stream, cb, sourceFile, targetPath) {
        targetPath = targetPath.replace( /\.raw\.html$/, '.html' )
        plugins.changed.compareLastModifiedTime( stream, cb, sourceFile, targetPath )
      }
    } ) )
    .pipe( plugins.minifyHtml( {
      empty: true,
      spare: true,
      quotes: true
    } ) )
    .pipe( plugins.rename( function (path) {
      path.basename = path.basename.replace( '.raw', '' )
    } ) )
    .pipe( gulp.dest( "." ) )
} )

gulp.task( 'initial-css', function () {
  var gulpInitialCss = gulp.src( initialCssFiles[0] )

  for ( var i = 1; i < initialCssFiles.length; i++ ) {
    gulpInitialCss = gulpInitialCss.pipe( plugins.addSrc.append( initialCssFiles[i] ) )
  }
  gulpInitialCss.pipe( plugins.concat( 'compiled.css' ) )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.minifyCss() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( baseStaticCss ) )

  return gulpInitialCss
} )

gulp.task( 'initial-js', function () {
  return gulp.src( bower + '/jquery/dist/jquery.js' )
    .pipe( plugins.addSrc.append( bower + '/angular/angular.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-route/angular-route.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-animate/angular-animate.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-ui-router/release/angular-ui-router.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-resource/angular-resource.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-cookies/angular-cookies.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-messages/angular-messages.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-bootstrap/ui-bootstrap-tpls.js' ) )
    .pipe( plugins.addSrc.append( bower + '/angular-modal-service/dst/angular-modal-service.js' ) )
    .pipe( plugins.addSrc.append( bower + '/bootstrap/dist/js/bootstrap.js' ) )
    .pipe( plugins.addSrc.append( bower + '/jquery-ui/jquery-ui.js' ) )
    .pipe( plugins.addSrc.append( bower + '/papa-parse/papaparse.js' ) )
    .pipe( plugins.addSrc.append( bower + '/underscore/underscore.js' ) )
    .pipe( plugins.addSrc.append( bower + '/jstree/dist/jstree.js' ) )
    .pipe( plugins.addSrc.append( bower + '/urijs/src/URI.js' ) )
    .pipe( plugins.addSrc.append( bower + '/ng-file-upload/ng-file-upload.js' ) )
    .pipe( plugins.addSrc.append( baseStaticJs + '/initial/lib.js' ) )
    .pipe( plugins.addSrc.append( baseStaticJs + '/initial/FileSaver.js' ) )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.concat( 'compiled.js' ) )
    .pipe( plugins.uglify() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( baseStaticJs + '/initial' ) )
} )

gulp.task( 'webpack', function () {
  return gulp.src( './app/app/app.js' )
    .pipe( plugins.webpack( require( './webpack.config.base.js' ).webpackAppConfig, webpack ) )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.uglify() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( './app/app' ) )
} )

gulp.task( 'less-no-css-min', function () {
  return gulp.src( lessNoCssMinFiles, { base: '.' } )
    .pipe( plugins.less() )
    .pipe( plugins.rename( { suffix: '', extname: '.css' } ) )
    .pipe( gulp.dest( '' ) )
} )

var path = require( 'path' )

gulp.task( 'less', function () {
  return gulp.src( lessFiles, { base: '.' } )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.less() )
    .pipe( plugins.minifyCss() )
    .pipe( plugins.rename( { suffix: '.min', extname: '.css' } ) )
    .pipe( plugins.sourcemaps.write( '.', {
      sourceMappingURL: function (file) {
        return path.basename( file.path ) + '.map'
      }
    } ) )
    .pipe( gulp.dest( '' ) )
} )

gulp.task( 'less-app', function () {
  return gulp.src( './app/app/app.less', { base: '.' } )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.less() )
    .pipe( plugins.minifyCss() )
    .pipe( plugins.rename( { suffix: '.min', extname: '.css' } ) )
    .pipe( plugins.sourcemaps.write( '.', {
      sourceMappingURL: function (file) {
        return path.basename( file.path ) + '.map'
      }
    } ) )
    .pipe( gulp.dest( '' ) )
} )

gulp.task( 'minify-js', function () {
  return gulp.src( minifyJsFiles, { base: '.' } )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.uglify() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( '.' ) )
} )

gulp.task( 'initial', ['initial-js', 'initial-css'] )

gulp.task( 'watch', function () {
  gulp.watch( minifyJsFiles, ['minify-js'] )
  gulp.watch( lessFiles, ['less'] )
  gulp.watch( ['./**/*.raw.html'], ['minify-html'] )
  gulp.watch( ['./app/app/**/*.less'], ['less-app'] )
  gulp.watch( lessNoCssMinFiles, ['less-no-css-min', 'initial-css'] )
} )

gulp.task( 'default', ['initial', 'webpack', 'watch'] )
