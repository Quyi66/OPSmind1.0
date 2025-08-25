const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    // 代理服务器配置
    const PROXY_TARGET = 'http://localhost:18080';
    const commonConfig = common(env, { ...argv, mode: 'development' });

    return merge(commonConfig, {
        mode: 'development',
        devtool: 'source-map', // 改为source-map避免eval相关的CSP问题

        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'dist'),
                    publicPath: '/'
                },
                {
                    directory: path.join(__dirname, 'src/webapp'),
                    publicPath: '/'
                }
            ],
            port: 'auto', // 自动寻找可用端口，从3000开始
            host: '0.0.0.0',
            // 如果 'auto' 不支持，可以使用以下配置
            // port: process.env.PORT || 3000,
            hot: true,
            liveReload: true,
            open: '/oplus/base/', // 默认打开路径
            // 完全禁用 historyApiFallback，因为这是传统的 AngularJS 应用
            historyApiFallback: false,
            // API代理配置 - 统一代理到后端服务器
            proxy: [
                {
                    context: [
                        '/api/**',           // API 接口
                        '/oplus-portal/**',  // 主要服务
                        '/oplus-upload/**',  // 文件上传
                        '/oplus-njs/**',     // Node.js 服务
                        '/oplus-ws/**'       // WebSocket
                    ],
                    target: PROXY_TARGET,
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                }
            ],
            onBeforeSetupMiddleware: (devServer) => {
                if (!devServer) {
                    throw new Error('webpack-dev-server is not defined');
                }

                // 路径重写中间件 - 只处理静态资源路径，不处理 API 请求
                devServer.app.use((req, res, next) => {
                    const url = req.originalUrl || req.url;

                    // 跳过 API 请求，避免干扰代理
                    if (url.startsWith('/api/') ||
                        url.startsWith('/oplus-portal/') ||
                        url.startsWith('/oplus-upload/') ||
                        url.startsWith('/oplus-njs/') ||
                        url.startsWith('/oplus-ws/')) {
                        return next();
                    }

                    // 处理 /oplus/base 路径重定向（不带尾部斜杠）
                    if (url === '/oplus/base') {
                        return res.redirect(301, '/oplus/base/');
                    }

                    // 处理 /oplus-admin 路径重定向（不带尾部斜杠）
                    if (url === '/oplus-admin') {
                        return res.redirect(301, '/oplus-admin/');
                    }

                    // 只对以 /oplus/base/ 开头的静态资源请求进行路径重写
                    if (url.startsWith('/oplus/base/')) {
                        const newPath = url.replace('/oplus/base', '');
                        req.url = newPath === '' ? '/' : newPath;
                    }
                    // 只对以 /oplus-admin/ 开头的静态资源请求进行路径重写
                    else if (url.startsWith('/oplus-admin/')) {
                        const newPath = url.replace('/oplus-admin', '');
                        req.url = newPath === '' ? '/' : newPath;
                    }

                    next();
                });
            },
            client: {
                logging: 'info',
                overlay: {
                    errors: true,
                    warnings: false
                },
                progress: true,
                reconnect: 5
            },
            compress: true,
            allowedHosts: 'all',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            },

            // 自定义服务器启动后的回调
            onListening: function(devServer) {
                if (!devServer) {
                    throw new Error('webpack-dev-server is not defined');
                }

                const port = devServer.server.address().port;
                const host = devServer.options.host === '0.0.0.0' ? 'localhost' : devServer.options.host;

                console.log('\n🚀 开发服务器已启动:');
                console.log(`   本地访问: http://${host}:${port}/oplus/base/`);
                console.log(`   网络访问: http://10.1.8.185:${port}/oplus/base/`);
                console.log('');
            }
        },

        plugins: [
            // 开发环境模块自动注入
            new webpack.DefinePlugin({
                '__DEV__': true,
                '__PROD__': false,
                '__DEBUG__': true,
                'WEBPACK_DEV_SERVER': true,
                'HOT_RELOAD': true,
            }),

            // 热模块替换
            new webpack.HotModuleReplacementPlugin(),
        ],

        optimization: {
            ...commonConfig.optimization,
            minimize: false,
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false
        },

        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            }
        },

        stats: {
            ...commonConfig.stats,
            assets: false,
            builtAt: true,
            timings: true,
            version: false,
            warnings: true
        }
    });
}; 
