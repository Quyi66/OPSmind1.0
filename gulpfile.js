/*!
 * Usage: gulp <task-name> [--app <appname>]
 *
 */
const gulp = require('gulp');
const { exec, execSync } = require('child_process');
// const exec = require('gulp-exec');
// const post = require("gulp-http-post");
// const openCC = require('opencc')
// const windowsBuildTools = require('windows-build-tools')
const sass = require('gulp-sass');
sass.compiler = require('sass');
// const sass = require('gulp-dart-sass');
// const less = require('gulp-less');
const gulpif = require('gulp-if');
const html2js = require('gulp-html2js');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify-es').default;
// const minifyCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const flatten = require('gulp-flatten');
const replace = require('gulp-replace');
const es = require('event-stream');
const del = require('del');
const zip = require('gulp-zip');
const each = require('gulp-each');
const runSequence = require('run-sequence');
const fsCache = require('gulp-fs-cache');
const fs = require('fs');
const path = require('path');
const connect = require('gulp-connect');
const multipipe = require('multipipe');
const cachebust = require('gulp-cache-bust');
const axios = require('axios');
const yaml = require('js-yaml');
const sort = require('gulp-sort');
const minimist = require('minimist');
const gutil = require('gulp-util');
const DateTime = require('luxon').DateTime;
const httpProxy = require('http-proxy');
const proxyConfig = require('./gulp/proxy-config.js');

const config = require('./gulp/config');
const pkg = require('./package.json');
const timestamp = DateTime.now().toFormat('yyMMddHHmm');
const versionNumber = DateTime.now().toFormat('yyyy.MM.dd');

const modulesRoot = 'src/webapp/app/modules/';

const profiles = {
    zhdyh: {
        index: 'zhdyh-index.html',
        desc: '招乎订阅号'
    },
    cmbyst: {
        index: 'cmbyst-index.html',
        desc: 'CMB分行一事通'
    }
};

// A HTML file defines minimum js dependency for displaying udp pages from external system via frame/iframe
const udpViewerHtml = './src/webapp/udp-viewer.html';

// Command line arguments
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/pass-arguments-from-cli.md
// gulp <task-name> --app <build-profile>
const cmdArgs = minimist(process.argv.slice(2));
const theApp = cmdArgs.app;

let theProfile = {index: 'index.html'};
let distType = 'webapp';

if (theApp) {
    // Usage: gulp dist --app <app_name>
    console.log('====== Build App for `' + theApp + '` ======');
    if (profiles[theApp]) {
        theProfile = profiles[theApp];
    } else {
        console.log('ERROR: app profile `' + theApp + '` not supported.');
        console.log('Supported profiles: ' + Object.keys(profiles));
        process.exit(1);
    }
}

const dirs = {
    tmp: 'tmp',
    cache: 'tmp/jscache',
    src: {
        webapp: 'src/webapp',
        i18n: "src/webapp/i18n",
        tools: "tools/"
    },
    tools: {
        openccExec: ".\\tools\\i18n\\opencc\\bin\\opencc",
        openccFile: "tools/i18n/opencc/share/opencc/oplus-tw.json"
    },
    dist: {
        webapp: 'dist/' + (theApp || 'webapp'),
        // modules: '../oplus-modules-pub',
        modules: 'dist/modules'
    }
};
const appSpec = {indexHtml: 'src/webapp/' + theProfile.index};
const modules = getModules();
const srcVersionFile = './src/webapp/app/modules/VERSION.json';
const theVersion = require(srcVersionFile);

//https://www.kevinleary.net/gulp-uglify-slow-builds-fix/
const jsFsCache = fsCache(dirs.cache); // save cache to .tmp/jscache

function uglifyAndVersion() {
    info('Minify js and prepend version number to header');
    return multipipe(
        uglify({
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug']
            },
            mangle: {
                reserved: ['angular', 'jQuery', '$']
            },
            output: {
                comments: false
            }
        }).on('error', function(err) {
            gutil.log(gutil.colors.red('[Uglify Error]'), err.toString());
            this.emit('end');
        }), 
        versioning()
    ).on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

    function versioning() {
        return each(function (content, file, callback) {
            const HEADER_TEMPLATE = '/*! $MODULE $VERSION */\n';
            const filename = path.basename(file.path, '.js');
            const matches = filename.match(/oplus-(\w*)/);
            console.log('......versioning file: ' + filename);

            let moduleName;
            let str = HEADER_TEMPLATE;
            if (matches) {
                moduleName = matches[1];
                str = str.replace('$MODULE', 'oplus-' + moduleName);
                const ver = theVersion.versions[moduleName];
                theVersion.builds[moduleName] = versionNumber;
                if (ver) {
                    str = str.replace('$VERSION', ver);
                }
            }
            callback(null, str + content);
        })
    }
}

