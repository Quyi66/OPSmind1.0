#!/usr/bin/env node

/**
 * 拷贝build目录和优化后的dist到test-package
 * 自动在构建后执行，为同事提供测试包
 */

const fs = require('fs');
const path = require('path');

class TestPackageCopier {
    constructor() {
        this.rootPath = path.resolve(__dirname, '..');
        this.distPath = path.join(this.rootPath, 'dist');
        this.buildPath = path.join(this.rootPath, 'build');
        this.testPackagePath = path.join(this.rootPath, 'test-package');
    }

    /**
     * 清空test-package目录
     */
    cleanTestPackage() {
        if (fs.existsSync(this.testPackagePath)) {
            console.log('🗑️  清空 test-package 目录');
            this.removeDirectory(this.testPackagePath);
        }
        fs.mkdirSync(this.testPackagePath, { recursive: true });
    }

    /**
     * 递归删除目录
     */
    removeDirectory(dir) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    this.removeDirectory(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            });
            fs.rmdirSync(dir);
        }
    }

    /**
     * 复制build目录内容到test-package
     */
    copyBuildFiles() {
        if (!fs.existsSync(this.buildPath)) {
            console.log('❌ build目录不存在');
            return false;
        }

        console.log('📦 复制build目录文件...');
        const files = fs.readdirSync(this.buildPath);

        files.forEach(file => {
            const srcPath = path.join(this.buildPath, file);
            const destPath = path.join(this.testPackagePath, file);

            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
                console.log(`   ✅ ${file}`);
            }
        });

        return true;
    }

    /**
     * 复制dist目录到test-package
     */
    copyDist() {
        if (!fs.existsSync(this.distPath)) {
            console.log('❌ dist目录不存在');
            return false;
        }

        console.log('📦 复制优化后的dist目录...');
        const destDistPath = path.join(this.testPackagePath, 'dist');
        this.copyDirectory(this.distPath, destDistPath);
        console.log('   ✅ dist目录复制完成');
        return true;
    }

    /**
     * 递归复制目录
     */
    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);
        
        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    /**
     * 检查build目录中是否有README，如果有则使用build中的
     */
    handleReadme() {
        const buildReadmePath = path.join(this.buildPath, 'README.md');
        const testReadmePath = path.join(this.testPackagePath, 'README.md');

        if (fs.existsSync(buildReadmePath)) {
            // 如果build目录中有README，直接复制（在copyBuildFiles中已经复制了）
            console.log('📝 使用 build/README.md');
        } else {
            // 如果build目录中没有README，创建一个简单的
            const readmeContent = `# OPLUS 测试包

## 🔧 修改后端服务器

编辑 \`nginx.conf\` 文件第8行：

\`\`\`nginx
set $backend_server "10.1.40.112:8080";  # 改为你的后端服务器IP:端口
\`\`\`

## 🚀 启动容器

\`\`\`bash
./start-nginx.sh
\`\`\`

## 🌐 访问地址

- http://localhost:8080/oplus/base/
- http://localhost:8080/oplus-admin/
`;
            fs.writeFileSync(testReadmePath, readmeContent);
            console.log('📝 创建默认 README.md');
        }
    }

    /**
     * 设置文件权限
     */
    setPermissions() {
        const startScriptPath = path.join(this.testPackagePath, 'start-nginx.sh');
        if (fs.existsSync(startScriptPath)) {
            fs.chmodSync(startScriptPath, '755');
            console.log('🔧 设置 start-nginx.sh 执行权限');
        }
    }



    /**
     * 获取dist目录大小
     */
    getDirectorySize(dir) {
        let size = 0;
        
        if (!fs.existsSync(dir)) return 0;
        
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                size += this.getDirectorySize(filePath);
            } else {
                size += stat.size;
            }
        });
        
        return size;
    }

    /**
     * 运行拷贝过程
     */
    async copy() {
        console.log('\n📦 开始创建test-package...');

        try {
            // 1. 清空test-package目录
            this.cleanTestPackage();

            // 2. 复制build目录文件
            const buildSuccess = this.copyBuildFiles();
            if (!buildSuccess) return;

            // 3. 复制dist目录
            const distSuccess = this.copyDist();
            if (!distSuccess) return;

            // 4. 处理README（优先使用build中的）
            this.handleReadme();

            // 5. 设置权限
            this.setPermissions();

            // 6. 显示结果
            const totalSize = this.getDirectorySize(this.testPackagePath);
            const distSize = this.getDirectorySize(path.join(this.testPackagePath, 'dist'));

            console.log(`\n✅ test-package创建完成!`);
            console.log(`📊 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`📊 dist大小: ${(distSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`📁 位置: ${path.relative(this.rootPath, this.testPackagePath)}/`);
            console.log(`\n💡 同事可以直接使用test-package进行测试部署`);

        } catch (error) {
            console.error('❌ 创建test-package失败:', error.message);
            process.exit(1);
        }
    }
}

// 运行拷贝
if (require.main === module) {
    const copier = new TestPackageCopier();
    copier.copy().catch(console.error);
}

module.exports = TestPackageCopier;
