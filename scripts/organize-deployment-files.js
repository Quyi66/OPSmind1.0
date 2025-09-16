#!/usr/bin/env node

/**
 * 部署文件组织工具
 * 将nginx、docker相关的测试dist包文件移到单独目录中
 */

const fs = require('fs');
const path = require('path');

class DeploymentOrganizer {
    constructor() {
        this.rootPath = path.resolve(__dirname, '..');
        this.deploymentDir = path.join(this.rootPath, 'deployment');
        this.distPath = path.join(this.rootPath, 'dist');
        
        // 定义要移动的文件和目录
        this.filesToMove = [
            // Docker相关
            { src: 'Dockerfile', dest: 'docker/Dockerfile' },
            { src: 'docker-compose.yml', dest: 'docker/docker-compose.yml', optional: true },
            
            // Nginx相关
            { src: 'nginx.conf', dest: 'nginx/nginx.conf' },
            { src: 'start-nginx.sh', dest: 'nginx/start-nginx.sh' },
            
            // 服务器相关
            { src: 'server.js', dest: 'server/server.js', optional: true },
            { src: 'server-prod.js', dest: 'server/server-prod.js', optional: true },
            { src: 'mock-api-server.js', dest: 'server/mock-api-server.js', optional: true },
            
            // Webpack相关
            { src: 'webpack.traditional.js', dest: 'webpack/webpack.traditional.js', optional: true }
        ];

        // 定义要复制dist的目标
        this.distTargets = [
            { name: 'nginx', desc: 'Nginx静态文件服务' },
            { name: 'docker', desc: 'Docker容器部署' },
            { name: 'server', desc: 'Node.js服务器部署' }
        ];
    }

    /**
     * 创建目录结构
     */
    createDirectories() {
        console.log('📁 创建部署目录结构...');
        
        // 创建主部署目录
        if (!fs.existsSync(this.deploymentDir)) {
            fs.mkdirSync(this.deploymentDir, { recursive: true });
            console.log(`   ✅ 创建: ${path.relative(this.rootPath, this.deploymentDir)}/`);
        }

        // 创建子目录
        const subdirs = ['docker', 'nginx', 'server', 'webpack', 'dist'];
        subdirs.forEach(subdir => {
            const dirPath = path.join(this.deploymentDir, subdir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`   ✅ 创建: deployment/${subdir}/`);
            }
        });

