var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean =require('gulp-clean');
var concat = require('gulp-concat');
//var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
	sassSource: 'src/scss/*.scss',
	sassApp : 'src/scss/app.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/**',
	imgSource : 'src/img/**'
}
var APPPATH ={
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
}

gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '*.html', {read: false, force: true })
      .pipe(clean());
});
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
      .pipe(clean());
});

gulp.task('clean-images', function() {
  return gulp.src(APPPATH.img + '/**', {read: false, force: true })
      .pipe(clean());
});


gulp.task('sass', function(){
 // var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  
  
  sassFiles = gulp.src(SOURCEPATHS.sassApp)
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
       //merge(bootstrapCSS, sassFiles)
       .pipe(autoprefixer())
       .pipe(concat('app.css'))
       .pipe(gulp.dest(APPPATH.css));
  return sassFiles;
});

gulp.task('init-images', ['clean-images'], function(done) {

	gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(imagemin())
		.pipe(gulp.dest(APPPATH.img))
		 .on("end", function() {
        done();
    });
});

gulp.task('images', function() {
    return gulp.src(SOURCEPATHS.imgSource)
      .pipe(newer(APPPATH.img))
      .pipe(imagemin())
      .pipe(gulp.dest(APPPATH.img))
      
});

gulp.task('moveFonts', function() {
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
      .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts',['clean-scripts'],  function() {
  gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATH.js))
});

/** Production Tasks **/
gulp.task('compress',  function() {
  gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(minify())
      .pipe(gulp.dest(APPPATH.js))
});

gulp.task('compresscss', function(){
  //var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      // merge(bootstrapCSS, sassFiles)
        .pipe(autoprefixer())
         .pipe(concat('app.css'))
         .pipe(cssmin())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest(APPPATH.css));
  return sassFiles;
});

gulp.task('minifyHtml', function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest(APPPATH.root))
});

/** End of Production Tasks **/

gulp.task('html', ['clean-html'], function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});
/*
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
});
*/

gulp.task('serve', ['html'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['sass', 'scripts', 'serve'], function() {
    gulp.watch(SOURCEPATHS.sassSource, ['sass']);
    //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch(SOURCEPATHS.jsSource, ['scripts']);
    gulp.watch(SOURCEPATHS.imgSource, ['images']);
    gulp.watch(SOURCEPATHS.htmlSource, ['html']);
} );

gulp.task('default', ['init-images'], function() {
	gulp.start('watch');
});

gulp.task('production', ['minifyHtml', 'compresscss', 'compress'] );
