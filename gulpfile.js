const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const del = require('del');
const prettyHtml = require('gulp-pretty-html');
const gulpif = require('gulp-if');



// developer options
const isSync = (process.argv.indexOf('--sync') !== -1);
const isMinHtml = (process.argv.indexOf('--mh') !== -1);
const isCleanCss = (process.argv.indexOf('--cc') !== -1);
const isSoMap = (process.argv.indexOf('--sm') !== -1);
const isGroupQuery = (process.argv.indexOf('--gq') !== -1);

// function delete all files from [dist] folder
function clear(){
	return del('./dist/*');
}


function styles(){
	return gulp.src('./app/css/style.scss')
		.pipe(gulpif(isSoMap, sourcemaps.init()))
    	.pipe(sass().on('error', sass.logError))
    	.pipe(autoprefixer({
           overrideBrowserslist: ['last 2 versions'],
            cascade: true
        }))
    	.pipe(gulpif(isGroupQuery, gcmq()))
    	.pipe(gulpif(isCleanCss, cleanCSS()))
    	.pipe(gulpif(isSoMap, sourcemaps.write()))
    	.pipe(gulp.dest('./dist/css'))
    	.pipe(gulpif(isSync, browserSync.stream()));
	}


function js(){
	return gulp.src('./app/js/**/*.js')
		.pipe(gulp.dest('./dist/js/'))
		.pipe(gulpif(isSync, browserSync.stream()));
}
function img(){
	return gulp.src('./app/img/**/*')
		.pipe(gulp.dest('./dist/img'))
}
function fonts(){
	return gulp.src('./app/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts/'))
}
function html(){
	return gulp.src('./app/*.pug')
		.pipe(pug({
   		// Your options in here.
  			}))
		.pipe(gulpif(isMinHtml,prettyHtml()))
		.pipe(gulp.dest('./dist/'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

// watcher
function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./dist/",
	        },
	         tunnel: false,
	        //  tunnel: "pekur"
	    });
	}
	

	gulp.watch('./app/css/**/*.scss', styles);
	gulp.watch('./app/img/**/*', img);
	gulp.watch('./app/*.pug', html);
	gulp.watch('./app/js/**/*.js',js)
	
}


let build = gulp.series(clear, 
	gulp.parallel(styles, img, html,fonts, js)
);

//  gulp tasks
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
