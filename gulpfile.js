var gulp = require("gulp");

var server = require("./gulp/server");

// 定义任务
gulp.task("server:start", function() {
	server();
});