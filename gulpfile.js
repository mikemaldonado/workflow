const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

var SOURCEPATHS = {
	sassSource : 'src/scss/*.scss'
}

var APPPATH = {
	root : 'app/',
	css : 'app/css',
	js : 'app/js'
}

gulp.task('sass', function() {
	return gulp.src(SOURCEPATHS.sassSource)
	.pipe(sass({
		outputStyle : 'expanded'}).on('error', sass.logError))
	.pipe(gulp.dest(APPPATH.css));
});

gulp.task('serve', [ 'sass' ], function() {
	
	browserSync.init([ APPPATH.css + '/*.css', APPPATH.root + '*.html',
			APPPATH.js + '/*.js' ], {
		server : {
			baseDir : APPPATH.root
		}
	});
	
	gulp.watch(SOURCEPATHS.sassSource, ['sass']);
	
});

gulp.task('default', [ 'serve' ]);