function getModules() {
    const dir = modulesRoot;
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('build-flow', function () {
    console.warn('[oplus-flow] Building flow module...')
    console.warn('[oplus-flow] This may take some time...')
    execSync('cd src/webapp/app/modules/flow && npm run build');

    return es.merge([
        gulp.src('src/webapp/app/modules/flow/dist/oplus-flow.js').pipe(gulp.dest('dist/webapp/app/modules')),
        gulp.src('src/webapp/app/modules/flow/dist/oplus-flow.css').pipe(gulp.dest('src/webapp/content/css')),
    ]);

    // await runShellCommand('cd src/webapp/app/modules/flow && npm run build');
})

gulp.task('combine-i18n', function combineI18n(cb) {
    console.log('Combine i18n JSON files to a single JavaScript file');
    const i18nDir = config.i18nDir;
    var allLangs = {};
    fs.readdirSync(i18nDir).map(file => {
        var filePath = path.join(i18nDir, file);
        if (fs.statSync(filePath).isDirectory()) {
            var langKey = path.basename(file);
            allLangs[langKey] = {};
            fs.readdirSync(filePath).filter(file => {
                var str = fs.readFileSync(path.join(filePath, file));
                // console.log("combine file is " + path.join(filePath, file))
                Object.assign(allLangs[langKey], JSON.parse(str));
            });
        }
    });
    var content =
        '// This file is generated by gulp.\n' +
        '// DO NOT EDIT THIS FILE !\n' +
        '// Edit i18n JSON file instead.\n' +
        '\n' +
        ';(function() {\n' +
        '  window["@oplus/langs"]=' + JSON.stringify(allLangs, null, 2) + ';\n' +
        '})();';
    fs.writeFile(path.join(modulesRoot, 'oplus-lang.js'), content, cb);
});

gulp.task('update-version', function updateVersion(cb) {
    var json = JSON.stringify(theVersion, null, "  ");
    fs.writeFile(srcVersionFile, json, cb);
});

gulp.task('clean', function clean() {
    return del(['dist/webapp/*', /*'tmp/!*', */'dist/modules/*', '!' + dirs.cache], {dot: true});
});

gulp.task('serve', function serve() {
    // 创建代理服务器
    const proxy = httpProxy.createProxyServer({});
    
    // 处理代理错误
    proxy.on('error', function(err, req, res) {
        console.error('🚨 Proxy error:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
    });
    
    connect.server({
        root: dirs.dist.webapp,
        port: 3001,
        livereload: true,
        host: '0.0.0.0',
        index: 'index.html',
        middleware: function(connect, opt) {
            return [
                // 现代化代理中间件
                function(req, res, next) {
                    // 检查是否匹配代理规则
                    for (const [path, config] of Object.entries(proxyConfig)) {
                        if (req.url.startsWith(path)) {
                            // 标准化配置 - 支持简单字符串和对象两种形式
                            const proxyOpts = typeof config === 'string' 
                                ? { target: config, changeOrigin: true } 
                                : { changeOrigin: true, ...config };
                            
                            console.log(`🔄 ${req.method} ${req.url} -> ${proxyOpts.target}`);
                            
                            // 路径重写
                            let targetUrl = req.url;
                            if (proxyOpts.pathRewrite) {
                                for (const [from, to] of Object.entries(proxyOpts.pathRewrite)) {
                                    targetUrl = targetUrl.replace(new RegExp(from), to);
                                }
                            }
                            
                            // 修改请求URL
                            req.url = targetUrl;
                            
                            // 代理到目标服务器
                            proxy.web(req, res, {
                                target: proxyOpts.target,
                                changeOrigin: proxyOpts.changeOrigin,
                                secure: false,
                                ws: proxyOpts.ws || false
                            });
                            
                            return; // 不调用next()，因为请求已被代理
                        }
                    }
                    
                    // 如果没有匹配的代理规则，继续下一个中间件
                    next();
                },
                
                // SPA路由处理中间件
                function(req, res, next) {
                    // 对于所有非静态资源的请求，都返回 index.html
                    if (req.url.indexOf('.') === -1 || req.url.endsWith('.html')) {
                        req.url = '/index.html';
                    }
                    return next();
                }
            ];
        }
    });
    
    console.log(`🚀 Development server started on http://localhost:3001`);
    console.log(`📁 Serving files from: ${dirs.dist.webapp}`);
    console.log(`🔄 Proxy configured:`);
    for (const [path, config] of Object.entries(proxyConfig)) {
        const target = typeof config === 'string' ? config : config.target;
        console.log(`   ${path} -> ${target}`);
    }
});

gulp.task('build-icons', function buildIcons(cb) {
    const url = 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.yml';
    // const url = 'http://localhost:8080/lib/icons.yml';
    axios.get(url).then(function (response) {
        const doc = yaml.safeLoad(response.data);
        const icons = [];
        Object.keys(doc).forEach(function (name) {
            const o = doc[name];
            if (o.styles.indexOf('solid') > -1 || o.styles.indexOf('brands') > -1)
                icons.push({
                    name: name,
                    unicode: o.unicode,
                    searchTerms: o.search.terms,
                    isBrand: o.styles.indexOf('brands') > -1
                });
        });
        fs.writeFile('src/webapp/app/modules/commons/icon/fa-icons.js', 'window["@oplus/icons"]=' + JSON.stringify(icons) + ';', cb);
    });
});

gulp.task('build-css', function buildCss() {
    info('Compile scss to css');
    return es.merge([
        gulp.src(config.sassMain)
            // .pipe(sourcemaps.init())
            .pipe(sass())
            // .pipe(sourcemaps.write())
            // .pipe(sourcemaps.write(config.cssDir+'/maps'))
            .pipe(flatten())
            .pipe(gulp.dest(config.cssDir))/*,
        gulp.src(config.lessMain)
            // .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(flatten())
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.cssDir))*/]
    );
});

//http://paulsalaets.com/posts/reusable-pipelines-in-gulp-build
function replaceIndex(inputStream) {
    return inputStream
        .pipe(replace(/<!--\s*BUILD_INSERT_JS:\s*([^\s]*?)\s*-->/g, '<script src="$1"></script>'))
        .pipe(replace(/{VERSION}/g, pkg.version))
        .pipe(replace(/{VER_(.*?)}/g, function (match, pl) {
            return config.moduleVersions[pl] || '';
        }));
}

// gulp.task('build-index', function buildIndex() {
//         info('Pack js, css in ' + appSpec.indexHtml);
//         return replaceIndex(gulp.src(appSpec.indexHtml))
//             .pipe(useref())
//             .pipe(jsFsCache)
//             .pipe(gulpif('*.js', uglifyAndVersion()))
//             .pipe(jsFsCache.restore)
//             .pipe(gulpif('*.css', minifyCss()))
//             .pipe(gulp.dest(dirs.dist.webapp));
//     }
// );

gulp.task('copy-lazyload-files', function copyVendorFiles() {
    info('Copy lazy load vendor files');
    var unpackedFiles = ['src/webapp/lib/tinymce/**']
    return gulp.src(unpackedFiles).pipe(gulp.dest('dist/webapp/lib/tinymce'));
});

gulp.task('copy-npm-assets', function copyNpmAssets() {
    info('Copy npm assets to webapp directory');
    
    const webappNodeModulesPath = 'src/webapp/node_modules';
    const rootNodeModulesPath = path.resolve('node_modules');
    const webappNodeModulesFullPath = path.resolve(webappNodeModulesPath);
    
    try {
        // 检查目标是否已存在
        if (fs.existsSync(webappNodeModulesFullPath)) {
            const stats = fs.lstatSync(webappNodeModulesFullPath);
            if (stats.isSymbolicLink()) {
                info('Symbolic link already exists, skipping...');
                return Promise.resolve();
            } else {
                info('Removing existing directory...');
                fs.rmSync(webappNodeModulesFullPath, { recursive: true, force: true });
            }
        }
        
        // 创建符号链接
        const relativePath = path.relative(path.dirname(webappNodeModulesFullPath), rootNodeModulesPath);
        fs.symlinkSync(relativePath, webappNodeModulesFullPath, 'junction');
        info('Created symbolic link: ' + webappNodeModulesPath + ' -> ' + relativePath);
        
    } catch (error) {
        console.warn('Failed to create symbolic link, copying essential files instead:', error.message);
        
        // 如果符号链接失败，复制关键文件
        const streams = [
            // 复制Angular
            gulp.src('node_modules/angular/angular.js')
                .pipe(gulp.dest('src/webapp/lib/angular')),
            
            // 复制lodash
            gulp.src('node_modules/lodash/lodash.min.js')
                .pipe(gulp.dest('src/webapp/lib/lodash')),
            
            // 复制其他关键依赖到对应位置
            gulp.src('node_modules/jquery/dist/jquery.min.js')
                .pipe(gulp.dest('src/webapp/node_modules/jquery/dist')),
            
            gulp.src('node_modules/angular/**/*')
                .pipe(gulp.dest('src/webapp/node_modules/angular')),
                
            gulp.src('node_modules/lodash/**/*')
                .pipe(gulp.dest('src/webapp/node_modules/lodash'))
        ];
        
        return es.merge(streams);
    }
    
    return Promise.resolve();
});

gulp.task('cache-burst', function cacheBurst() {
    return gulp.src('dist/webapp/index.html')
        .pipe(cachebust({})).pipe(gulp.dest('dist/webapp'));
});

gulp.task('build-vendors', function buildVendors() {
    return gulp.src('src/webapp/index.html')
        .pipe(useref({allowEmpty: true}))
        .pipe(gulpif('**/oplus-vendors.js', multipipe(
            sourcemaps.init(),
            uglify().on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            }),
            sourcemaps.write('.')
        )))
        .pipe(gulp.dest(dirs.dist.webapp));
});

