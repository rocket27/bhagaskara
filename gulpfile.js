const gulp = require('gulp'),
      sass = require('gulp-sass'), //Подключаем Sass пакет
      browserSync = require('browser-sync'), // Подключаем Browser Sync
      autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления вендорных префиксов
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify');

let jsModules = [ // Массив js файлов в необходимом порядке
    'app/js/example1.js',
    'app/js/example2.js'
    // остальные файлы
]

gulp.task('sass', function() { // Создаем таск "sass"
    return gulp.src('app/scss/main.scss') // Берем источник
        .pipe(plumber({
            errorHandler: notify.onError(function(error) {
                return {title: 'Style', message: error.message}
            })
        }))
        .pipe(sass()) // Преобразуем SCSS в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: true // Включаем уведомления
    });
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']); // Наблюдение за sass файлами
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);