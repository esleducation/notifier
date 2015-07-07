_            = require 'lodash'
gulp         = require 'gulp'
gulpWebpack  = require 'gulp-webpack'
gutil        = require 'gulp-util'
rename       = require 'gulp-rename'
sass         = require 'gulp-sass'
uglify       = require 'gulp-uglify'
autoprefixer = require 'gulp-autoprefixer'


webpackParams =
	module :
		loaders: [
			test: /\.coffee$/,
			loader: 'coffee-loader'
		]
	output:
		path: require("path").resolve("./dist"),
		filename: 'notifier.js'
		library: 'Notifier'
		libraryTarget: 'umd'

if process.env.NODE_ENV is 'debug'
	webpackParams.devtool = "#inline-source-map"


gulp.task 'sass', ->
	if process.env.NODE_ENV is 'production'
		gulp.src 'src/css/notifier.scss'
		.pipe sass(outputStyle: 'compressed').on 'error', sass.logError
		.pipe autoprefixer()
		.pipe rename 'notifier.min.css'
		.pipe gulp.dest 'dist'
	else
		gulp.src 'src/css/notifier.scss'
		.pipe sass(outputStyle: 'expanded').on 'error', sass.logError
		.pipe autoprefixer()
		.pipe gulp.dest 'dist'


gulp.task 'webpack', ->
	if process.env.NODE_ENV is 'production'
		gulp.src 'src/js/index.coffee'
		.pipe gulpWebpack webpackParams
		.pipe uglify()
		.pipe rename 'notifier.min.js'
		.pipe gulp.dest 'dist'
	else
		gulp.src 'src/js/index.coffee'
		.pipe gulpWebpack webpackParams
		.pipe gulp.dest 'dist'


gulp.task 'default', ['webpack', 'sass']


gulp.task 'watch', ['default'], ->
	# Recompile on change
	gulp.watch ["src/**/*.coffee"], ['webpack']
	gulp.watch ["src/**/*.scss"], ['sass']
