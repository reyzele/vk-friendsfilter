const gulp = require("gulp");

const $gp = require("gulp-load-plugins")();

const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const moduleImporter = require("sass-module-importer");
const del = require("del");
const cssunit = require("gulp-css-unit");

const SRC_DIR = "src";
const DIST_DIR = "public/";
const ROOT_PATH = `./public`;

gulp.task("styles", () => {
  return (
    gulp
      .src(`${SRC_DIR}/styles/main.scss`)
      .pipe($gp.plumber())
      .pipe($gp.sassGlob())
      .pipe($gp.sourcemaps.init())
      .pipe(
        $gp.sass({
          outputStyle: "compressed",
          importer: moduleImporter()
        })
      )
      .pipe(
        $gp.autoprefixer({
          browsers: ["last 2 versions"],
          cascade: false
        })
      )
      .pipe($gp.sourcemaps.write())
      /* .pipe(cssunit({
      type: 'px-to-rem',
      rootSize: 16
    })) */
      .pipe($gp.rename({ suffix: ".min" }))
      .pipe(gulp.dest(`${DIST_DIR}/styles/`))
      .pipe(reload({ stream: true }))
  );
});

gulp.task("templates", () => {
  return gulp
    .src(`${SRC_DIR}/templates/pages/*.pug`)
    .pipe($gp.pug({ pretty: true }))
    .pipe(gulp.dest("./public"));
});

gulp.task("clean", () => {
  return del(ROOT_PATH);
});

gulp.task("scripts", () => {
  return gulp
    .src(`${SRC_DIR}/scripts/main.js`)
    .pipe($gp.plumber())
    .pipe($gp.webpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${DIST_DIR}/scripts`))
    .pipe(reload({ stream: true }));
});

gulp.task("images", () => {
  return (
    gulp
      .src([`${SRC_DIR}/images/**/*.*`])
      /* .pipe(imagemin({ optimizationLevel: 7 })) */
      .pipe(gulp.dest(`${DIST_DIR}/images/`))
  );
});

gulp.task("fonts", () => {
  return gulp.src(`${SRC_DIR}/fonts/**`).pipe(gulp.dest(`${DIST_DIR}/fonts/`));
});

gulp.task("watch", () => {
  gulp.watch(`${SRC_DIR}/styles/**/*.scss`, gulp.series("styles"));
  gulp.watch(`${SRC_DIR}/images/**/*.*`, gulp.series("images"));
  gulp.watch(`${SRC_DIR}/scripts/**/*.js`, gulp.series("scripts"));
  gulp.watch(`${SRC_DIR}/templates/pages/*`, gulp.series("templates"));
  gulp.watch(`${SRC_DIR}/fonts/*`, gulp.series("fonts"));
});

gulp.task("server", () => {
  browserSync.init({
    server: `${DIST_DIR}`
  });
  browserSync.watch(`${DIST_DIR}/**/*.*`, browserSync.reload);
});

// GULP:RUN
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("styles", "images", "scripts", "fonts", "templates"),
    gulp.parallel("watch", "server")
  )
);
