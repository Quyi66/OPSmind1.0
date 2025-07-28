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

    return {
        context: path.resolve(__dirname),
        
        entry: {
            'oplus-vendors': './src/webpack-entries/vendors.js',
            'all-modules': './src/webpack-entries/all-modules.js',
            'oplus-styles': './src/webapp/app/app.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'app/modules/[name].[contenthash:8].js' : 'app/modules/[name].js',
            chunkFilename: isProduction ? 'app/modules/[name].[contenthash:8].chunk.js' : 'app/modules/[name].chunk.js',
            publicPath: '/'
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

            // HTML 模板处理 - 直接使用原来的 index.html
            new HtmlWebpackPlugin({
                template: './src/webapp/index.html',
                filename: 'index.html',
                inject: false, // 不自动注入，使用原有的脚本标签
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
            
            // 模块自动注入 - ProvidePlugin (默认注入所有常用模块)
            new webpack.ProvidePlugin({
                // ========== 核心库 ==========
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',

                // jQuery 生态
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',

                // ========== 工具库 ==========
                // Lodash
                '_': 'lodash',
                'lodash': 'lodash',

                // 时间处理
                'moment': 'moment',
                'numeral': 'numeral',

                // ========== AngularJS 生态 ==========
                'angular': 'angular',

                // ========== 文件处理 ==========
                'saveAs': ['file-saver', 'saveAs'],
                'XLSX': 'xlsx',
                'ClipboardJS': 'clipboard',

                // ========== 数据处理 ==========
                'yaml': 'js-yaml',
                'marked': 'marked',
                'jsyaml': 'js-yaml', // 别名

                // ========== 图表库 ==========
                'echarts': 'echarts',
                'd3': 'd3',
                'c3': 'c3',

                // ========== 编辑器相关 ==========
                'CodeMirror': 'codemirror',

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
                    // 注意：node_modules 依赖现在通过 webpack 模块自动注入处理，不再需要手动复制
                ]
            })
        ],

        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        reuseExistingChunk: true
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
            colors: true
        }
    };
}; 