const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const reload = browserSync.reload;
const clean = require('gulp-clean');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const minifycss = require('gulp-cssmin');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
	sassSource : 'src/scss/*.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/*.js',
	imgSource : 'src/img/**'
}

var APPPATH = {
	root : 'app/',
	css : 'app/css',
	js : 'app/js',
	fonts : 'app/fonts',
	img : 'app/img'
}

gulp.task('copy', ['clean-html'], function() {
	return gulp.src(SOURCEPATHS.htmlSource)
			.pipe(gulp.dest(APPPATH.root));
});

gulp.task('moveFonts', function() {
	gulp.src('./node_modules/bootstrap/fonts/*.{svg,eot,ttf,woff,woff2}')
		.pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'], function() {
	return gulp.src(SOURCEPATHS.jsSource)
			.pipe(concat('main.js'))
			.pipe(browserify())
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

//minify image
gulp.task('images', function() {
	return gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(imagemin())
		.pipe(gulp.dest(APPPATH.img));
});

//compile sass
gulp.task('sass', function() {
	
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer())
		.pipe(sass({ outputStyle : 'expanded'}).on('error', sass.logError));
	
	return merge(sassFiles, bootstrapCSS)
		.pipe(concat('app.css'))
		.pipe(gulp.dest(APPPATH.css));
});

/**Production Tasks**/
gulp.task('compressjs', ['clean-scripts'], function() {
	return gulp.src(SOURCEPATHS.jsSource)
			.pipe(concat('main.js'))
			.pipe(browserify())
			.pipe(minify())
			.pipe(gulp.dest(APPPATH.js));
});

gulp.task('compresscss', function() {
	
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer())
		.pipe(sass({ outputStyle : 'expanded'}).on('error', sass.logError));
	
	return merge(sassFiles, bootstrapCSS)
		.pipe(concat('app.css'))
		.pipe(minifycss())
		.pipe(rename({suffix : '.min'}))
		.pipe(gulp.dest(APPPATH.css));
});

gulp.task('compresshtml', ['clean-html'], function() {
	return gulp.src(SOURCEPATHS.htmlSource)
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest(APPPATH.root));
});
/**End of Production**/

gulp.task('serve', ['sass', 'copy', 'scripts', 'moveFonts', 'images'], function() {
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
	gulp.watch(SOURCEPATHS.imgSource, ['images']);
	
});

gulp.task('default', [ 'serve' ]);
gulp.task('production', ['compresscss', 'compressjs', 'compresshtml']);