gulp.task('build-js', ['build-vendors'], function buildUserJs() {
    info('Pack js from ' + appSpec.indexHtml + ' and udp viewer js from ' + udpViewerHtml);
    // return replaceIndex(gulp.src([appSpec.indexHtml, viewerHtml]))
    return replaceIndex(gulp.src([appSpec.indexHtml/*, udpViewerHtml*/]))
        // .pipe(babel())
        // .pipe(replace(/<!--\s*build.*vendors\.*-->/g, ''))
        // .pipe(replace(/<!--\s*build.*\.css.*-->/g, ''))
        .pipe(useref({searchPath: ['src/webapp', 'node_modules'], allowEmpty: true}))
        .pipe(jsFsCache)
        .pipe(gulpif('*.js', uglifyAndVersion()))
        .pipe(jsFsCache.restore)
        .pipe(gulp.dest(dirs.dist.webapp));
    // .pipe(gulp.dest(dirs.dist.modules));
});

gulp.task('copy-files', function copyModules() {
    // let destDir = distType === 'modules' ? dirs.dist.modules : (dirs.dist.webapp);
    let destDir = dirs.dist.webapp;
    info('Copy docs, images, fonts and module assets to ' + destDir);
    const streams = [
        //---- help docs
        gulp.src(config.app + '/help/**').pipe(gulp.dest(destDir + '/help')),
        //---- i18n JS
        // gulp.src(config.i18nDir + '/*').pipe(gulp.dest(destDir + '/i18n')),
        // gulp.src(dirs.src.webapp + '/content/**/oplus-*.css').pipe(flatten()).pipe(gulp.dest(destDir + '/content/css')),
        //---- bower file
        gulp.src(['bower.json']).pipe(gulp.dest(destDir + '/app/modules/lib')),
        //---- compressed module JS and assets
        gulp.src([dirs.dist.webapp + '/app/modules/**',
            dirs.src.webapp + '/app/modules/VERSION.json',
            dirs.src.webapp + '/app/modules/*/assets/**']).pipe(gulp.dest(destDir + '/app/modules')),
        //---- library
        // gulp.src([dirs.dist.webapp + '/lib/oplus*']).pipe(gulp.dest(destDir + '/lib')),
        //---- fonts and images
        gulp.src([dirs.src.webapp + '/content/*fonts/**']).pipe(gulp.dest(destDir + '/content')),
        gulp.src([dirs.src.webapp + '/content/images/**', '!' + dirs.src.webapp + '/content/images/**/test/**']).pipe(gulp.dest(destDir + '/content/images')),
        gulp.src([dirs.src.webapp + '/content/medialib/**', '!' + dirs.src.webapp + '/content/medialib/**/test/**']).pipe(gulp.dest(destDir + '/content/medialib')),
        //---- config file
        gulp.src('src/webapp/config.js').pipe(gulp.dest(dirs.dist.webapp))
    ];
    return es.merge(streams);
});

