// ----------------------------------------------------------------------------------------------------------------------------- //
// Plugins
// ----------------------------------------------------------------------------------------------------------------------------- //
const gulp         = require('gulp'),
      sass         = require('gulp-sass'), //Подключаем Sass пакет
      cache        = require('gulp-cache'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      notify       = require('gulp-notify'),
      plumber      = require('gulp-plumber'),
      imageMin     = require('gulp-imagemin'),
      minifyCss    = require('gulp-csso'),
      sourceMaps   = require('gulp-sourcemaps'),
      runSequence  = require('run-sequence'),
      browserSync  = require('browser-sync'), // Подключаем Browser Sync
      autoPrefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления вендорных префиксов
      
// ----------------------------------------------------------------------------------------------------------------------------- //
// Settings
// ----------------------------------------------------------------------------------------------------------------------------- //
let src = {
    mainScss: 'src/scss/main.scss',
       fonts: 'src/fonts/**/*.*',
        sass: 'src/scss/**/*.scss',
         img: 'src/img/**/*.*',
          js: 'src/js/**/*.js'
};

let dest = {
    minCss: 'internal.min.css',
     minJs: 'internal.min.js',
     fonts: 'dist/fonts',
      html: 'dist/**/*.html',
       css: 'dist/css',
       img: 'dist/img',
        js: 'dist/js'
};

let extJs = [ // Массив сторонних библиотек JS в необходимом порядке
    'node_modules/jquery/dist/jquery.js',
    'node_modules/owl.carousel/dist/owl.carousel.js'
    // остальные файлы
]

let extCss = [ // Массив сторонних библиотек CSS в необходимом порядке
    'node_modules/normalize.css/normalize.css',
    'node_modules/owl.carousel/dist/assets/owl.carousel.css'
    // остальные файлы
]

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: SASS
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('sass', function() {

    return gulp.src(src.mainScss)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {title: 'SCSS error!', message: err.message}
            })
        }))
        .pipe(sass())
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(concat('internal.min.css'))
        .pipe(gulp.dest(dest.css))
        .pipe(minifyCss())
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: External CSS. Сборка и сжатие сторонних CSS файлов с последующим перемещением готового файла в dist/css
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('external:css', function() {

    return gulp.src(extCss) // Берем массив сторонних css файлов
        .pipe(concat('external.min.css')) // Собираем все в новом файле external.min.css
        .pipe(minifyCss()) // Сжимаем файл
        .pipe(gulp.dest(dest.css)); // Кладем готовый файл в папку dist/css
});

// Данный таск нужно запускать вручную, чтобы создать файл external.min.css и поместить его в папку dist/scc 
// и каждый раз, когда необходимо добавить стороний файл css в готовый external.min.css

// ----------------------------------------------------------------------------------------------------------------------------- //

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Internal JS
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('internal:js', function() {

    return gulp.src(src.js)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {title: 'JavaScript error!', message: err.message}
            })
        }))
        .pipe(concat(dest.minJs))
        .pipe(uglify())
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(dest.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: External JS. Сборка и сжатие сторонних JS файлов с последующим перемещением готового файла в dist/js
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('external:js', function() {

    return gulp.src(extJs) // Берем массив внешних библиотек JS
        .pipe(concat('external.min.js')) // Собираем все библиоттеки в новом файле external.min.js
        .pipe(uglify()) // Сжимаем файл
        .pipe(gulp.dest(dest.js)); // Кладем готовый файл в папку dist/js 
});

// Данный таск нужно запускать вручную, чтобы создать файл external.min.js и поместить его в папку dist/js 
// и каждый раз, когда необходимо добавить сторонюю библиотеку js в готовый файл external.min.js

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Image
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('img', function () {

    return gulp.src(src.img)
        .pipe(cache(imageMin({
            optimizationLevel: 3, 
            progressive: true, 
            interlaced: true
        })))
        .pipe(gulp.dest(dest.img));
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Fonts. Переносим файлы шрифтов в dist/fonts
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('fonts', function() {

    return gulp.src(src.fonts)
        .pipe(gulp.dest(dest.fonts));
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Build. Выполняем перенос шрифтов, картинок, сторонних CSS и JS файлов в dist
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('build', function(callback) {
    runSequence([
        'sass', 
        'internal:js', 
        'external:js', 
        'external:css', 
        'img', 
        'fonts'], callback
    );
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Watch
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.img, ['img']);
    gulp.watch(src.js, ['internal:js']);
    gulp.watch(dest.html).on('change', browserSync.reload);
});

// ----------------------------------------------------------------------------------------------------------------------------- //
// Task: Default
// ----------------------------------------------------------------------------------------------------------------------------- //
gulp.task('default', ['watch', 'sass', 'internal:js', 'img']);

// ----------------------------------------------------------------------------------------------------------------------------- //