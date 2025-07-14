const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const DateTime = require('luxon').DateTime;
const I18nCombinePlugin = require('./webpack-plugins/i18n-combine-plugin');

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
            // 第三方库入口 (最先加载)
            'oplus-vendors': './src/webpack-entries/vendors.js',
            // 各模块入口 (依赖 vendors 和 commons)
            ...modules.reduce((entries, module) => {
                const moduleEntry = `./src/webpack-entries/modules/${module}.js`;
                if (fs.existsSync(moduleEntry)) {
                    if (module === 'commons') {
                        entries[`oplus-${module}`] = {
                            import: moduleEntry,
                            dependOn: 'oplus-vendors'
                        };
                    } else {
                        entries[`oplus-${module}`] = {
                            import: moduleEntry,
                            dependOn: ['oplus-vendors', 'oplus-commons']
                        };
                    }
                }
                return entries;
            }, {}),
            // 主应用样式入口 (依赖所有模块)
            'oplus-styles': {
                import: './src/webapp/app/app.js',
                dependOn: ['oplus-vendors', 'oplus-commons', 'oplus-layout', 'oplus-main', 'oplus-acm', 'oplus-adm', 'oplus-app', 'oplus-cac', 'oplus-dts', 'oplus-gfs', 'oplus-jao', 'oplus-mac', 'oplus-os', 'oplus-search', 'oplus-ssc', 'oplus-uaa', 'oplus-udp', 'oplus-dev']
            }
        },

        output: {
            path: path.resolve(__dirname, 'dist/webapp'),
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
                    use: {
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
                    }
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
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/template/',
                            name: '[path][name].[ext]'
                        }
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
                'VERSION_NUMBER': JSON.stringify(versionNumber)
            }),

            // HTML 模板处理
            new HtmlWebpackPlugin({
                template: './src/webapp/index-webpack.html',
                filename: 'index.html',
                inject: 'body',
                chunks: [
                    'oplus-vendors', 
                    'oplus-commons', 
                    'oplus-app',      // oplus.app 模块，必须在 oplus-main 之前加载
                    'oplus-main',     // OplusApp 主模块定义在这里，依赖 oplus.app
                    'oplus-layout', 
                    'oplus-acm', 
                    'oplus-adm', 
                    'oplus-cac', 
                    'oplus-dts', 
                    'oplus-gfs', 
                    'oplus-jao', 
                    'oplus-mac', 
                    'oplus-os', 
                    'oplus-search', 
                    'oplus-ssc', 
                    'oplus-uaa', 
                    'oplus-udp', 
                    'oplus-dev',
                    'oplus-styles'    // 样式文件，最后加载
                ],
                chunksSortMode: 'manual',
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
            
            // 提供全局 polyfills 和库
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
                // jQuery 必须通过 ProvidePlugin 提供，因为 Bootstrap 等库需要
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
                // 注意：angular 和 lodash 由 vendors.js 显式设置到全局
            }),

            // 静态资源复制
            new CopyWebpackPlugin({
                patterns: [
                    // 配置文件
                    {
                        from: 'src/webapp/config.js',
                        to: 'config.js'
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
                        from: 'src/webapp/content/fonts',
                        to: 'content/fonts'
                    },
                    {
                        from: 'src/webapp/content/images',
                        to: 'content/images',
                        globOptions: {
                            ignore: ['**/test/**']
                        }
                    },
                    {
                        from: 'src/webapp/content/medialib',
                        to: 'content/medialib',
                        globOptions: {
                            ignore: ['**/test/**']
                        }
                    },
                    {
                        from: 'src/webapp/content/template',
                        to: 'content/template'
                    },
                    {
                        from: 'src/webapp/content/webfonts',
                        to: 'content/webfonts'
                    },
                    // 库文件
                    {
                        from: 'src/webapp/lib/tinymce',
                        to: 'lib/tinymce'
                    },
                    {
                        from: 'src/webapp/lib/luckysheet',
                        to: 'lib/luckysheet'
                    },
                    {
                        from: 'src/webapp/lib/json-editor',
                        to: 'lib/json-editor'
                    },
                    {
                        from: 'src/webapp/lib/mergely',
                        to: 'lib/mergely'
                    },
                    {
                        from: 'src/webapp/lib/ng-password-meter',
                        to: 'lib/ng-password-meter'
                    },
                    // 模块资源
                    {
                        from: 'src/webapp/app/modules/**/assets/**/*',
                        to: ({ context, absoluteFilename }) => {
                            const relativePath = path.relative(context, absoluteFilename);
                            return relativePath.replace('src/webapp/', '');
                        },
                        globOptions: {
                            ignore: ['**/node_modules/**']
                        }
                    },
                    // 版本文件
                    {
                        from: 'src/webapp/app/modules/VERSION.json',
                        to: 'app/modules/VERSION.json'
                    }
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