// gulp.task('dist', function distWebapp() {
//     distType = 'webapp';
//     runSequence('combine-i18n', 'module-html2js', ['build-js', 'build-css'], 'update-version', 'copy-files', 'build-index');
// });

gulp.task('dist-modules', function distModules() {
    distType = 'modules';
    runSequence('clean', 'combine-i18n', 'module-html2js', ['build-js', 'build-css', 'copy-lazyload-files'], 'update-version', 'copy-files');
});

gulp.task('update-pw', function distModules() {
    const srcDir = dirs.dist.webapp;
    const tgtDir = '../oplus-portal-web/src/main/webapp';
    info('Update dist modules to portal-web');
    return gulp.src([srcDir + '/**', "!" + srcDir + '/i18n/**'])
        .pipe(gulp.dest(tgtDir));
});

// Deprecated Unstable website prevents translation
// gulp.task('translate_web', function translate() {
//     const i18n = dirs.src.i18n;
//     const cn_dir = i18n + "/zh-cn";
//     const tw_dir = i18n + "/zh-tw";
//     const folders = getFolders(cn_dir);
//     const all_json = {}
//     folders.map(function (file) {
//         all_json[file] = fs.readFileSync(cn_dir + "/" + file, {encoding: 'utf-8'});
//     })
//     const options = {
//         encoding: "utf-8",
//         callback: function (err, body, response) {
//             if (err) {
//                 console.error(err);
//             } else {
//                 const result = JSON.parse(body)
//                 if (result['code'] === 200) {
//                     checkDirExists(tw_dir)
//                     const parse_html = JSON.parse(result['data']['html'])
//                     folders.map(function (f) {
//                         fs.writeFileSync(tw_dir + "/" + f, parse_html[f], {encoding: 'utf-8'})
//                     })
//                 }
//             }
//         }
//     };
//     options["code"] = JSON.stringify(all_json);
//     return gulp.src("src/**/*.js")
//         .pipe(post("https://www.gjk.cn/tool/ajax/jianfanti/zhtwp", options))
//         .pipe(gulp.dest("dist"));
// });

