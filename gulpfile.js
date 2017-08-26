const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const reload = browserSync.reload;
const clean = require('gulp-clean');

var SOURCEPATHS = {
	sassSource : 'src/scss/*.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/*.js'
}

var APPPATH = {
	root : 'app/',
	css : 'app/css',
	js : 'app/js'
}

gulp.task('copy', ['clean-html'], function() {
	return gulp.src(SOURCEPATHS.htmlSource)
			.pipe(gulp.dest(APPPATH.root));
});


gulp.task('scripts', ['clean-scripts'], function() {
	return gulp.src(SOURCEPATHS.jsSource)
			.pipe(gulp.dest(APPPATH.js));
});

gulp.task('clean-html', function() {
	return gulp.src(APPPATH.root + '*.html', { read:false, force: true })
			.pipe(clean());
});

gulp.task('clean-scripts', function() {
	return gulp.src(APPPATH.js + '/*.js', { read:false, force: true })
			.pipe(clean());
});

//compile sass
gulp.task('sass', function() {
	return gulp.src(SOURCEPATHS.sassSource)
	.pipe(autoprefixer())
	.pipe(sass({ outputStyle : 'expanded'}).on('error', sass.logError))
	.pipe(gulp.dest(APPPATH.css));
});

gulp.task('serve', [ 'sass', 'copy', 'scripts' ], function() {
	//initialize small server with files synchronized
	browserSync.init([ APPPATH.css + '/*.css', APPPATH.root + '*.html',
			APPPATH.js + '/*.js' ], {
		server : {
			baseDir : APPPATH.root
		}
	});
	
	//run sass after change detected in file
	gulp.watch(SOURCEPATHS.sassSource, ['sass']);
	gulp.watch(SOURCEPATHS.htmlSource, ['copy']);
	gulp.watch(SOURCEPATHS.jsSource, ['scripts']);
	
});

gulp.task('default', [ 'serve' ]);