import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import cleanCSS  from 'gulp-clean-css';
import rename  from 'gulp-rename';

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

function scriptsDev() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('spoiler.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(concat('spoiler.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function styleDev() {
  return gulp.src(paths.style.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.style.dest));
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
const dev = gulp.series(scriptsDev, styleDev);

export {build, dev};