// Deprecated install opencc need c++ environment
// gulp.task('translate', function translate() {
//     console.log("start translate language")
//     const converter = new openCC('s2twp.json')
//     const i18n = dirs.src.i18n;
//     const cn_dir = i18n + "/zh-cn";
//     const tw_dir = i18n + "/zh-tw";
//     const folders = getFolders(cn_dir);
//     const all_json = {}
//     checkDirExists(tw_dir)
//     folders.map(function (file) {
//         all_json[file] = fs.readFileSync(cn_dir + "/" + file, {encoding: 'utf-8'});
//     })
//     converter.convertPromise(JSON.stringify(all_json)).then(converted => {
//         const result = JSON.parse(converted)
//         folders.map(function (f) {
//             fs.writeFileSync(tw_dir + "/" + f, result[f], {encoding: 'utf-8'})
//         })
//     });
//     console.log("end translate language")
// });

gulp.task('translate', function translate_build() {
    console.log("start translate language")
    const i18n = dirs.src.i18n;
    const openccExec = dirs.tools.openccExec;
    const openccFile = dirs.tools.openccFile;
    const cn_dir = i18n + "/zh-cn";
    const tw_dir = i18n + "/zh-tw";
    const folders = getFolders(cn_dir);
    checkDirExists(tw_dir)
    folders.map(function (file) {
        exec(openccExec + ' -i ' + cn_dir + "/" + file + " -o " + tw_dir + "/" + file + " -c " + openccFile)
    })
    console.log("end translate language")
});

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isFile();
        });
}

