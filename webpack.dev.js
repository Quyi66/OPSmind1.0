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
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /api request:', req.url, '-> http://10.1.40.112:18080' + req.url);
                    }
                },
                '/local-portal/**': {
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    pathRewrite: {
                        '^/local-portal': '/oplus-portal'
                    },
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /local-portal request:', req.url, '-> http://10.1.40.112:18080' + req.url.replace('/local-portal', '/oplus-portal'));
                    }
                },
                '/oplus-portal/**': {
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /oplus-portal request:', req.url, '-> http://10.1.40.112:18080' + req.url);
                    }
                },
                '/oplus-upload/**': {
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /oplus-upload request:', req.url, '-> http://10.1.40.112:18080' + req.url);
                    }
                },
                '/oplus-njs/**': {
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /oplus-njs request:', req.url, '-> http://10.1.40.112:18080' + req.url);
                    }
                },
                '/oplus-ws/**': {
                    target: 'http://10.1.40.112:18080',
                    changeOrigin: true,
                    secure: false,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log('🔄 Proxying /oplus-ws request:', req.url, '-> http://10.1.40.112:18080' + req.url);
                    }
                }
            },
            onBeforeSetupMiddleware: (devServer) => {
                if (!devServer) {
                    throw new Error('webpack-dev-server is not defined');
                }

                // 路径重写中间件 - 只处理静态资源路径，不处理 API 请求
                devServer.app.use((req, res, next) => {
                    const url = req.originalUrl || req.url;

                    console.log('🔍 Processing request:', url);

                    // 跳过 API 请求，避免干扰代理
                    if (url.startsWith('/api/') ||
                        url.startsWith('/local-portal/') ||
                        url.startsWith('/oplus-portal/') ||
                        url.startsWith('/oplus-upload/') ||
                        url.startsWith('/oplus-njs/') ||
                        url.startsWith('/oplus-ws/')) {
                        console.log('🚀 API request, skipping rewrite:', url);
                        return next();
                    }

                    // 处理 /oplus/base 路径重定向（不带尾部斜杠）
                    if (url === '/oplus/base') {
                        console.log('🔄 Redirecting to /oplus/base/');
                        return res.redirect(301, '/oplus/base/');
                    }

                    // 处理 /oplus-admin 路径重定向（不带尾部斜杠）
                    if (url === '/oplus-admin') {
                        console.log('🔄 Redirecting to /oplus-admin/');
                        return res.redirect(301, '/oplus-admin/');
                    }

                    // 只对以 /oplus/base/ 开头的静态资源请求进行路径重写
                    if (url.startsWith('/oplus/base/')) {
                        const newPath = url.replace('/oplus/base', '');
                        req.url = newPath === '' ? '/' : newPath;
                        console.log('✏️ Rewriting /oplus/base/ path:', url, '->', req.url);
                    }
                    // 只对以 /oplus-admin/ 开头的静态资源请求进行路径重写
                    else if (url.startsWith('/oplus-admin/')) {
                        const newPath = url.replace('/oplus-admin', '');
                        req.url = newPath === '' ? '/' : newPath;
                        console.log('✏️ Rewriting /oplus-admin/ path:', url, '->', req.url);
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