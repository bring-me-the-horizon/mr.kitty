let gulp = require('gulp'), // Плагин подключения gulp
    sass = require('gulp-sass'), // Плагин подключения sass конвертации в css
    rename = require('gulp-rename'), // Поагин переименования
    browserSync = require('browser-sync'), // Задаем переменные для плпгинов
    autoprefixer = require('gulp-autoprefixer'),  // Задаем для более старых версий браузера
    concat = require('gulp-concat'), // Плагин для обьединения плагинов
    uglify = require('gulp-uglify'), // Плагин для сжатия файлов JS
    cssmin = require('gulp-cssmin');

  gulp.task('sass', function(){  // Связываем переменные через канал .pipe(труба)
    return gulp.src('app/scss/style.scss')  
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(rename({suffix : '.min'}))
            .pipe(autoprefixer({
             overrideBrowserslist: ['last 8 versions'] // Задаем для более старых версий браузера
            }))
            .pipe(gulp.dest('app/css'))
            .pipe(browserSync.reload({stream:true}))
  });

  gulp.task('style', function(){
    return gulp.src([
      'node_modules/normalize.css/normalize.css', 
      'node_modules/slick-carousel/slick/slick.css',  // То что конкатинируем(сжимаем в один файл) файл из библиотеки
      'node_modules/magnific-popup/dist/magnific-popup.css' // файл из библиотеки
    ])
    .pipe(concat('libs.min.css')) // Обьединяем в один файл
    .pipe(cssmin())
    .pipe(gulp.dest('app/css')) // Сжимаем файлы java script (путь для файла)
  });

  gulp.task('script', function(){
    return gulp.src([
      'node_modules/slick-carousel/slick/slick.js',  // То что конкатинируем(сжимаем в один файл)
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
    ])
    .pipe(concat('libs.min.js')) // Обьединяем в один файл
    .pipe(uglify()) // Сжимаем файлы java script
    .pipe(gulp.dest('app/js')) // Сжимаем файлы java script
  });

  gulp.task('html', function(){  // Синхронизированное HTML
    return gulp.src('app/*.html')
      .pipe(browserSync.reload({stream:true}))
  });

  gulp.task('js', function(){ // Синхронизированное JS
    return gulp.src('app/js/*.js')
      .pipe(browserSync.reload({stream:true}))
  });


  gulp.task('browser-sync', function() { // Синхронизированное тестирование браузера аналог OpenServer
    browserSync.init({
        server: {
            baseDir: "app/" // Путь откуда забираю данные
        },
        online: true,
        tunnel: true,  // Задаю отдельный тунель для мобильноый версии (вход через мобильник)
        logLevel: "debug"
    });
});

  gulp.task('watch', function(){
    gulp.watch('app/scss/style.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('html'));  // Встроенная функция для просмотра и запуска через gulp всех неободимых файлов
    gulp.watch('app/js/*.js', gulp.parallel('js'));
  });


  gulp.task('default', gulp.parallel('style','script','sass', 'watch', 'browser-sync')) // Команда для запуска gulp всех файлов
  