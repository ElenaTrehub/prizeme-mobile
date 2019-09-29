"use strict";

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();
const useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf'),
    notify = require("gulp-notify"),
    ftp = require( 'vinyl-ftp' ),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include');

const paths = {
    appDir : "app/",
    devDir : "dist/",
    blockDir : "blocks/"
}

gulp.task('html', function () {
    return gulp.src(paths.blockDir + "*.html")
        .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }
        ))
        .pipe(gulp.dest(paths.appDir))
        .pipe(browserSync.stream());

});

gulp.task('sass', function () {
    return gulp.src(paths.blockDir + "*.sass")
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            dirname: "",
            basename: "main",
            extname: ".css"
        }))
        .pipe(prefix())
        .pipe(gulp.dest(paths.appDir + '/css'))
        .pipe(browserSync.stream());
});
gulp.task('css', function () {
    return gulp.src(paths.blockDir + '**/*.css')
        .pipe(plumber())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(paths.appDir + '/css'))
        .pipe(browserSync.stream());
});
gulp.task('scripts', function(){
    return gulp.src([paths.blockDir + 'js/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.appDir + '/js'))
        .pipe(browserSync.stream())
});
gulp.task('libs', function(){
    return gulp.src([paths.blockDir + 'js/libs/*.js'])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(paths.appDir + '/js'))
        .pipe(browserSync.stream())
});
gulp.task('watch', function(){
    gulp.watch(paths.blockDir + '**/*.html', ['html']);
    gulp.watch(paths.blockDir + '**/*.sass', ['sass']);
    gulp.watch(paths.blockDir + '**/*.css', ['css']);
    gulp.watch(paths.blockDir + 'js/*.js', ['scripts']);
    gulp.watch(paths.blockDir + 'js/libs/*.js', ['libs']);

});
gulp.task('browser-sync', function(){
    browserSync.init({
        port: 3000,
        server: {
            baseDir: paths.appDir
        }
    });
});

gulp.task('clean', function (cb) {
    rimraf(paths.devDir, cb);
});
gulp.task('build', ['clean'], function(){
    return gulp.src(paths.appDir + '*.html')
        .pipe(useref())
        .pipe(gulp.dest(paths.devDir))

});
gulp.task('cssBuild', ['clean'], function () {
    return gulp.src(paths.appDir + 'css/main.css')
        .pipe( gulpif( '*.css', cleanCSS()))
        .pipe(gulp.dest(paths.devDir + 'css/'))
});
gulp.task('cssLibsBuild', ['clean'], function () {
    return gulp.src(paths.appDir + 'css/libs.css')
        .pipe( gulpif( '*.css', cleanCSS()))
        .pipe(gulp.dest(paths.devDir + 'css/'))
});
gulp.task('jsBuild', ['clean'], function () {
    return gulp.src(paths.appDir + 'js/main.js')
        .pipe( gulpif('*.js', uglify()))
        .pipe(gulp.dest(paths.devDir + 'js/'))
});
gulp.task('jsLibsBuild', ['clean'], function () {
    return gulp.src(paths.appDir + 'js/libs.js')
        .pipe( gulpif('*.js', uglify()))
        .pipe(gulp.dest(paths.devDir + 'js/'))
});
gulp.task('imgBuild', ['clean'], function () {
    return gulp.src(paths.appDir + 'images/*.*')
        .pipe( gulpif('*.*', imagemin()))
        .pipe(gulp.dest(paths.devDir + 'images/'));
});

gulp.task('fontsBuild', ['clean'], function(){
    return gulp.src(paths.appDir + '/fonts/*')
        .pipe(gulp.dest(paths.devDir + 'fonts/'));
});

gulp.task('send', function(){
    const conn = ftp.create({
        host: '77.128.110.166',
        user: 'alexlabs',
        password: 'Arj4h00F9x',
        parallel: 5
    });


    const globs = [
        'build/**/*',
        'node_modules/**'
    ];

    return gulp.src(globs, {base: '.', buffer: false})
    // .pipe( conn.newer('/'))
        .pipe( conn.dest('/'))
        .pipe( notify("Dev site updated!"));

});

gulp.task('default', ['browser-sync','watch', 'html', 'sass', 'css', 'scripts', 'libs']);

gulp.task('prod', ['build', 'cssBuild', 'cssLibsBuild', 'jsBuild', 'jsLibsBuild', 'imgBuild', 'fontsBuild']);