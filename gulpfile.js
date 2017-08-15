const gulp = require('gulp');
const Server = require('karma').Server;
const del = require('del');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const minifyCss = require('gulp-minify-css');
const htmlReplace = require('gulp-html-replace');

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('clean', function() {
  return del(['dist/**/*']);
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(['app/**/*.js', '!app/**/*.test.js'])
             .pipe(babel({presets: ['es2015']}))
             .pipe(concat('all.min.js'))
             .pipe(ngAnnotate())
             .pipe(uglify())
             .pipe(gulp.dest('dist/'));
});

gulp.task('css', ['clean'], function() {
  return gulp.src('app/**/*.css')
             .pipe(concat('style.min.css'))
             .pipe(minifyCss())
             .pipe(gulp.dest('dist/'));
});

gulp.task('html', ['clean'], function() {
  return gulp.src(['app/**/*.html', '!app/index.html', 'app/favicon.ico'])
             .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean', 'scripts', 'css', 'html'], function() {
  return gulp.src('app/index.html')
             .pipe(htmlReplace({
               css: 'style.min.css',
               js: 'all.min.js'
             }))
             .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);