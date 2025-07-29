const express = require('express');
const path = require('path');
const app = express();

// 启用CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 解析JSON请求体
app.use(express.json());

// Mock API响应
app.get('/oplus-portal/api/tenant/config', (req, res) => {
    console.log('📡 Mock API: GET /oplus-portal/api/tenant/config');
    res.json({
        success: true,
        data: {
            tenantCode: 'base',
            tenantName: 'Base Tenant',
            theme: 'default',
            logo: '',
            features: []
        }
    });
});

app.get('/oplus-portal/api/user/current', (req, res) => {
    console.log('📡 Mock API: GET /oplus-portal/api/user/current');
    res.json({
        success: true,
        data: {
            id: 1,
            username: 'admin',
            name: 'Administrator',
            roles: ['ADMIN']
        }
    });
});

app.get('/oplus-portal/api/system/info', (req, res) => {
    console.log('📡 Mock API: GET /oplus-portal/api/system/info');
    res.json({
        success: true,
        data: {
            version: '1.0.0',
            buildTime: new Date().toISOString()
        }
    });
});

// 通用API响应
app.use('/oplus-portal/api/*', (req, res) => {
    console.log(`📡 Mock API: ${req.method} ${req.path}`);
    res.json({
        success: true,
        data: {},
        message: 'Mock response'
    });
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// SPA路由回退
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`🚀 Mock API服务器启动成功:`);
    console.log(`   本地访问: http://localhost:${PORT}/oplus/base/`);
    console.log(`   管理员模式: http://localhost:${PORT}/oplus-admin/`);
    console.log('');
    console.log('📡 提供的Mock API:');
    console.log('   - /oplus-portal/api/tenant/config');
    console.log('   - /oplus-portal/api/user/current');
    console.log('   - /oplus-portal/api/system/info');
});
