const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const cssFiles = [

	'./src/css/some.css',
	'./src/css/other.css'

];
const jsFiles = [
	'./src/js/lib.js',
	'./src/js/some.js'
];






function styles() {
	return gulp.src(cssFiles)
			.pipe(concat('style.css'))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(gulp.dest('./build/css'))
			.pipe(browserSync.stream());
};

function scripts() {
	return gulp.src(jsFiles)
			.pipe(concat('all.js'))
			.pipe(uglify({
				toplevel: true
			}))
			.pipe(gulp.dest('./build/js'))
			.pipe(browserSync.stream());
	
};



function watch() {
	  browserSync.init({
        server: {
            baseDir: "./"
        },
        // tunnel: true
    });

	// gulp.watch('./src/css/**/*.css',styles);
	// gulp.watch('./src/scss/**/*.scss',cssSass);
	gulp.watch('./src/scss/**/*.scss',sassprefixclean);
	gulp.watch('./src/js/**/*.js',scripts);
	gulp.watch('./src/*.pug',pughtml);
	gulp.watch('./*.html',browserSync.reload);
	
};


function clean() {
	return del(['build/*']);
};


function pughtml() {
	return gulp.src('src/*.pug')
	  .pipe(pug({
	    // Your options in here.
	  }))
	  .pipe(gulp.dest('./'))
	   .pipe(browserSync.stream());
};
function cssSass() {
	return gulp.src('./src/scss/**/*.scss')
			    .pipe(sass().on('error', sass.logError))
			    .pipe(gulp.dest('./build/css'))
			    .pipe(browserSync.stream());
};

function sassprefixclean(argument) {
	return gulp.src('./src/scss/**/*.scss')
			    .pipe(sass().on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 2 versions'],
					cascade: false
				}))
				.pipe(cleanCSS({
					level: 2
				}))
			 	.pipe(gulp.dest('./build/css'))
			    .pipe(browserSync.stream());
};




gulp.task('styles',styles);
gulp.task('scripts',scripts);
gulp.task('watch',watch);
gulp.task('clean',clean);
gulp.task('pughtml',pughtml);
gulp.task('cssSass',cssSass);
gulp.task('build', gulp.series(clean,
						gulp.parallel(styles,scripts)
						));
gulp.task('dev', gulp.series('build','watch'));
gulp.task('sassprefixclean',sassprefixclean);
