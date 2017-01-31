// Include gulp
var gulp = require('gulp');

// Include Plugins
var resourcesDir = 'resources';
var less = require('gulp-less');
var jshint = require('gulp-jshint');

gulp.task('templates', function() {
 gulp.src(resourcesDir+'/*.html')
    .pipe(gulp.dest('public'))
});

gulp.task('fonts', function() {
 gulp.src([
        resourcesDir+'/fonts/*/!(less)/*.*',
        resourcesDir+'/fonts/*/*.*'
    ])
    .pipe(gulp.dest('public/fonts/'))
});

gulp.task('images', function() {
 gulp.src(resourcesDir+'/images/*.*')
    .pipe(gulp.dest('public/images'))
});

// Compile less
gulp.task('less', function() {
    return gulp.src(resourcesDir+'/less/all.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
    gulp.src(resourcesDir+'/js/*.js')
        .pipe(gulp.dest('public/js'))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src(resourcesDir+'/js/inner.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch(resourcesDir+'/less/*.less', ['less']);
    gulp.watch(resourcesDir+'/images/*', ['images']);
    gulp.watch(resourcesDir+'/fonts/*', ['fonts']);
    gulp.watch(resourcesDir+'/*.html', ['templates']);
    gulp.watch(resourcesDir+'/js/*.js', ['lint', 'js']);
});

// Default Task
gulp.task('default', ['less', 'templates', 'fonts', 'images', 'lint', 'js', 'watch']);