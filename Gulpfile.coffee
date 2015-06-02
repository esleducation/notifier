_                = require 'lodash'
gulp             = require 'gulp'
gutil            = require 'gulp-util'
gulpWebpack      = require 'gulp-webpack'
uglify           = require 'gulp-uglify'

webpackParams =
	module :
		loaders: [
			test: /\.coffee$/,
			loader: 'coffee-loader'
		,
			test: /\.scss$/
			loader: 'style!css!sass'
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
	# .pipe uglify()
	.pipe gulp.dest('dist/')


gulp.task 'default', ['webpack'], ->
	# Reload browser on files changes except coffee/cjsx
	gulp.watch ["src/*"], ['webpack']
