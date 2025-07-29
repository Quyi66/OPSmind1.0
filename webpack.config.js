const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const DateTime = require('luxon').DateTime;
const I18nCombinePlugin = require('./webpack-plugins/i18n-combine-plugin');
const HtmlTemplatePlugin = require('./webpack-plugins/html-template-plugin');
const FlowBuildPlugin = require('./webpack-plugins/flow-build-plugin');

// 读取模块列表
function getModules() {
    const modulesRoot = 'src/webapp/app/modules/';
    return fs.readdirSync(modulesRoot)
        .filter(file => fs.statSync(path.join(modulesRoot, file)).isDirectory())
        .filter(name => name !== 'node_modules');
}

// 读取版本信息
const srcVersionFile = './src/webapp/app/modules/VERSION.json';
const theVersion = require(srcVersionFile);
const pkg = require('./package.json');
const timestamp = DateTime.now().toFormat('yyMMddHHmm');
const versionNumber = DateTime.now().toFormat('yyyy.MM.dd');

// 获取构建配置
const modules = getModules();

module.exports = (env = {}, argv = {}) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    // 传统模式提示
    console.log('🔄 传统构建模式启动');
    console.log('📄 使用传统script标签，webpack仅用于HTML服务');
    console.log(`🔧 环境: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

    return {
        context: path.resolve(__dirname),
        
        // 传统模式：禁用所有JS入口点
        entry: {},

        output: {
            path: path.resolve(__dirname, 'dist'),
            // 改进的文件名策略：使用更短的hash，区分vendor和app代码
            filename: isProduction
                ? 'app/modules/[name].[contenthash:6].js'
                : 'app/modules/[name].js',
            chunkFilename: isProduction
                ? 'app/modules/[name].[contenthash:6].chunk.js'
                : 'app/modules/[name].chunk.js',
            publicPath: '',  // 使用相对路径，支持子路径部署
            // 清理输出目录
            clean: isProduction
        },

        resolve: {
            // Webpack 5 兼容性设置 - 关键修复
            fullySpecified: false,
            alias: {
                '@': path.resolve(__dirname, 'src/webapp'),
                '@modules': path.resolve(__dirname, 'src/webapp/app/modules'),
                '@content': path.resolve(__dirname, 'src/webapp/content'),
                '@lib': path.resolve(__dirname, 'src/webapp/lib'),
                // 第三方库别名 - 强制使用正确路径
                'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
                'angular': require.resolve('angular'),  // 使用 require.resolve 确保路径正确
                'lodash': path.resolve(__dirname, 'node_modules/lodash/lodash.min.js'),
                // 修复 process 模块解析问题
                'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js')
            },
            extensions: ['.js', '.json', '.html', '.css', '.scss'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'src/webapp'),
                path.resolve(__dirname, 'src/webapp/node_modules')
            ],
            // Node.js 核心模块的浏览器 fallbacks
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify"),
                "buffer": require.resolve("buffer"),
                "process": require.resolve("process/browser.js"),
                "path": require.resolve("path-browserify"),
                "util": require.resolve("util"),
                "os": require.resolve("os-browserify/browser"),
                "fs": false,
                "child_process": false,
                "net": false,
                "tls": false,
                "dns": false
            }
        },

        module: {
            rules: [
                // JavaScript 处理
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {
                                        targets: {
                                            browsers: ['> 1%', 'last 2 versions', 'ie >= 11']
                                        },
                                        useBuiltIns: 'usage',
                                        corejs: 3
                                    }]
                                ],
                                plugins: [
                                    '@babel/plugin-proposal-object-rest-spread',
                                    '@babel/plugin-proposal-class-properties'
                                ]
                            }
                        },
                        {
                            loader: 'string-replace-loader',
                            options: {
                                multiple: [
                                    {
                                        // 开发环境：将 /oplus-portal 替换为 /local-portal
                                        search: '/oplus-portal',
                                        replace: isProduction ? '/oplus-portal' : '/local-portal',
                                        flags: 'g'
                                    },
                                    {
                                        // 替换API基础路径
                                        search: '/api/',
                                        replace: isProduction ? '/oplus-portal/api/' : '/local-portal/api/',
                                        flags: 'g'
                                    }
                                ]
                            }
                        }
                    ]
                },

                // HTML 模板处理
                {
                    test: /\.html$/,
                    exclude: /index\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: isProduction,
                                sources: false
                            }
                        }
                    ]
                },

                // SCSS/CSS 处理
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                                implementation: require('sass')
                            }
                        }
                    ]
                },

                {
                    test: /\.css$/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },

                // 字体文件处理
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/webfonts/',
                            name: '[name].[ext]'
                        }
                    }
                },

                // 图片文件处理
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/images/',
                            name: '[path][name].[ext]'
                        }
                    }
                },

                // 其他资源文件 (排除 node_modules 中的 JSON 文件)
                {
                    test: /\.(xlsx?|txt|md)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/template/',
                            name: '[path][name].[ext]'
                        }
                    }
                },
                
                // 项目 JSON 文件 (非 node_modules)
                {
                    test: /\.json$/,
                    exclude: [
                        /node_modules/,
                        /src\/webapp\/app\/modules\/flow\/components\/.*\/resources\/.*\.json$/
                    ],
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/template/',
                            name: '[path][name].[ext]'
                        }
                    }
                },
                // 特殊处理 flow 模块中的 JSON 资源文件
                {
                    test: /src\/webapp\/app\/modules\/flow\/components\/.*\/resources\/.*\.json$/,
                    type: 'javascript/auto',
                    use: {
                        loader: 'json-loader'
                    }
                },
                // 处理 .bpmnlintrc 文件
                {
                    test: /\.bpmnlintrc$/,
                    type: 'javascript/auto',
                    use: {
                        loader: 'json-loader'
                    }
                }
            ]
        },

        plugins: [
            // 环境变量定义
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
                'VERSION': JSON.stringify(pkg.version),
                'BUILD_TIMESTAMP': JSON.stringify(timestamp),
                'VERSION_NUMBER': JSON.stringify(versionNumber),
                // API路径配置 - 根据环境自动选择
                'API_BASE_PATH': JSON.stringify(isProduction ? '/oplus-portal' : '/local-portal')
            }),

            // HTML 模板处理 - 传统模式，不注入JS
            new HtmlWebpackPlugin({
                template: './src/webapp/index.html',
                filename: 'index.html',
                inject: false, // 关键：禁用自动注入，使用传统script标签
                templateParameters: {
                    BUILD_TIMESTAMP: timestamp,
                    VERSION: pkg.version,
                    'process.env.NODE_ENV': isProduction ? 'production' : 'development'
                },
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : false
            }),

            // CSS 提取
            new MiniCssExtractPlugin({
                filename: isProduction ? 'content/css/[name].[contenthash:8].css' : 'content/css/[name].css',
                chunkFilename: isProduction ? 'content/css/[name].[contenthash:8].chunk.css' : 'content/css/[name].chunk.css'
            }),

            // 国际化文件合并
            new I18nCombinePlugin({
                inputDir: 'src/webapp/i18n',
                outputFileName: 'app/modules/oplus-lang.js'
            }),

            // HTML 模板编译
            new HtmlTemplatePlugin({
                modulesRoot: 'src/webapp/app/modules/',
                outputDir: 'tmp'
            }),

            // Flow 模块构建
            new FlowBuildPlugin({
                flowModulePath: 'src/webapp/app/modules/flow',
                outputPath: 'dist/app/modules',
                cssOutputPath: 'dist/content/css'
            }),
            
            // 模块自动注入 - ProvidePlugin (针对Angular 1.5.8优化)
            new webpack.ProvidePlugin({
                // ========== 核心运行时 ==========
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',

                // ========== 必需的全局库 ==========
                // jQuery - Angular 1.x依赖，必须全局可用
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',

                // AngularJS 1.5.8 - 使用本地文件路径
                // 注意：不在这里注入angular，因为使用本地文件

                // Lodash - 工具库，使用频率极高
                '_': 'lodash',

                // ========== Angular 1.x 生态系统 ==========
                // 这些库需要在Angular加载后才能使用
                // 'moment': 'moment',        // 建议按需导入
                // 'numeral': 'numeral',      // 建议按需导入
                // 'echarts': 'echarts',      // 建议按需导入
                // 'd3': 'd3',                // 建议按需导入
                // 'XLSX': 'xlsx',            // 建议按需导入

                // ========== 加密工具 ==========
                'CryptoJS': 'crypto-js',

                // ========== 颜色处理 ==========
                'tinycolor': 'tinycolor2',

                // ========== 其他常用库 ==========
                'alertify': 'alertify.js',
                'Select2': 'select2',
                'Sortable': 'sortablejs',
                'diff2html': 'diff2html',
                'beautify': ['js-beautify', 'html'],
                'OpenCC': 'opencc-js',

                // ========== DataTables ==========
                'DataTable': ['datatables.net', '$'],

                // ========== 日历相关 ==========
                'FullCalendar': 'fullcalendar',

                // ========== 树形控件 ==========
                'FancyTree': 'jquery.fancytree',
            }),

            // 静态资源复制 - 复制原 index.html 需要的所有资源
            new CopyWebpackPlugin({
                patterns: [
                    // 配置文件
                    {
                        from: 'src/webapp/config.js',
                        to: 'config.js'
                    },
                    // profiles.js 文件
                    {
                        from: 'src/webapp/app/profiles.js',
                        to: 'app/profiles.js'
                    },
                    // 国际化文件
                    {
                        from: 'src/webapp/i18n',
                        to: 'i18n'
                    },
                    // 帮助文档
                    {
                        from: 'src/webapp/help',
                        to: 'help'
                    },
                    // 静态资源
                    {
                        from: 'src/webapp/content',
                        to: 'content',
                        globOptions: {
                            ignore: ['**/test/**']
                        }
                    },
                    // 所有库文件
                    {
                        from: 'src/webapp/lib',
                        to: 'lib'
                    },
                    // 应用模块文件 - 关键：复制所有app目录下的文件
                    {
                        from: 'src/webapp/app',
                        to: 'app',
                        globOptions: {
                            ignore: [
                                '**/test/**',
                                '**/tests/**',
                                '**/*.spec.js',
                                '**/*.test.js',
                                '**/node_modules/**', // 排除嵌套的node_modules
                                // 注意：不排除 **/dist/** 因为flow模块需要其dist文件
                                '**/.git/**',         // 排除git文件
                                '**/coverage/**',     // 排除测试覆盖率
                                '**/*.log',           // 排除日志文件
                                '**/package-lock.json', // 排除锁文件
                                '**/yarn.lock'        // 排除yarn锁文件
                            ]
                        }
                    },
                    // node_modules文件通过单独脚本复制
                ]
            })
        ],

        optimization: {
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: 6,
                maxAsyncRequests: 4,
                cacheGroups: {
                    // 核心框架库 - 变化频率最低
                    framework: {
                        test: /[\\/]node_modules[\\/](angular|jquery|lodash)[\\/]/,
                        name: 'framework',
                        chunks: 'all',
                        priority: 40,
                        enforce: true
                    },
                    // 大型第三方库
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 20,
                        minSize: 20000,
                        maxSize: 244000
                    },
                    // 应用通用代码
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        minSize: 10000
                    }
                }
            },
            runtimeChunk: {
                name: 'runtime'
            }
        },

        watchOptions: {
            ignored: /dist/
        },

        stats: {
            children: false,
            chunks: false,
            modules: false,
            reasons: false,
            usedExports: false,
            providedExports: false,
            optimizationBailout: false,
            errorDetails: true,
            colors: true,
            // 添加性能监控信息
            assets: isProduction,
            builtAt: true,
            timings: true,
            performance: isProduction
        },

        // 性能预算 - 监控bundle大小
        performance: isProduction ? {
            hints: 'warning',
            maxEntrypointSize: 400000,  // 400KB
            maxAssetSize: 300000,       // 300KB
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
            }
        } : false
    };
}; 