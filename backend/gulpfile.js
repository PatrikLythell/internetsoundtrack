var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var prefix = require('gulp-autoprefixer');
var notify = require("gulp-notify");
var livereload = require('gulp-livereload');
var stripDebug = require('gulp-strip-debug');

// Compile Our Less
// gulp.task('less', function() {
//     gulp.src('./less/style.less')
//         .pipe(less())
//         .on("error", notify.onError({
//             message: "Error: <%= error.message %>",
//             title: "Error running something"
//         }))
//         .on('error', function(err) {
//             console.log("Error: ", err);
//         })
//         .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
//         .pipe(gulp.dest('build'));
// });

// Lint Task
gulp.task('lint', function() {
    gulp.src('./public/javascripts/*')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    //single entry point to browserify
    gulp.src(['./public/javascripts/app.js'])
        .pipe(browserify({
          insertGlobals : false,
          debug : false
        }))
        // .pipe(stripDebug())
        .on("error", notify.onError({
            message: "Error: <%= error.message %>",
            title: "Error running something"
        }))
        .on('error', function(err) {
            console.log("Error: ", err);
        })
        .pipe(rename('build.js'))
        .pipe(gulp.dest('./public/build'))
        .pipe(rename('build.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('default', function() {

    gulp.run('lint', 'scripts');

    gulp.watch('./public/javascripts/**', function() {
        gulp.run('lint', 'scripts')
    });

    // Watch For Changes To Our LESS
    // gulp.watch('./less/*.less', function(){
    //     gulp.run('less');
    // });

    var server = livereload();
    gulp.watch('build/**').on('change', function(file) {
        server.changed(file.path);
    });

});
