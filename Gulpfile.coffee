_                = require 'lodash'
gulp             = require 'gulp'
gutil            = require 'gulp-util'
gulpWebpack      = require 'gulp-webpack'
uglify           = require 'gulp-uglify'
webpack          = require 'webpack'
WebpackDevServer = require 'webpack-dev-server'

webpackParams =
	entry: [
		'./src/notifier.coffee'
	],
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


gulp.task 'watch', [], (callback) ->
	new WebpackDevServer webpack(webpackParams),
		contentBase: './'
		hot: true
		watchDelay: 100
		noInfo: true
	.listen 8080, 'localhost', (err) ->
		throw new gutil.PluginError("webpack-dev-server", err) if(err)
		gutil.log '[webpack-dev-server]', "http://localhost:8080"
		callback()

