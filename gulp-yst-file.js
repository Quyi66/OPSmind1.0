var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    gulpif = require('gulp-if'),
    html2js = require('gulp-html2js'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    flatten = require('gulp-flatten'),
    replace = require('gulp-replace'),
    es = require('event-stream'),
    del = require('del'),
    zip = require('gulp-zip'),
    each = require('gulp-each'),
    runSequence = require('run-sequence'),
    fsCache = require('gulp-fs-cache'),
    fs = require('fs'),
    path = require('path'),
    connect = require('gulp-connect'),
    multipipe = require('multipipe'),
    cachebust = require('gulp-cache-bust');

var config = require('./gulp/config'),
    moduleVersions = require('./gulp/versions'),
    pkg = require('./package.json');

var dirs = {
    tmp: 'tmp',
    cache: 'tmp/jscache',
    dist: {
        webapp: 'dist/webapp',
        // modules: '../oplus-modules-pub',
        modules: 'dist/modules'
    }
};

var modules = getModules();// ['udp', 'dts', 'jat', 'uaa', 'dev', 'commons'];
//https://www.kevinleary.net/gulp-uglify-slow-builds-fix/
var jsFsCache = fsCache(dirs.cache); // save cache to .tmp/jscache

gulp.task('dist-yst-modules', function distModules() {
    return runSequence('module-html2js', ['build-userjs', 'build-css']);
});

gulp.task('dist-modules', function distModules() {
    return runSequence('module-html2js', ['build-userjs', 'build-css']);
});

gulp.task('clean', function clean() {
    return del(['dist/webapp/*', 'tmp/*', 'dist/modules/*', '!' + dirs.cache], {dot: true});
});

gulp.task('build-index', function buildIndex() {
        info('Pack js, css in index.html');
        return replaceIndex(gulp.src('src/webapp/index-yst.html'))
            .pipe(useref())
            .pipe(jsFsCache)
            .pipe(gulpif('*.js', uglifyAndVersion()))
            .pipe(jsFsCache.restore)
            .pipe(gulpif('*.css', minifyCss()))
            .pipe(gulp.dest(dirs.dist.webapp));
    }
);

gulp.task('module-html2js', function moduleHtml2Js() {
    info('Compile module html templates to js');
    var destDir = dirs.tmp,
        modulesRoot = 'src/webapp/app/modules/';
    var tasks = modules.map(function (module) {
        var options = {
            adapter: 'angular',
            base: 'src/webapp',
            name: 'oplus.' + module
        };
        return gulp.src(modulesRoot + module + '/**/*.html')
            .pipe(html2js('oplus-' + module + '-tpls.js', options));
    });
    return es.merge(tasks).pipe(gulp.dest(destDir));
});

gulp.task('build-userjs', function buildUserJs() {
    info('Pack user developed js');
    return replaceIndex(gulp.src('src/webapp/index-yst.html'))
        .pipe(replace(/<!--\s*build.*vendors\.*-->/g, ''))
        .pipe(replace(/<!--\s*build.*\.css.*-->/g, ''))
        .pipe(useref())
        .pipe(jsFsCache)
        .pipe(gulpif('*.js', uglifyAndVersion()))
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest(dirs.dist.webapp));
});

gulp.task('copy-modules', function copyModules() {
    info('Copy packed modules to dist');
    var dir = dirs.dist.modules;
    var streams = [
        gulp.src('src/webapp/content/**/oplus-*.css')
            .pipe(flatten())
            .pipe(gulp.dest(dir + '/content/css')),
        gulp.src(['bower.json'])
            .pipe(gulp.dest(dir + '/app/modules/lib')),
        gulp.src([dirs.dist.webapp + '/app/modules/**', 'src/webapp/app/modules/*/assets/**'])
            .pipe(gulp.dest(dir + '/app/modules'))
    ];
    return es.merge(streams);
});

gulp.task('cache-burst', function cacheBurst() {
    return gulp.src('dist/webapp/index-yst.html')
        .pipe(cachebust({
            // type: 'timestamp'
        })).pipe(gulp.dest('dist/webapp'));
});


gulp.task('build-css', function buildCss() {
    info('Compile less and scss to css');
    return es.merge([
        gulp.src(config.sassMain)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(sourcemaps.write())
            // .pipe(sourcemaps.write(config.cssDir))
            .pipe(flatten())
            .pipe(gulp.dest(config.cssDir)),
        gulp.src(config.lessMain)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(flatten())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.cssDir))]
    );
});


function getModules() {
    var dir = 'src/webapp/app/modules';
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


function uglifyAndVersion() {
    info('Minify js and prepend version number to header');
    return multipipe(uglify(), versioning());

    function versioning() {
        return each(function (content, file, callback) {
            // var text = '/*! $MODULE $VERSION built at ' + new Date().toISOString() + '*/\n';
            var HEADER_TEMPLATE = '/*! $MODULE $VERSION */\n';
            var filename = path.basename(file.path, '.js');
            var matches = filename.match(/oplus-(\w*)/);
            var moduleName;
            var str = HEADER_TEMPLATE;
            if (matches) {
                moduleName = matches[1];
                str = str.replace('$MODULE', 'oplus-' + moduleName);
                var ver = moduleVersions[moduleName];
                if (ver) {
                    str = str.replace('$VERSION', ver);
                }
            }
            callback(null, str + content);
        })
    }
}

//http://paulsalaets.com/posts/reusable-pipelines-in-gulp-build
function replaceIndex(inputStream) {
    return inputStream
        .pipe(replace(/<!--\s*BUILD_INSERT_JS:\s*([^\s]*?)\s*-->/g, '<script src="$1"></script>'))
        .pipe(replace(/{VERSION}/g, pkg.version))
        .pipe(replace(/{VER_(.*?)}/g, function (match, pl) {
            return config.moduleVersions[pl] || '';
        }));
}

function info(message) {
    console.log(message);
}
