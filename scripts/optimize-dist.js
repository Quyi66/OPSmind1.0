#!/usr/bin/env node

/**
 * Dist构建优化工具
 * 分析并优化dist目录，移除重复文件、source map、测试数据等
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DistOptimizer {
    constructor() {
        this.distPath = path.resolve(__dirname, '../dist');
        this.duplicates = new Map(); // 存储重复文件
        this.largeFiles = []; // 大文件列表
        this.sourceMaps = []; // source map文件
        this.testData = []; // 测试数据文件
        this.totalSizeBefore = 0;
        this.totalSizeAfter = 0;
        this.removedFiles = [];
    }

    /**
     * 计算文件MD5哈希
     */
    getFileHash(filePath) {
        try {
            const content = fs.readFileSync(filePath);
            return crypto.createHash('md5').update(content).digest('hex');
        } catch (error) {
            return null;
        }
    }

    /**
     * 扫描所有文件并分类
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
                this.totalSizeBefore += stat.size;
                this.analyzeFile(fullPath, relativeFilePath, stat.size);
            }
        }
    }

    /**
     * 分析单个文件
     */
    analyzeFile(fullPath, relativePath, size) {
        const ext = path.extname(relativePath).toLowerCase();
        const fileName = path.basename(relativePath).toLowerCase();
        
        // 检查source map文件
        if (ext === '.map') {
            this.sourceMaps.push({ path: fullPath, relativePath, size });
            return;
        }

        // 检查测试数据文件
        if (this.isTestData(relativePath)) {
            this.testData.push({ path: fullPath, relativePath, size });
            return;
        }

        // 检查大文件 (>1MB)
        if (size > 1024 * 1024) {
            this.largeFiles.push({ path: fullPath, relativePath, size });
        }

        // 检查重复文件
        if (this.shouldCheckDuplicates(ext)) {
            const hash = this.getFileHash(fullPath);
            if (hash) {
                if (this.duplicates.has(hash)) {
                    this.duplicates.get(hash).push({ path: fullPath, relativePath, size });
                } else {
                    this.duplicates.set(hash, [{ path: fullPath, relativePath, size }]);
                }
            }
        }
    }

    /**
     * 判断是否为测试数据
     */
    isTestData(relativePath) {
        const testPatterns = [
            /testdata/i,
            /test-data/i,
            /mock/i,
            /demo/i,
            /example/i,
            /sample/i,
            /-test\./i,
            /\.test\./i
        ];
        
        return testPatterns.some(pattern => pattern.test(relativePath));
    }

    /**
     * 判断是否需要检查重复
     */
    shouldCheckDuplicates(ext) {
        const checkExts = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
        return checkExts.includes(ext);
    }

    /**
     * 移除source map文件
     */
    removeSourceMaps() {
        console.log('\n🗑️  移除Source Map文件...');
        let removedSize = 0;
        let removedCount = 0;

        for (const file of this.sourceMaps) {
            try {
                fs.unlinkSync(file.path);
                removedSize += file.size;
                removedCount++;
                this.removedFiles.push(file);
                console.log(`   ✅ 删除: ${file.relativePath} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            } catch (error) {
                console.log(`   ❌ 删除失败: ${file.relativePath} - ${error.message}`);
            }
        }

        console.log(`📊 Source Map清理完成: 删除 ${removedCount} 个文件, 节省 ${(removedSize / 1024 / 1024).toFixed(2)} MB`);
        return removedSize;
    }

    /**
     * 移除测试数据文件
     */
    removeTestData() {
        console.log('\n🗑️  移除测试数据文件...');
        let removedSize = 0;
        let removedCount = 0;

        for (const file of this.testData) {
            try {
                fs.unlinkSync(file.path);
                removedSize += file.size;
                removedCount++;
                this.removedFiles.push(file);
                console.log(`   ✅ 删除: ${file.relativePath} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            } catch (error) {
                console.log(`   ❌ 删除失败: ${file.relativePath} - ${error.message}`);
            }
        }

        console.log(`📊 测试数据清理完成: 删除 ${removedCount} 个文件, 节省 ${(removedSize / 1024 / 1024).toFixed(2)} MB`);
        return removedSize;
    }

    /**
     * 处理重复文件
     */
    handleDuplicates() {
        console.log('\n🔍 处理重复文件...');
        let removedSize = 0;
        let removedCount = 0;

        for (const [hash, files] of this.duplicates) {
            if (files.length > 1) {
                console.log(`\n📋 发现重复文件 (${files.length}个):`);
                files.forEach((file, index) => {
                    console.log(`   ${index + 1}. ${file.relativePath} (${(file.size / 1024).toFixed(2)} KB)`);
                });

                // 保留第一个，删除其他的
                for (let i = 1; i < files.length; i++) {
                    try {
                        fs.unlinkSync(files[i].path);
                        removedSize += files[i].size;
                        removedCount++;
                        this.removedFiles.push(files[i]);
                        console.log(`   ✅ 删除重复: ${files[i].relativePath}`);
                    } catch (error) {
                        console.log(`   ❌ 删除失败: ${files[i].relativePath} - ${error.message}`);
                    }
                }
            }
        }

        console.log(`📊 重复文件清理完成: 删除 ${removedCount} 个文件, 节省 ${(removedSize / 1024 / 1024).toFixed(2)} MB`);
        return removedSize;
    }

    /**
     * 分析大文件
     */
    analyzeLargeFiles() {
        console.log('\n📊 大文件分析 (>1MB):');
        
        const sortedLargeFiles = this.largeFiles.sort((a, b) => b.size - a.size);
        
        sortedLargeFiles.forEach((file, index) => {
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            console.log(`   ${index + 1}. ${file.relativePath} - ${sizeMB} MB`);
        });

        if (sortedLargeFiles.length === 0) {
            console.log('   ✅ 没有发现超过1MB的文件');
        }
    }

    /**
     * 生成优化报告
     */
    generateReport() {
        const savedSize = this.totalSizeBefore - this.totalSizeAfter;
        const savedPercent = ((savedSize / this.totalSizeBefore) * 100).toFixed(1);

        const report = `
# Dist构建优化报告

## 📊 优化结果
- **优化前大小**: ${(this.totalSizeBefore / 1024 / 1024).toFixed(2)} MB
- **优化后大小**: ${(this.totalSizeAfter / 1024 / 1024).toFixed(2)} MB
- **节省空间**: ${(savedSize / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)
- **删除文件数**: ${this.removedFiles.length}

## 🗑️ 删除的文件类型
- **Source Map文件**: ${this.sourceMaps.length}个
- **测试数据文件**: ${this.testData.length}个
- **重复文件**: ${this.removedFiles.filter(f => !f.relativePath.endsWith('.map') && !this.isTestData(f.relativePath)).length}个

## 📋 删除的文件列表
${this.removedFiles.map(f => `- ${f.relativePath} (${(f.size / 1024).toFixed(2)} KB)`).join('\n')}

## 💡 进一步优化建议
1. **图片压缩**: 使用工具压缩PNG/JPEG图片
2. **JavaScript压缩**: 检查是否有未压缩的JS文件
3. **CSS优化**: 移除未使用的CSS规则
4. **字体优化**: 只保留需要的字体格式
5. **依赖分析**: 检查是否有未使用的第三方库

生成时间: ${new Date().toLocaleString()}
`;

        const reportPath = path.join(this.distPath, 'optimization-report.md');
        fs.writeFileSync(reportPath, report);
        console.log(`\n📄 优化报告已生成: ${reportPath}`);
    }

    /**
     * 计算优化后的大小
     */
    calculateFinalSize() {
        this.totalSizeAfter = 0;
        this.scanFilesForSize(this.distPath);
    }

    scanFilesForSize(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                this.scanFilesForSize(fullPath);
            } else {
                this.totalSizeAfter += stat.size;
            }
        }
    }

    /**
     * 运行优化
     */
    async optimize(options = {}) {
        console.log('🔍 开始分析dist目录...');
        
        if (!fs.existsSync(this.distPath)) {
            console.error('❌ dist目录不存在，请先运行构建');
            return;
        }

        // 扫描文件
        this.scanFiles();
        
        console.log('\n📊 分析结果:');
        console.log(`  📁 总大小: ${(this.totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  🗺️  Source Map文件: ${this.sourceMaps.length}个 (${(this.sourceMaps.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB)`);
        console.log(`  🧪 测试数据文件: ${this.testData.length}个 (${(this.testData.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB)`);
        console.log(`  📦 大文件(>1MB): ${this.largeFiles.length}个`);
        
        // 计算重复文件
        const duplicateGroups = Array.from(this.duplicates.values()).filter(files => files.length > 1);
        const duplicateCount = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);
        console.log(`  🔄 重复文件: ${duplicateCount}个`);

        // 执行优化
        let totalSaved = 0;
        
        if (options.removeSourceMaps !== false) {
            totalSaved += this.removeSourceMaps();
        }
        
        if (options.removeTestData !== false) {
            totalSaved += this.removeTestData();
        }
        
        if (options.removeDuplicates !== false) {
            totalSaved += this.handleDuplicates();
        }

        // 分析大文件
        this.analyzeLargeFiles();

        // 计算最终大小
        this.calculateFinalSize();

        // 生成报告
        this.generateReport();

        console.log(`\n✅ 优化完成! 总共节省 ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
    }
}

// 运行优化
if (require.main === module) {
    const optimizer = new DistOptimizer();
    
    const args = process.argv.slice(2);
    const options = {
        removeSourceMaps: !args.includes('--keep-sourcemaps'),
        removeTestData: !args.includes('--keep-testdata'),
        removeDuplicates: !args.includes('--keep-duplicates')
    };

    optimizer.optimize(options).catch(console.error);
}

module.exports = DistOptimizer;
