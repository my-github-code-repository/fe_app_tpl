var gulp = require("gulp");
var through2 = require("through2");

var Hapi = require("hapi");
var Inert = require("inert");

var gulpSass = require("gulp-sass");
var gulp6to5 = require("gulp-6to5");

module.exports = function() {
	// 创建服务器
	var server = new Hapi.Server();
	// 注册服务器插件
	server.register(Inert);

	// 配置虚拟主机
	server.connection({
		host: "localhost",
		port: 8000
	});

	// 配置静态路由
	server.route({
		method: "GET",
		path: "/app/{path*}",
		handler: {
			directory: {
				path: "app/",
				listing: true
			}
		}
	});
	server.route({
		method: "GET",
		path: "/bower_components/{path*}",
		handler: {
			directory: {
				path: "bower_components/",
				listing: true
			}
		}
	});

	// 配置路由
	server.route({
		method: "GET",
		path: "/app/css/{fileName}.css",
		handler: function(request, reply) {
			gulp.src("app/css/"+request.params.fileName+".scss")
				.pipe(gulpSass())
				.pipe(through2.obj(function(file) {
					reply(file.contents.toString())
						.type("text/css");
				}));
		}
	});
	server.route({
		method: "GET",
		path: "/app/js/{fileName}.js",
		handler: function(request, reply) {
			gulp.src("app/js/"+request.params.fileName+".js")
				.pipe(gulp6to5())
				.pipe(through2.obj(function(file) {
					reply(file.contents.toString())
						.type("text/javascript");
				}));
		}
	});

	// 启动服务器
	server.start(function() {
		console.log("server is running...");
	});
};