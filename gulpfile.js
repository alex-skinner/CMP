var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');

gulp.task('compile-less', function () {
    return gulp.src('./app/style/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./app/style/css'));
});

gulp.task('concat-css', ['compile-less'], function () {
    return gulp.src('./app/style/css/*.css')
        .pipe(concat('Website.css'))
        .pipe(gulp.dest('./app/style/dist/'));
});

gulp.task('concat-js', function () {
    return gulp.src(
      ['./app/config/**.js',
       './app/services/**.js',
       './app/factories/**.js',
       './app/filters/**.js',
       './app/controllers/**.js',
       './app/directives/**.js'
       ])
        .pipe(concat('App.js'))
        .pipe(gulp.dest('./app/dist/'));
});
