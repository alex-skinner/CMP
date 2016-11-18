var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
//var del = require('del');
var buildPath = './app/build/';
var distPath = './app/dist/';
var tempPath = '__temp/';

gulp.task('copy-tpls', function () {
    return gulp.src([buildPath + 'templates/*.tpl.*']).pipe(gulp.dest(distPath + 'templates'));
});

gulp.task('compile-less', function () {
    return gulp.src(buildPath + 'style/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest(distPath + 'style/css'));
});

gulp.task('concat-css', ['compile-less'], function () {
    return gulp.src(distPath + 'style/css/*.css')
        .pipe(concat('Website.css'))
        .pipe(gulp.dest(distPath + 'style/'));
});

gulp.task('concat-js', function () {
    return gulp.src(
      [buildPath + 'config/**.js',
       buildPath + 'services/**.js',
       buildPath + 'factories/**.js',
       buildPath + 'filters/**.js',
       buildPath + 'controllers/**.js',
       buildPath + 'directives/**.js'
       ])
        .pipe(concat('App.js'))
        .pipe(gulp.dest(distPath + '/js/'));
});

//update references for template files in production code
gulp.task('update-tpl-refs', ['copy-tpls', 'concat-js'], function () {
    gulp.src(distPath + 'js/app.js')
        .pipe(replace('app/build', 'app/dist'))
        .pipe(gulp.dest(function (data) {
            return data.base;
        }));

});

//Delete the temporary file compilation share
// gulp.task('clean-temp', ['concat-css'], function(){
//     return del([
//         tempPath
//     ]);
// });

gulp.task('build-production', ['copy-tpls', 'update-tpl-refs', 'concat-css', 'concat-js', 'compile-less',]);

gulp.task('auto-build',['build-production'], function () {
    console.log('Listening for changes...');
    watch(buildPath + '**/*.*', function (event) {
        console.log('Detected changes...');
        gulp.start('build-production');
	console.log('Processed changes.');
    });
});
