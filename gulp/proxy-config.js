// 现代化的代理配置 - 类似 Vite/webpack-dev-server
module.exports = {
    // 开发环境代理配置
    '/api': 'http://localhost:8080',
    '/auth': 'http://localhost:8081',
    '/upload': 'http://localhost:8082',
    
    // 也支持详细配置
    '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true
    },
    
    // 路径重写示例
    '/admin': {
        target: 'http://localhost:8080',
        pathRewrite: {
            '^/admin': '/api/admin'
        }
    }
}; 