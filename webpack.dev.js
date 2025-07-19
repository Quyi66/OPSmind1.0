const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require('path');

module.exports = (env, argv) => {
    const commonConfig = common(env, { ...argv, mode: 'development' });

    return merge(commonConfig, {
        mode: 'development',

        devtool: 'eval-source-map',

        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'dist/webapp'),
                    publicPath: '/'
                },
                {
                    directory: path.join(__dirname, 'node_modules'),
                    publicPath: '/node_modules'
                },
                {
                    directory: path.join(__dirname, 'src/webapp'),
                    publicPath: '/'
                }
            ],
            port: 3000,
            host: '0.0.0.0',
            hot: true,
            liveReload: true,
            open: false,
            // 完全禁用 historyApiFallback，因为这是传统的 AngularJS 应用
            historyApiFallback: false,
            // API代理配置 - 统一代理到后端服务器
            proxy: {
                '/api/**': {
                    target: 'http://10.1.40.112',
                    changeOrigin: true,
                    secure: false
                },
                '/local-portal/**': {
                    target: 'http://10.1.40.112',
                    changeOrigin: true,
                    secure: false
                }
            },
            setupMiddlewares: (middlewares, devServer) => {
                if (!devServer) {
                    throw new Error('webpack-dev-server is not defined');
                }

                // 路径重写中间件 - 只处理特定路径
                devServer.app.use((req, res, next) => {
                    const url = req.originalUrl || req.url;

                    // 处理 /oplus/base 路径重定向（不带尾部斜杠）
                    if (url === '/oplus/base') {
                        return res.redirect(301, '/oplus/base/');
                    }

                    // 处理 /oplus-admin 路径重定向（不带尾部斜杠）
                    if (url === '/oplus-admin') {
                        return res.redirect(301, '/oplus-admin/');
                    }

                    // 只对以 /oplus/base/ 开头的请求进行路径重写
                    if (url.startsWith('/oplus/base/')) {
                        const newPath = url.replace('/oplus/base', '');
                        req.url = newPath === '' ? '/' : newPath;
                    } 
                    // 只对以 /oplus-admin/ 开头的请求进行路径重写
                    else if (url.startsWith('/oplus-admin/')) {
                        const newPath = url.replace('/oplus-admin', '');
                        req.url = newPath === '' ? '/' : newPath;
                    }

                    next();
                });

                return middlewares;
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
            }
        },

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