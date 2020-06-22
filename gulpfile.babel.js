import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';

const server = browserSync.create();
sass.compiler = require('node-sass');

const paths = {
  scripts: {
    src: 'src/*.js',
    dest: 'dist/'
  },
  style: {
    src: 'src/*.scss',
    dest: 'dist/'
  }
};

const clean = () => del(['dist']);

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('spoiler.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function style() {
  return gulp.src(paths.style.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.style.dest));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    },
    tunnel: false,
    notify: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
  });

  done();
}

const watch = () => {
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.style.src, gulp.series(style, reload));
  gulp.watch('index.html', gulp.series(reload));
}

const build = gulp.series(clean, scripts, style, serve, watch);

export default build;