function checkDirExists(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

gulp.task('module-html2js', function moduleHtml2Js() {
    info('Compile module HTML templates to js');
    const destDir = dirs.tmp;
    const tasks = modules.map(function (module) {
        const options = {
            adapter: 'angular',
            base: 'src/webapp',
            name: 'oplus.' + module
        };
        var jsFilename = 'oplus-' + module + '-tpls.js';
        console.log('......module [' + module + ']: ' + modulesRoot + module + '/**/*.html' + ' ==> ' + jsFilename);
        return gulp.src([modulesRoot + module + '/**/*.html', '!' + modulesRoot + module + '/node_modules/**/*.html'])
            //LEO@20201122: Sort files to ensure each build of same files will generate same result
            .pipe(sort())
            .pipe(html2js(jsFilename, options));
    });
    return es.merge(tasks).pipe(gulp.dest(destDir));
});

// gulp.task('copy-assets', function copyAssets() {
//     info('Copy assets of docs, images, fonts, json, html and config.js as is');
//     const bowerDir = 'src/webapp/bower_components';
//     const streams = [
//         // General images and fonts
//         gulp.src(['src/webapp/content/fonts/**', 'src/webapp/content/images/**'], {base: 'src/webapp/content/'})
//             .pipe(gulp.dest(dirs.dist.webapp + '/content/')),
//         // gulp.src([bowerDir + '/font-awesome/fonts/**', bowerDir + '/summernote/dist/font/**']).pipe(gulp.dest(dirs.dist.webapp + '/content/fonts')),
//         gulp.src([bowerDir + '/fontawesome-5/webfonts/**']).pipe(gulp.dest(dirs.dist.webapp + '/content/webfonts')),
//         gulp.src('src/webapp/content/css/oplus-udp-printable.css').pipe(gulp.dest(dirs.dist.webapp + '/content/css/')),
//         // Plugin images
//         // gulp.src(bowerDir + '/chosen/*.{png,jpg,gif,ico}').pipe(gulp.dest(dirs.dist.webapp + '/content/css/')),
//         // gulp.src(['src/webapp/bower_components/flipcountdown/img/**']).pipe(gulp.dest(dirs.dist.webapp + '/content/css/img/')),
//         // App config JS
//         gulp.src('src/webapp/config.js').pipe(gulp.dest(dirs.dist.webapp)),
//         // JSON map data
//         gulp.src(['src/webapp/app/modules/udp/assets/**']).pipe(gulp.dest(dirs.dist.webapp + '/app/modules/udp/assets/')),
//         // Excel mock data for API
//         gulp.src('src/webapp/api-mock/**').pipe(gulp.dest(dirs.dist.webapp + '/api-mock')),
//         // Layout HTMLs
//         gulp.src(['!src/webapp/app/modules/**', '!' + appSpec.indexHtml, 'src/webapp/app/**/*.html']).pipe(gulp.dest(dirs.dist.webapp + '/app/')),
//         // UDP template HTMLS
//         gulp.src('src/webapp/app/modules/udp/templates/*.html').pipe(gulp.dest(dirs.dist.webapp + '/app/modules/udp/templates/')),
//         // Module CSS
//         gulp.src('src/webapp/content/**/oplus-*.css')
//             .pipe(flatten())
//             .pipe(gulp.dest(dirs.dist.webapp + '/content/css')),
//         // i18n
//         // gulp.src(config.i18nDir + '/**').pipe(gulp.dest(dirs.dist.webapp + '/i18n'))
//         gulp.src(config.i18nDir + '/*').pipe(gulp.dest(dirs.dist.webapp + '/i18n'))
//     ];
//     return es.merge(streams);
// });

gulp.task('watch', function watch() {
    const cssFiles = config.sassSrc.concat(config.lessSrc);
    gulp.watch(cssFiles, ['build-css']);
    gulp.watch(config.i18nDir + '/*/*.json', ['combine-i18n']);
});

gulp.task('zip-webapp', function zipWebapp() {
    info('Package all files for distribution');
    return gulp.src(['!dist/webapp/config.js', 'dist/webapp/**/*'])
        .pipe(zip(pkg.name + '-' + pkg.version + '.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('update-versions', function () {
    // return ngConstant({
    //     name: 'app',
    //     constants: {
    //         VERSION: packageJson.version + isDev ? "-DEV" : "",
    //         // DEBUG_INFO_ENABLED: false,
    //         DEBUG_INFO_ENABLED: isDev === true,
    //         BUILD_TIMESTAMP: new Date().getTime()
    //     },
    //     template: config.constantTemplate,
    //     stream: true
    // })
    //     .pipe(rename('app.constants.js'))
    //     .pipe(gulp.dest(config.app + 'app/'));
});

const info = message => {
    console.log(message);
}

// ============ 复合任务定义 ============

// 简化的开发环境构建任务（跳过HTML模板编译）
gulp.task('build-dev-simple', function buildDevSimple() {
    info('Building development version (simplified)...');
    return runSequence(
        'clean',
        'combine-i18n',
        // 跳过 'module-html2js' 任务
        ['build-css', 'build-js'],
        'copy-files',
        'copy-lazyload-files',
        'copy-npm-assets'
    );
});

// 开发环境构建任务
gulp.task('build-dev', function buildDev() {
    info('Building development version...');
    return runSequence(
        'clean',
        'combine-i18n',
        'module-html2js',
        ['build-css', 'build-js'],
        'copy-files',
        'copy-lazyload-files',
        'copy-npm-assets'
    );
});

// 生产环境构建任务
gulp.task('build-prod', function buildProd() {
    info('Building production version...');
    return runSequence('dist-modules');
});

// 简化的开发模式：构建 + 启动服务器
gulp.task('dev-simple', function devSimple() {
    info('Starting development mode (simplified)...');
    return runSequence('build-dev-simple', 'serve');
});

// 开发模式：构建 + 启动服务器
gulp.task('dev', function dev() {
    info('Starting development mode...');
    return runSequence('build-dev', 'serve');
});

// 增强的 watch 任务
gulp.task('watch-enhanced', function watchEnhanced() {
    const cssFiles = config.sassSrc.concat(config.lessSrc);
    const jsFiles = ['src/webapp/app/modules/**/*.js', '!src/webapp/app/modules/**/node_modules/**/*.js'];
    const htmlFiles = ['src/webapp/app/modules/**/*.html', '!src/webapp/app/modules/**/node_modules/**/*.html'];
    const configFiles = ['src/webapp/config.js'];
    
    // 监视 CSS 文件
    gulp.watch(cssFiles, function(event) {
        console.log('🎨 CSS file changed:', path.basename(event.path));
        return gulp.start('build-css');
    });
    
    // 监视 i18n 文件
    gulp.watch(config.i18nDir + '/*/*.json', function(event) {
        console.log('🌐 i18n file changed:', path.basename(event.path));
        return gulp.start('combine-i18n');
    });
    
    // 监视 HTML 模板文件
    gulp.watch(htmlFiles, function(event) {
        console.log('📄 HTML template changed:', path.basename(event.path));
        return gulp.start('module-html2js');
    });
    
    // 监视 JS 文件
    gulp.watch(jsFiles, function(event) {
        console.log('📜 JS file changed:', path.basename(event.path));
        return gulp.start('build-js');
    });
    
    // 监视配置文件
    gulp.watch(configFiles, function(event) {
        console.log('⚙️ Config file changed:', path.basename(event.path));
        return gulp.src('src/webapp/config.js').pipe(gulp.dest(dirs.dist.webapp));
    });
    
    // 监视构建输出目录，触发页面刷新
    gulp.watch([
        dirs.dist.webapp + '/**/*.js',
        dirs.dist.webapp + '/**/*.css',
        dirs.dist.webapp + '/**/*.html'
    ], function(event) {
        console.log('🔄 Built file changed, reloading browser...');
        return gulp.src(event.path).pipe(connect.reload());
    });
    
    console.log('👀 File watcher started...');
    console.log('📁 Watching: JS, HTML, CSS, i18n, config files');
    console.log('🔥 Hot-reload enabled - changes will auto-refresh browser');
});

// 开发模式 + 热重载：构建 + 启动服务器 + 监视文件
gulp.task('watch-dev', function watchDev() {
    info('Starting development mode with hot reload...');
    return runSequence('build-dev', 'serve', 'watch-enhanced');
});

// 仅启动服务器 + 监视（假设已经构建过）
gulp.task('serve-watch', function serveWatch() {
    info('Starting server with file watching...');
    return runSequence('serve', 'watch-enhanced');
});

// 现在代理是默认功能，所以这些任务可以移除或重命名
// 保留dev-proxy和dev-simple-proxy作为向后兼容的别名
gulp.task('dev-proxy', function devProxy() {
    info('Starting development mode with proxy...');
    return runSequence('build-dev-simple', 'serve', 'watch-enhanced');
});

gulp.task('dev-simple-proxy', function devSimpleProxy() {
    info('Starting development mode with proxy (simplified)...');
    return runSequence('build-dev-simple', 'serve');
});
