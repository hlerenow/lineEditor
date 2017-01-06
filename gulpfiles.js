var gulp=require("gulp");
var browserSync=require("browser-sync");
var rename=require("gulp-rename");
var uglify=require("gulp-uglify");
var clearCSS=require("gulp-clean-css");


gulp.task("browserSync",function(){
	var files=[
		"**/*.html",
		"**/*.css",
		"**/*.js"
	];

	browserSync.init({
		files:files,
		server:{
			baseDir:"./"
		}
	});
});

gulp.task("compress_js",function(){
	return gulp.src("*.js")
	.pipe(uglify())
	.pipe(rename({suffix:".min"}))
	.pipe(gulp.dest("dist/"))
});

gulp.task("compres_css",function(){
	return gulp.src("*.css")
	.pipe(clearCSS())
	.pipe(rename({suffix:".min"}))
	.pipe(gulp.dest("dist/"))	
})

gulp.task("default",["browserSync"]);