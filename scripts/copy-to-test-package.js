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
     * 创建README文件
     */
    createReadme() {
        const readmeContent = `# OPLUS 测试包

这是OPLUS项目的测试部署包，包含了优化后的静态文件和部署配置。

## 📁 文件说明

- \`dist/\` - 构建后的静态文件（已自动优化）
- \`Dockerfile\` - Docker镜像构建文件
- \`nginx.conf\` - Nginx配置文件
- \`start-nginx.sh\` - 一键启动脚本

## 🚀 快速启动

\`\`\`bash
# 一键启动（推荐）
chmod +x start-nginx.sh
./start-nginx.sh
\`\`\`

## 🐳 手动Docker部署

\`\`\`bash
# 构建镜像
docker build -t oplus-test .

# 运行容器
docker run -d --name oplus-test-container -p 8080:80 oplus-test
\`\`\`

## 🌐 访问地址

- 普通模式: http://localhost:8080/oplus/base/
- 管理员模式: http://localhost:8080/oplus-admin/

## 📊 优化信息

此包已自动优化：
- 移除Source Maps文件
- 移除测试数据文件
- 移除重复文件
- 通常可节省20-30%的空间

## 🔄 更新测试包

在主项目目录运行：
\`\`\`bash
npm run build
\`\`\`

构建完成后会自动优化并更新此测试包。

## 📋 注意事项

1. 确保Docker已安装并运行
2. 端口8080需要可用
3. 如有问题请检查防火墙设置

---
*此测试包由构建流程自动生成和更新*
`;

        const readmePath = path.join(this.testPackagePath, 'README.md');
        fs.writeFileSync(readmePath, readmeContent);
        console.log('📝 创建 README.md');
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

            // 4. 创建README
            this.createReadme();

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
