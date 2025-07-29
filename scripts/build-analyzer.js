#!/usr/bin/env node

/**
 * 构建分析器 - 分析webpack构建结果并提供优化建议
 * 集成webpack-bundle-analyzer进行详细分析
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

class BuildAnalyzer {
    constructor() {
        this.distPath = path.resolve(__dirname, '../dist');
        this.statsPath = path.resolve(__dirname, '../webpack-stats.json');
    }

    /**
     * 运行构建分析
     */
    async analyze() {
        console.log('🔍 开始构建分析...\n');

        try {
            // 1. 检查构建产物
            this.analyzeBuildOutput();

            // 2. 分析文件大小
            this.analyzeFileSize();

            // 3. 检查重复依赖
            this.analyzeDuplicates();

            // 4. 提供优化建议
            this.provideOptimizationSuggestions();

        } catch (error) {
            console.error('❌ 分析失败:', error.message);
            process.exit(1);
        }
    }

    /**
     * 运行webpack-bundle-analyzer详细分析
     */
    async runBundleAnalyzer() {
        console.log('📊 启动webpack-bundle-analyzer...\n');

        try {
            // 检查是否有webpack stats文件
            if (fs.existsSync(this.statsPath)) {
                console.log('📈 使用现有的webpack stats文件...');
                execSync(`npx webpack-bundle-analyzer ${this.statsPath}`, {
                    stdio: 'inherit',
                    cwd: path.resolve(__dirname, '..')
                });
            } else {
                console.log('🔨 重新构建并生成分析报告...');
                // 运行带有bundle analyzer的构建
                execSync('npm run build:analyze', {
                    stdio: 'inherit',
                    cwd: path.resolve(__dirname, '..')
                });
            }
        } catch (error) {
            console.error('❌ Bundle analyzer启动失败:', error.message);
            console.log('💡 请确保已安装webpack-bundle-analyzer: npm install --save-dev webpack-bundle-analyzer');
        }
    }

    /**
     * 分析构建产物
     */
    analyzeBuildOutput() {
        console.log('📦 构建产物分析:');
        
        if (!fs.existsSync(this.distPath)) {
            console.log('  ⚠️  dist目录不存在，请先运行构建');
            return;
        }

        const files = this.getDistFiles();
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        console.log(`  📁 总文件数: ${files.length}`);
        console.log(`  📏 总大小: ${this.formatSize(totalSize)}`);
        
        // 按类型分组
        const filesByType = this.groupFilesByType(files);
        Object.entries(filesByType).forEach(([type, typeFiles]) => {
            const typeSize = typeFiles.reduce((sum, file) => sum + file.size, 0);
            console.log(`  ${this.getTypeIcon(type)} ${type}: ${typeFiles.length}个文件, ${this.formatSize(typeSize)}`);
        });
        
        console.log('');
    }

    /**
     * 分析文件大小
     */
    analyzeFileSize() {
        console.log('📊 文件大小分析:');
        
        const files = this.getDistFiles();
        const largeFiles = files
            .filter(file => file.size > 100 * 1024) // 大于100KB
            .sort((a, b) => b.size - a.size)
            .slice(0, 10);

        if (largeFiles.length > 0) {
            console.log('  🔍 大文件 (>100KB):');
            largeFiles.forEach(file => {
                console.log(`    ${this.formatSize(file.size).padStart(8)} - ${file.name}`);
            });
        } else {
            console.log('  ✅ 没有发现过大的文件');
        }
        
        console.log('');
    }

    /**
     * 分析重复依赖
     */
    analyzeDuplicates() {
        console.log('🔄 重复依赖分析:');
        
        try {
            // 使用webpack-bundle-analyzer的数据
            if (fs.existsSync(this.statsPath)) {
                console.log('  📈 使用webpack stats进行分析...');
                // 这里可以添加更详细的重复依赖分析
                console.log('  ℹ️  详细分析请运行: npm run analyze');
            } else {
                console.log('  ⚠️  未找到webpack stats文件');
                console.log('  💡 运行 npm run analyze 生成详细报告');
            }
        } catch (error) {
            console.log('  ❌ 分析失败:', error.message);
        }
        
        console.log('');
    }

    /**
     * 提供优化建议
     */
    provideOptimizationSuggestions() {
        console.log('💡 优化建议:');
        
        const files = this.getDistFiles();
        const jsFiles = files.filter(f => f.name.endsWith('.js'));
        const cssFiles = files.filter(f => f.name.endsWith('.css'));
        
        // JS文件建议
        if (jsFiles.length > 0) {
            const avgJsSize = jsFiles.reduce((sum, f) => sum + f.size, 0) / jsFiles.length;
            if (avgJsSize > 200 * 1024) {
                console.log('  🚀 JavaScript优化:');
                console.log('    - 考虑进一步拆分大型chunk');
                console.log('    - 使用动态导入(import())进行代码分割');
                console.log('    - 检查是否有未使用的代码可以tree-shake');
            }
        }
        
        // CSS文件建议
        if (cssFiles.length > 0) {
            const totalCssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
            if (totalCssSize > 100 * 1024) {
                console.log('  🎨 CSS优化:');
                console.log('    - 考虑使用CSS-in-JS或CSS模块化');
                console.log('    - 移除未使用的CSS规则');
                console.log('    - 使用PostCSS进行进一步优化');
            }
        }
        
        // 通用建议
        console.log('  ⚡ 通用优化:');
        console.log('    - 启用Gzip/Brotli压缩');
        console.log('    - 使用CDN加速静态资源');
        console.log('    - 考虑使用Service Worker进行缓存');
        console.log('    - 定期更新依赖项到最新版本');
        
        console.log('');
    }

    /**
     * 获取dist目录下的所有文件
     */
    getDistFiles() {
        const files = [];
        
        function walkDir(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    walkDir(fullPath);
                } else {
                    files.push({
                        name: path.relative(this.distPath, fullPath),
                        size: stat.size,
                        path: fullPath
                    });
                }
            });
        }
        
        const self = this;
        function walkDirBound(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    walkDirBound(fullPath);
                } else {
                    files.push({
                        name: path.relative(self.distPath, fullPath),
                        size: stat.size,
                        path: fullPath
                    });
                }
            });
        }

        walkDirBound(this.distPath);
        return files;
    }

    /**
     * 按文件类型分组
     */
    groupFilesByType(files) {
        return files.reduce((groups, file) => {
            const ext = path.extname(file.name).toLowerCase();
            const type = this.getFileType(ext);
            if (!groups[type]) groups[type] = [];
            groups[type].push(file);
            return groups;
        }, {});
    }

    /**
     * 获取文件类型
     */
    getFileType(ext) {
        const typeMap = {
            '.js': 'JavaScript',
            '.css': 'CSS',
            '.html': 'HTML',
            '.png': 'Images',
            '.jpg': 'Images',
            '.jpeg': 'Images',
            '.gif': 'Images',
            '.svg': 'Images',
            '.woff': 'Fonts',
            '.woff2': 'Fonts',
            '.ttf': 'Fonts',
            '.eot': 'Fonts'
        };
        return typeMap[ext] || 'Other';
    }

    /**
     * 获取类型图标
     */
    getTypeIcon(type) {
        const iconMap = {
            'JavaScript': '📜',
            'CSS': '🎨',
            'HTML': '📄',
            'Images': '🖼️',
            'Fonts': '🔤',
            'Other': '📁'
        };
        return iconMap[type] || '📁';
    }

    /**
     * 格式化文件大小
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

// 运行分析
if (require.main === module) {
    const analyzer = new BuildAnalyzer();
    const args = process.argv.slice(2);

    if (args.includes('--bundle') || args.includes('-b')) {
        // 运行详细的bundle分析
        analyzer.runBundleAnalyzer().catch(console.error);
    } else {
        // 运行基础分析
        analyzer.analyze().catch(console.error);

        console.log('💡 提示:');
        console.log('   运行详细分析: node scripts/build-analyzer.js --bundle');
        console.log('   或使用快捷命令: npm run analyze');
    }
}

module.exports = BuildAnalyzer;
