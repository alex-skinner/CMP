var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
 
gulp.task('compile-less', function () {
  return gulp.src('./app/style/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./app/style/css'));
});