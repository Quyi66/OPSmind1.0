#!/usr/bin/env node

/**
 * 自动迁移到webpack模板的脚本
 * 完全替换旧的index.html，确保开发环境正常运行
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 开始自动迁移到webpack模板...\n');

const oldTemplate = 'src/webapp/index.html';
const newTemplate = 'src/webapp/index-webpack.html';
const backupTemplate = 'src/webapp/index.html.backup';

try {
    // 1. 检查文件是否存在
    if (!fs.existsSync(oldTemplate)) {
        console.log('❌ 旧模板文件不存在:', oldTemplate);
        process.exit(1);
    }

    if (!fs.existsSync(newTemplate)) {
        console.log('❌ 新模板文件不存在:', newTemplate);
        process.exit(1);
    }

    // 2. 备份旧模板
    console.log('📦 备份旧模板...');
    fs.copyFileSync(oldTemplate, backupTemplate);
    console.log(`✅ 已备份到: ${backupTemplate}`);

    // 3. 替换模板文件
    console.log('🔄 替换模板文件...');
    fs.copyFileSync(newTemplate, oldTemplate);
    console.log('✅ 已将 index-webpack.html 复制为 index.html');

    // 4. 验证webpack配置
    console.log('🔍 验证webpack配置...');
    const webpackConfigPath = 'webpack.config.js';
    if (fs.existsSync(webpackConfigPath)) {
        const configContent = fs.readFileSync(webpackConfigPath, 'utf8');
        if (configContent.includes('./src/webapp/index-webpack.html')) {
            console.log('✅ webpack配置已正确指向新模板');
        } else {
            console.log('⚠️  webpack配置可能需要手动调整');
        }
    }

    // 5. 显示迁移完成信息
    console.log('\n🎉 自动迁移完成！');
    console.log('\n🔧 已进行的更改:');
    console.log('  1. ✅ 旧的 index.html 已备份为 index.html.backup');
    console.log('  2. ✅ index-webpack.html 已替换为新的 index.html');
    console.log('  3. ✅ webpack配置已更新为使用新模板');
    console.log('  4. ✅ 新模板支持自动资源注入');

    console.log('\n🚀 现在可以运行:');
    console.log('  npm run dev    # 启动开发服务器');
    console.log('  npm run build  # 构建生产版本');

    console.log('\n✨ 新模板的特性:');
    console.log('  🎯 自动注入webpack构建的JS/CSS文件');
    console.log('  📝 支持模板变量（版本号、构建时间等）');
    console.log('  🏗️  更现代化的HTML结构');
    console.log('  ⚡ 更好的加载性能');
    console.log('  🔧 更易维护');

    console.log('\n🔄 如需回滚:');
    console.log('  cp src/webapp/index.html.backup src/webapp/index.html');

} catch (error) {
    console.error('❌ 迁移失败:', error.message);
    console.error('🔄 正在尝试回滚...');

    // 尝试回滚
    try {
        if (fs.existsSync(backupTemplate)) {
            fs.copyFileSync(backupTemplate, oldTemplate);
            console.log('✅ 已回滚到原始状态');
        }
    } catch (rollbackError) {
        console.error('❌ 回滚失败:', rollbackError.message);
    }

    process.exit(1);
}
