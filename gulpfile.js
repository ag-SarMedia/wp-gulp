import gulp from 'gulp'
import browserSync from 'browser-sync'
import sassPre from 'sass'
import gulpSass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import imagemin from 'gulp-imagemin'

import { themeName, siteName } from './config-wp.js'

const sass = gulpSass(sassPre)

const dir = {
	theme: `../${themeName}`,
}

gulp.task('server', function () {
	browserSync({
		proxy: `http://${siteName}/`,
		port: 1143,
		open: true,
	})

	gulp.watch(`${dir.theme}/*.php`).on('change', browserSync.reload)
})

gulp.task('php', () => {
	return gulp
		.src('src/**/*.php')
		.pipe(gulp.dest(`${dir.theme}/`))
		.pipe(browserSync.stream())
})

gulp.task('styles', () => {
	return gulp
		.src('src/scss/**/*.+(scss|sass)')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest(dir.theme))
		.pipe(browserSync.stream())
})

gulp.task('scripts', () => {
	gulp
		.src('src/js/**/*.js')
		.pipe(gulp.dest(`${dir.theme}/assets/js`))
		.pipe(browserSync.stream())
})

gulp.task('fonts', () => {
	return gulp
		.src('src/fonts/**/*')
		.pipe(gulp.dest(`${dir.theme}/assets/fonts`))
		.pipe(browserSync.stream())
})

gulp.task('svg', () => {
	return gulp
		.src('src/icons/**/*')
		.pipe(gulp.dest(`${dir.theme}/assets/svg`))
		.pipe(browserSync.stream())
})

gulp.task('images', () => {
	return gulp
		.src('src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest(`${dir.theme}/assets/img`))
		.pipe(browserSync.stream())
})

gulp.task('watch', () => {
	gulp.watch('src/**/*.php').on('all', gulp.parallel('php'))
	gulp.watch('src/scss/**/*.+(scss|sass|css)', gulp.parallel('styles'))
	gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'))
	gulp.watch('src/fonts/**/*').on('all', gulp.parallel('fonts'))
	gulp.watch('src/svg/**/*').on('all', gulp.parallel('svg'))
	gulp.watch('src/img/**/*').on('all', gulp.parallel('images'))
})



gulp.task(
	'default',
	gulp.parallel(
		'php',
		'watch',
		'server',
		'styles',
		'scripts',
		'fonts',
		'svg',
		'images'
	)
)
