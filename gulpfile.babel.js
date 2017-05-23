import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import cache from 'gulp-cached';
import eslint from 'gulp-eslint';
import exorcist from 'exorcist';
import gulp from 'gulp';
import ifElse from 'gulp-if-else';
import sass from 'gulp-sass';
import scsslint from 'gulp-scss-lint';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import watchify from 'watchify';

watchify.args.debug = true;

const sync = browserSync.create();

const bundler = browserify('src/index.js', {
  extensions: ['.js'],
  debug: true
});

function bundle(){
  return bundler
    .bundle()
    .on('error', function (err) {
      console.error(`=====\n${err.toString()}\n====`);
      this.emit('end');
    })
    .pipe(exorcist('app/js/eleven.js.map'))
    .pipe(source('eleven.js'))
    .pipe(buffer())
    .pipe(ifElse(process.env.NODE_ENV === 'production', uglify))
    .pipe(gulp.dest('app/js'));
}

bundler.transform(babelify);

// recompile on updates
bundler.on('update', bundle);

// do all the things
gulp.task('default', ['watch']);

// lint and build bundle
gulp.task('build', ['lint'], () => bundle());

gulp.task('lint', ['lint-js', 'lint-style'], () => bundle());

// lint, bundle and start dev server
gulp.task('serve', ['build'], () => sync.init({ server: 'app' }));

// watch for changes to files
gulp.task('watch', ['serve'], () => {
  gulp.watch(['src/**/*.js'], ['build', sync.reload]);
  gulp.watch(['app/js/**.js', '!app/js/eleven.js.map', 'app/js/eleven.js'], sync.reload);
  gulp.watch(['app/scss/**/*.scss', '!app/scss/_mixins.scss', '!app/scss/_prettify.scss', '!app/scss/_reset.scss'], ['sass', 'lint-style', sync.reload]);
  gulp.watch('app/css/app.css', sync.reload);
  gulp.watch('app/index.html', sync.reload);
});

// lint js
gulp.task('lint-js', () => {
  return gulp
    .src([
      'src/**/*.js',
      'gulpfile.babel.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
});

// sass compiler
gulp.task('sass', () => {
  return gulp
    .src([
      'app/scss/**/*.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

function scsslintRunner({ rtl = false, failOnError = false } = {}) {
  const res = gulp
    .src([
      'app/scss/**/*.scss',
      '!app/scss/_mixins.scss',
      '!app/scss/_prettify.scss',
      '!app/scss/_reset.scss'
    ])
    .pipe(cache('scsslint'))
    .pipe(scsslint({
      config: '.scss-lint.yml',
      reporterOutput: 'scss-lint-report.xml'
    }));

 return failOnError ? res.pipe(scsslint.failReporter('E')) : res;
}

gulp.task('lint-style', function(done){
  if(process.env.NODE_ENV === 'production'){
    return done();
  }

 return scsslintRunner({ failOnError: false });
});
