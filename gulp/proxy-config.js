// 现代化的代理配置 - 类似 Vite/webpack-dev-server
module.exports = {
    // 开发环境代理配置
    '/api': 'http://localhost:8080',
    '/auth': 'http://localhost:8081',
    '/upload': 'http://localhost:8082',
    
    // oplus-portal 代理 - 可以修改为其他可访问的服务器
    '/local-portal': {
        // 代理到 Caddy 服务器
        target: 'http://localhost:8080',  // Caddy 代理服务器
        changeOrigin: true,
        // 不需要路径重写，让 Caddy 处理
    },
    
    // WebSocket 支持
    '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true
    },
    
    // 管理后台代理
    '/admin': {
        target: 'http://localhost:8080',
        pathRewrite: {
            '^/admin': '/api/admin'
        }
    }
}; 