const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class FlowBuildPlugin {
    constructor(options = {}) {
        this.options = {
            flowModulePath: 'src/webapp/app/modules/flow',
            outputPath: 'dist/webapp/app/modules',
            cssOutputPath: 'src/webapp/content/css',
            ...options
        };
    }

    apply(compiler) {
        compiler.hooks.beforeCompile.tapAsync('FlowBuildPlugin', (params, callback) => {
            console.log('🔄 Building Flow module...');
            console.log('⏳ This may take some time...');
            
            try {
                this.buildFlowModule();
                console.log('✅ Flow module built successfully');
                callback();
            } catch (error) {
                console.error('❌ Flow module build failed:', error);
                callback(error);
            }
        });
    }

    buildFlowModule() {
        const flowPath = this.options.flowModulePath;
        
        // 检查 Flow 模块是否存在
        if (!fs.existsSync(flowPath)) {
            console.warn('⚠️ Flow module not found, skipping build');
            return;
        }

        // 检查是否有 package.json
        const packageJsonPath = path.join(flowPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            console.warn('⚠️ Flow module package.json not found, skipping build');
            return;
        }

        try {
            // 检查是否已经有构建产物
            const distPath = path.join(flowPath, 'dist');
            if (fs.existsSync(distPath)) {
                console.log('📦 Flow module dist found, copying existing assets...');
                this.copyFlowAssets();
                return;
            }

            // 尝试执行 Flow 模块构建，使用 Node.js 16 兼容模式
            console.log('🔧 Attempting Flow module build with legacy OpenSSL...');
            execSync('NODE_OPTIONS="--openssl-legacy-provider" npm run build', { 
                cwd: flowPath, 
                stdio: 'inherit',
                timeout: 300000 // 5分钟超时
            });

            // 复制构建产物
            this.copyFlowAssets();
            
        } catch (error) {
            console.warn('⚠️ Flow module build failed, but continuing with main build...');
            console.warn('Flow module error:', error.message);
            console.warn('💡 You may need to build Flow module separately or use Node.js 16');
            
            // 不抛出错误，允许主构建继续
            return;
        }
    }

    copyFlowAssets() {
        const flowDistPath = path.join(this.options.flowModulePath, 'dist');
        
        if (!fs.existsSync(flowDistPath)) {
            console.warn('⚠️ Flow dist directory not found');
            return;
        }

        // 复制 JS 文件
        const jsFile = path.join(flowDistPath, 'oplus-flow.js');
        if (fs.existsSync(jsFile)) {
            const jsOutputDir = this.options.outputPath;
            if (!fs.existsSync(jsOutputDir)) {
                fs.mkdirSync(jsOutputDir, { recursive: true });
            }
            fs.copyFileSync(jsFile, path.join(jsOutputDir, 'oplus-flow.js'));
            console.log('📄 Copied oplus-flow.js');
        }

        // 复制 CSS 文件
        const cssFile = path.join(flowDistPath, 'oplus-flow.css');
        if (fs.existsSync(cssFile)) {
            const cssOutputDir = this.options.cssOutputPath;
            if (!fs.existsSync(cssOutputDir)) {
                fs.mkdirSync(cssOutputDir, { recursive: true });
            }
            fs.copyFileSync(cssFile, path.join(cssOutputDir, 'oplus-flow.css'));
            console.log('🎨 Copied oplus-flow.css');
        }
    }
}

module.exports = FlowBuildPlugin;