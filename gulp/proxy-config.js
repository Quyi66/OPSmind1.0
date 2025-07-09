module.exports = {
    development: {
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            },
            onProxyReq: function(proxyReq, req, res) {
                console.log('Proxying API request:', req.method, req.url);
            },
            onProxyRes: function(proxyRes, req, res) {
                console.log('Received API response from backend');
            }
        },
        '/auth': {
            target: 'http://localhost:8081',
            changeOrigin: true,
            pathRewrite: {
                '^/auth': '/api/auth'
            },
            onProxyReq: function(proxyReq, req, res) {
                console.log('Proxying Auth request:', req.method, req.url);
            }
        },
        '/upload': {
            target: 'http://localhost:8082',
            changeOrigin: true,
            pathRewrite: {
                '^/upload': '/api/upload'
            },
            onProxyReq: function(proxyReq, req, res) {
                console.log('Proxying Upload request:', req.method, req.url);
            }
        }
    },
    production: {
        '/api': {
            target: 'https://your-production-api.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        },
        '/auth': {
            target: 'https://your-production-auth.com',
            changeOrigin: true,
            pathRewrite: {
                '^/auth': '/api/auth'
            }
        },
        '/upload': {
            target: 'https://your-production-upload.com',
            changeOrigin: true,
            pathRewrite: {
                '^/upload': '/api/upload'
            }
        }
    },
    test: {
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
}; 