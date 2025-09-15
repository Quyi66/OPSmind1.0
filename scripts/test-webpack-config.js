#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Webpack configuration...\n');

// 测试配置文件是否存在
const configFiles = [
    'webpack.config.js',
    'webpack.dev.js', 
    'webpack.prod.js',
    'babel.config.js',
    'postcss.config.js'
];

console.log('📁 Checking configuration files:');
configFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - Missing!`);
    }
});

// 测试入口文件
console.log('\n📦 Checking entry files:');
const entryFiles = [
    'src/webapp/app/app.js',
    'src/webpack-entries/vendors.js',
    'src/webapp/index-webpack.html'
];

entryFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - Missing!`);
    }
});

// 测试插件目录
console.log('\n🔌 Checking custom plugins:');
if (fs.existsSync('webpack-plugins')) {
    const plugins = fs.readdirSync('webpack-plugins');
    plugins.forEach(plugin => {
        console.log(`  ✅ webpack-plugins/${plugin}`);
    });
} else {
    console.log('  ❌ webpack-plugins directory - Missing!');
}

// 测试 package.json 脚本
console.log('\n📜 Checking package.json scripts:');
const pkg = require('../package.json');
const expectedScripts = ['dev', 'build', 'build-dev', 'serve', 'clean'];

expectedScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
        console.log(`  ✅ npm run ${script}: ${pkg.scripts[script]}`);
    } else {
        console.log(`  ❌ npm run ${script} - Missing!`);
    }
});

// 测试依赖
console.log('\n📦 Checking key dependencies:');
const expectedDeps = [
    'webpack',
    'webpack-cli', 
    'webpack-dev-server',
    '@babel/core',
    'babel-loader',
    'css-loader',
    'sass-loader'
];

expectedDeps.forEach(dep => {
    if (pkg.devDependencies && pkg.devDependencies[dep]) {
        console.log(`  ✅ ${dep}: ${pkg.devDependencies[dep]}`);
    } else {
        console.log(`  ❌ ${dep} - Missing!`);
    }
});

console.log('\n🚀 Configuration test complete!');
console.log('\n💡 Next steps:');
console.log('  1. Run: npm install');
console.log('  2. Test: npm run build-dev');
console.log('  3. Serve: npm run dev');
console.log('  4. Visit: http://localhost:3000/oplus/base/'); 