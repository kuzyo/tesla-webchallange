var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var pngquant     = require('imagemin-pngquant');
var spritesmith  = require('gulp.spritesmith');
var critical = require('critical');


gulp.task('sass', function() {
  gulp.src('sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
  .pipe(plumber())
  .pipe(sourcemaps.write('maps')) //path relative to the gulp.dest()s
  .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/**/*.js', './*.html'], {
    server: {
      baseDir: './',
      serveStaticOptions: {
          extensions: ['html']
      }
    }
  });
});

gulp.task('scripts', function() {
  gulp.src('js/*.js')
  .pipe(uglify())
  .pipe(rename({
    dirname: "min",
    suffix: ".min",
  }))
  .pipe(gulp.dest('js'))
});

 gulp.task('sprite', function() {
    var spriteData =
        gulp.src('images/icons/*')
            .pipe(spritesmith({
                imgName: '../images/sprite.png',
                cssName: '_sprites.scss',
                cssFormat: 'scss',
                padding: 2
            }));
    spriteData.img.pipe(gulp.dest('./images/'));
    spriteData.css.pipe(gulp.dest('sass/global'));
});

gulp.task('images', function () {
  return gulp.src('images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('images'));
});

gulp.task('critical', function (cb) {
  critical.generate({
    base: './',
    src: 'index.html',
    css: ['css/main.css'],
    width: 1366,
    height: 1100,
    dest: 'css/critical-index.css',
    minify: true,
    ignore: ['font-face']
  });
});

gulp.task('default', ['sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('images/*', ['images']);
});