        // 为每个dist目标创建目录
        this.distTargets.forEach(target => {
            const distTargetPath = path.join(this.deploymentDir, 'dist', target.name);
            if (!fs.existsSync(distTargetPath)) {
                fs.mkdirSync(distTargetPath, { recursive: true });
                console.log(`   ✅ 创建: deployment/dist/${target.name}/`);
            }
        });
    }

    /**
     * 移动配置文件
     */
    moveConfigFiles() {
        console.log('\n📦 移动配置文件...');
        
        for (const file of this.filesToMove) {
            const srcPath = path.join(this.rootPath, file.src);
            const destPath = path.join(this.deploymentDir, file.dest);
            
            if (fs.existsSync(srcPath)) {
                // 确保目标目录存在
                const destDir = path.dirname(destPath);
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                
                // 移动文件
                fs.renameSync(srcPath, destPath);
                console.log(`   ✅ 移动: ${file.src} → deployment/${file.dest}`);
            } else if (!file.optional) {
                console.log(`   ⚠️  未找到: ${file.src}`);
            }
        }
    }

    /**
     * 复制dist目录到各个部署目标
     */
    copyDistToTargets() {
        console.log('\n📋 复制dist到部署目标...');
        
        if (!fs.existsSync(this.distPath)) {
            console.log('   ⚠️  dist目录不存在，跳过复制');
            return;
        }

        for (const target of this.distTargets) {
            const targetDistPath = path.join(this.deploymentDir, 'dist', target.name);
            
            console.log(`   📦 复制到 ${target.name} (${target.desc})...`);
            
            try {
                this.copyDirectory(this.distPath, targetDistPath);
                console.log(`   ✅ 完成: deployment/dist/${target.name}/`);
            } catch (error) {
                console.log(`   ❌ 失败: ${error.message}`);
            }
        }
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
     * 创建部署说明文件
     */
    createDeploymentDocs() {
        console.log('\n📝 创建部署说明文件...');

        // 主README
        const mainReadme = `# OPLUS 部署文件

这个目录包含了OPLUS项目的各种部署配置和静态文件。

## 📁 目录结构

\`\`\`
deployment/
├── docker/          # Docker容器部署
│   ├── Dockerfile
│   └── docker-compose.yml
├── nginx/           # Nginx静态文件服务
│   ├── nginx.conf
│   └── start-nginx.sh
├── server/          # Node.js服务器部署
│   ├── server.js
│   ├── server-prod.js
│   └── mock-api-server.js
├── webpack/         # Webpack配置
│   └── webpack.traditional.js
└── dist/           # 静态文件副本
    ├── nginx/      # 用于Nginx部署
    ├── docker/     # 用于Docker部署
    └── server/     # 用于Node.js服务器部署
\`\`\`

## 🚀 部署方式

### 1. Nginx静态文件服务
\`\`\`bash
cd deployment/nginx
chmod +x start-nginx.sh
./start-nginx.sh
\`\`\`

### 2. Docker容器部署
\`\`\`bash
cd deployment/docker
docker-compose up -d
\`\`\`

### 3. Node.js服务器部署
\`\`\`bash
cd deployment/server
node server-prod.js
\`\`\`

## 📋 注意事项

1. 确保已经运行过 \`npm run build\` 构建项目
2. 各个部署方式的静态文件位于对应的 \`dist/\` 子目录中
3. 根据需要修改配置文件中的端口和路径设置

## 🔄 更新部署文件

运行以下命令重新组织部署文件：
\`\`\`bash
npm run organize:deployment
\`\`\`
`;

        fs.writeFileSync(path.join(this.deploymentDir, 'README.md'), mainReadme);
        console.log('   ✅ 创建: deployment/README.md');

        // Nginx部署说明
        const nginxReadme = `# Nginx 部署

## 🚀 快速启动

\`\`\`bash
# 确保已构建项目
npm run build

# 启动Nginx服务
chmod +x start-nginx.sh
./start-nginx.sh
\`\`\`

## 📋 配置说明

- **nginx.conf**: Nginx配置文件
- **start-nginx.sh**: 启动脚本
- **../dist/nginx/**: 静态文件目录

## 🌐 访问地址

- 普通模式: http://localhost:8080/oplus/base/
- 管理员模式: http://localhost:8080/oplus-admin/

## 🛠️ 管理命令

\`\`\`bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
\`\`\`
`;

        fs.writeFileSync(path.join(this.deploymentDir, 'nginx', 'README.md'), nginxReadme);
        console.log('   ✅ 创建: deployment/nginx/README.md');

        // Docker部署说明
        const dockerReadme = `# Docker 部署

## 🚀 快速启动

\`\`\`bash
# 构建并启动
docker-compose up -d
\`\`\`

## 📋 配置文件

- **Dockerfile**: Docker镜像构建文件
- **docker-compose.yml**: Docker Compose配置
- **../dist/docker/**: 静态文件目录

## 🌐 访问地址

- 普通模式: http://localhost:8080/oplus/base/
- 管理员模式: http://localhost:8080/oplus-admin/

## 🛠️ 管理命令

\`\`\`bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose build --no-cache
\`\`\`
`;

        fs.writeFileSync(path.join(this.deploymentDir, 'docker', 'README.md'), dockerReadme);
        console.log('   ✅ 创建: deployment/docker/README.md');

        // Server部署说明
        const serverReadme = `# Node.js 服务器部署

## 🚀 快速启动

\`\`\`bash
# 生产环境
node server-prod.js

# 开发环境
node server.js

# Mock API服务器
node mock-api-server.js
\`\`\`

## 📋 服务器文件

- **server-prod.js**: 生产环境服务器
- **server.js**: 开发环境服务器
- **mock-api-server.js**: Mock API服务器
- **../dist/server/**: 静态文件目录

## 🌐 访问地址

- 生产服务器: http://localhost:8081/
- 开发服务器: http://localhost:3000/
- Mock API: http://localhost:3001/

## ⚙️ 环境变量

\`\`\`bash
export NODE_ENV=production
export PORT=8081
\`\`\`
`;

        fs.writeFileSync(path.join(this.deploymentDir, 'server', 'README.md'), serverReadme);
        console.log('   ✅ 创建: deployment/server/README.md');
    }

    /**
     * 更新配置文件中的路径
     */
    updateConfigPaths() {
        console.log('\n🔧 更新配置文件路径...');

        // 更新nginx配置中的路径
        const nginxConfigPath = path.join(this.deploymentDir, 'nginx', 'nginx.conf');
        if (fs.existsSync(nginxConfigPath)) {
            let nginxConfig = fs.readFileSync(nginxConfigPath, 'utf8');
            nginxConfig = nginxConfig.replace(/\.\/dist/g, '../dist/nginx');
            fs.writeFileSync(nginxConfigPath, nginxConfig);
            console.log('   ✅ 更新: nginx/nginx.conf 中的路径');
        }

        // 更新docker-compose中的路径
        const dockerComposePath = path.join(this.deploymentDir, 'docker', 'docker-compose.yml');
        if (fs.existsSync(dockerComposePath)) {
            let dockerConfig = fs.readFileSync(dockerComposePath, 'utf8');
            dockerConfig = dockerConfig.replace(/\.\/dist/g, '../dist/docker');
            fs.writeFileSync(dockerComposePath, dockerConfig);
            console.log('   ✅ 更新: docker/docker-compose.yml 中的路径');
        }

        // 更新启动脚本中的路径
        const startScriptPath = path.join(this.deploymentDir, 'nginx', 'start-nginx.sh');
        if (fs.existsSync(startScriptPath)) {
            let startScript = fs.readFileSync(startScriptPath, 'utf8');
            startScript = startScript.replace(/dist/g, '../dist/nginx');
            fs.writeFileSync(startScriptPath, startScript);
            console.log('   ✅ 更新: nginx/start-nginx.sh 中的路径');
        }
    }

    /**
     * 运行组织过程
     */
    async organize() {
        console.log('🚀 开始组织部署文件...\n');

        try {
            // 1. 创建目录结构
            this.createDirectories();

            // 2. 移动配置文件
            this.moveConfigFiles();

            // 3. 复制dist目录
            this.copyDistToTargets();

            // 4. 更新配置路径
            this.updateConfigPaths();

            // 5. 创建说明文档
            this.createDeploymentDocs();

            console.log('\n✅ 部署文件组织完成!');
            console.log('\n📁 部署目录结构:');
            console.log('   deployment/');
            console.log('   ├── docker/     # Docker容器部署');
            console.log('   ├── nginx/      # Nginx静态服务');
            console.log('   ├── server/     # Node.js服务器');
            console.log('   ├── webpack/    # Webpack配置');
            console.log('   └── dist/       # 静态文件副本');
            console.log('       ├── nginx/');
            console.log('       ├── docker/');
            console.log('       └── server/');
            
            console.log('\n💡 下一步:');
            console.log('   1. 查看 deployment/README.md 了解部署方式');
            console.log('   2. 根据需要选择合适的部署方法');
            console.log('   3. 修改配置文件以适应您的环境');

        } catch (error) {
            console.error('❌ 组织过程失败:', error.message);
            process.exit(1);
        }
    }
}

// 运行组织过程
if (require.main === module) {
    const organizer = new DeploymentOrganizer();
    organizer.organize().catch(console.error);
}

module.exports = DeploymentOrganizer;
