#!/usr/bin/env node

/**
 * 静态资源分析工具
 * 专门用于分析传统项目的静态资源大小和依赖关系
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

class StaticAssetsAnalyzer {
    constructor() {
        this.distPath = path.resolve(__dirname, '../dist');
        this.assets = [];
        this.totalSize = 0;
        this.categories = {
            js: { files: [], size: 0 },
            css: { files: [], size: 0 },
            images: { files: [], size: 0 },
            fonts: { files: [], size: 0 },
            html: { files: [], size: 0 },
            json: { files: [], size: 0 },
            other: { files: [], size: 0 }
        };
    }

    /**
     * 扫描所有文件
     */
    scanFiles(dir = this.distPath, relativePath = '') {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const relativeFilePath = path.join(relativePath, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                this.scanFiles(fullPath, relativeFilePath);
            } else {
                const ext = path.extname(file).toLowerCase();
                const size = stat.size;
                
                const asset = {
                    name: relativeFilePath,
                    path: fullPath,
                    size: size,
                    sizeKB: (size / 1024).toFixed(2),
                    sizeMB: (size / 1024 / 1024).toFixed(2),
                    ext: ext
                };
                
                this.assets.push(asset);
                this.totalSize += size;
                this.categorizeAsset(asset);
            }
        }
    }

    /**
     * 分类资源
     */
    categorizeAsset(asset) {
        const ext = asset.ext;
        let category = 'other';
        
        if (['.js'].includes(ext)) category = 'js';
        else if (['.css'].includes(ext)) category = 'css';
        else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) category = 'images';
        else if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) category = 'fonts';
        else if (['.html', '.htm'].includes(ext)) category = 'html';
        else if (['.json'].includes(ext)) category = 'json';
        
        this.categories[category].files.push(asset);
        this.categories[category].size += asset.size;
    }

    /**
     * 生成HTML报告
     */
    generateHTMLReport() {
        const largestFiles = this.assets
            .sort((a, b) => b.size - a.size)
            .slice(0, 20);

        const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OPLUS 静态资源分析报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { background: #ecf0f1; padding: 20px; border-radius: 6px; text-align: center; }
        .card h3 { margin: 0 0 10px 0; color: #2c3e50; }
        .card .value { font-size: 24px; font-weight: bold; color: #3498db; }
        .card .label { color: #7f8c8d; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #34495e; color: white; }
        tr:hover { background: #f8f9fa; }
        .size-bar { height: 20px; background: #3498db; border-radius: 10px; margin: 5px 0; }
        .category { margin: 20px 0; }
        .category h3 { color: #2c3e50; }
        .file-list { max-height: 300px; overflow-y: auto; }
        .large-file { color: #e74c3c; font-weight: bold; }
        .medium-file { color: #f39c12; }
        .small-file { color: #27ae60; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 OPLUS 静态资源分析报告</h1>
        
        <div class="summary">
            <div class="card">
                <h3>总文件数</h3>
                <div class="value">${this.assets.length}</div>
                <div class="label">个文件</div>
            </div>
            <div class="card">
                <h3>总大小</h3>
                <div class="value">${(this.totalSize / 1024 / 1024).toFixed(1)}</div>
                <div class="label">MB</div>
            </div>
            <div class="card">
                <h3>JavaScript</h3>
                <div class="value">${this.categories.js.files.length}</div>
                <div class="label">${(this.categories.js.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
            <div class="card">
                <h3>CSS</h3>
                <div class="value">${this.categories.css.files.length}</div>
                <div class="label">${(this.categories.css.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
            <div class="card">
                <h3>图片</h3>
                <div class="value">${this.categories.images.files.length}</div>
                <div class="label">${(this.categories.images.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
        </div>

        <h2>🔍 最大的20个文件</h2>
        <table>
            <thead>
                <tr>
                    <th>文件名</th>
                    <th>大小</th>
                    <th>类型</th>
                    <th>大小可视化</th>
                </tr>
            </thead>
            <tbody>
                ${largestFiles.map(file => {
                    const sizeClass = file.size > 1024 * 1024 ? 'large-file' : 
                                    file.size > 100 * 1024 ? 'medium-file' : 'small-file';
                    const barWidth = Math.min(100, (file.size / largestFiles[0].size) * 100);
                    return `
                        <tr>
                            <td>${file.name}</td>
                            <td class="${sizeClass}">${file.sizeMB} MB</td>
                            <td>${file.ext || 'N/A'}</td>
                            <td><div class="size-bar" style="width: ${barWidth}%"></div></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        ${Object.entries(this.categories).map(([category, data]) => {
            if (data.files.length === 0) return '';
            const topFiles = data.files.sort((a, b) => b.size - a.size).slice(0, 10);
            return `
                <div class="category">
                    <h2>📁 ${category.toUpperCase()} 文件 (${data.files.length}个, ${(data.size / 1024 / 1024).toFixed(1)} MB)</h2>
                    <div class="file-list">
                        <table>
                            <thead>
                                <tr><th>文件名</th><th>大小</th></tr>
                            </thead>
                            <tbody>
                                ${topFiles.map(file => `
                                    <tr>
                                        <td>${file.name}</td>
                                        <td>${file.sizeKB} KB</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join('')}

        <h2>💡 优化建议</h2>
        <ul>
            <li><strong>大文件优化:</strong> 考虑压缩或拆分超过1MB的文件</li>
            <li><strong>图片优化:</strong> 使用WebP格式，压缩PNG/JPEG</li>
            <li><strong>JavaScript优化:</strong> 移除未使用的代码，使用代码分割</li>
            <li><strong>CSS优化:</strong> 移除未使用的样式，使用CSS压缩</li>
            <li><strong>缓存策略:</strong> 为静态资源设置合适的缓存头</li>
        </ul>
    </div>
</body>
</html>`;

        const reportPath = path.join(this.distPath, 'static-assets-report.html');
        fs.writeFileSync(reportPath, html);
        return reportPath;
    }

    /**
     * 启动简单的HTTP服务器
     */
    startServer(port = 8889) {
        const reportPath = this.generateHTMLReport();
        
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            
            if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
                const html = fs.readFileSync(reportPath, 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        server.listen(port, () => {
            console.log(`📊 静态资源分析报告已启动: http://localhost:${port}`);
            console.log(`📁 报告文件: ${reportPath}`);
        });

        return server;
    }

    /**
     * 运行分析
     */
    analyze() {
        console.log('🔍 开始分析静态资源...');
        
        if (!fs.existsSync(this.distPath)) {
            console.error('❌ dist目录不存在，请先运行构建');
            return;
        }

        this.scanFiles();
        
        console.log('\n📊 分析结果:');
        console.log(`  📁 总文件数: ${this.assets.length}`);
        console.log(`  📏 总大小: ${(this.totalSize / 1024 / 1024).toFixed(1)} MB`);
        
        Object.entries(this.categories).forEach(([category, data]) => {
            if (data.files.length > 0) {
                console.log(`  ${category.toUpperCase()}: ${data.files.length}个文件, ${(data.size / 1024 / 1024).toFixed(1)} MB`);
            }
        });

        const reportPath = this.generateHTMLReport();
        console.log(`\n✅ 详细报告已生成: ${reportPath}`);
        
        // 启动服务器
        this.startServer();
    }
}

// 运行分析
if (require.main === module) {
    const analyzer = new StaticAssetsAnalyzer();
    analyzer.analyze();
}

module.exports = StaticAssetsAnalyzer;
