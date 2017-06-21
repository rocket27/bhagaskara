const gulp = require('gulp'),
      sass = require('gulp-sass'), //Подключаем Sass пакет
      browserSync = require('browser-sync'), // Подключаем Browser Sync
      autoPrefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления вендорных префиксов
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      concat = require('gulp-concat'), // Подключаем пакет для конкатенации файлов
      minifyCss = require('gulp-csso'), // Пакет для сжатия CSS файлов
      uglify = require('gulp-uglify'); // Пакет для сжатия JS файлов

let internalJs = [ // Массив JS файлов в необходимом порядке
    'app/js/internal/owlCarousel.js'
    // остальные файлы
]

let externalJs = [ // Массив сторонних библиотек JS в необходимом порядке
    'node_modules/jquery/dist/jquery.js',
    'node_modules/owl.carousel/dist/owl.carousel.js'
    // остальные файлы
]

let externalCss = [ // Массив сторонних библиотек CSS в необходимом порядке
    'node_modules/normalize.css/normalize.css',
    'node_modules/owl.carousel/dist/assets/owl.carousel.css'
    // остальные файлы
]

gulp.task('sass', function() { // Создаем таск "sass"
    return gulp.src('app/scss/main.scss') // Берем источник
        .pipe(plumber({
            errorHandler: notify.onError(function(error) {
                return {title: 'Style', message: error.message}
            })
        }))
        .pipe(sass()) // Преобразуем scss в css посредством gulp-sass
        .pipe(autoPrefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем css на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: true // Включаем уведомления
    });
});

// Сборка и сжатие JS файлов с последующим перемещением готового файла в app/js
gulp.task('external:js', function() {
    return gulp.src(externalJs) // Берем массив внешних библиотек JS
        .pipe(concat('external.min.js')) // Собираем все библиоттеки в новом файле external.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Кладем готовый файл в папку app/js 
});

gulp.task('internal:js', function() {
    return gulp.src(internalJs) // Берем массив файлов JS
        .pipe(concat('internal.min.js')) // Собираем все библиоттеки в новом файле internal.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Кладем готовый файл в папку app/js
});

// Сборка и сжатие сторонних CSS файлов с последующим перемещением готового файла в app/css
gulp.task('external:css', function() {
    return gulp.src(externalCss) // Берем массив сторонних css файлов
        .pipe(concat('external.min.css')) // Собираем все в новом файле external.min.css
        .pipe(minifyCss()) // Сжимаем полученный файл
        .pipe(gulp.dest('app/css')); // Кладем готовый файл в папку app/css
});

gulp.task('watch', ['browser-sync', 'sass', 'external:css', 'external:js', 'internal:js'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']); // Наблюдение за scss файлами в папке scss
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', ['internal:js', browserSync.reload]); // Наблюдение за JS файлами в папке js
    gulp.watch("app/img/**/*.*", browserSync.reload); // Наблюдение за всеми файлами в папке img
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);