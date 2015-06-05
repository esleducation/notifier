_                = require 'lodash'
gulp             = require 'gulp'
gutil            = require 'gulp-util'
rename           = require 'gulp-rename'
gulpWebpack      = require 'gulp-webpack'
uglify           = require 'gulp-uglify'

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
	devtool: "#inline-source-map"


gulp.task 'webpack', ->
	gulp.src 'src/notifier.coffee'
	.pipe gulpWebpack webpackParams
	.pipe gulp.dest('dist/')

gulp.task 'production', ->
	gulp.src 'src/notifier.coffee'
	.pipe gulpWebpack _.assign webpackParams,
		devtool: null
	.pipe uglify()
	.pipe rename('notifier.min.js')
	.pipe gulp.dest('dist/')


gulp.task 'default', ['webpack'], ->
	# Reload browser on files changes except coffee/cjsx
	gulp.watch ["src/*"], ['webpack']
