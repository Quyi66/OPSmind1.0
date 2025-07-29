#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复HTML文件中的相对路径为绝对路径
 * 这样可以确保在 /oplus/base/ 或 /oplus-admin/ 路径下也能正确加载资源
 */

const htmlFilePath = path.join(__dirname, '../src/webapp/index.html');

console.log('🔧 修复HTML文件中的相对路径...');
console.log(`📁 文件路径: ${htmlFilePath}`);

// 读取HTML文件
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// 需要修复的路径模式
const pathPatterns = [
    // script src 路径
    { pattern: /src="([^"/][^"]*)"/, replacement: 'src="/$1"', description: 'script src' },
    // link href 路径
    { pattern: /href="([^"/][^"]*)"/, replacement: 'href="/$1"', description: 'link href' },
    // img src 路径
    { pattern: /src="([^"/][^"]*)"/, replacement: 'src="/$1"', description: 'img src' }
];

let totalReplacements = 0;

// 逐个处理每种路径模式
pathPatterns.forEach(({ pattern, replacement, description }) => {
    const matches = htmlContent.match(new RegExp(pattern.source, 'g'));
    if (matches) {
        console.log(`\n📝 处理 ${description} 路径:`);
        console.log(`   找到 ${matches.length} 个匹配项`);
        
        let replacements = 0;
        htmlContent = htmlContent.replace(new RegExp(pattern.source, 'g'), (match, relativePath) => {
            // 跳过已经是绝对路径的
            if (relativePath.startsWith('/') || relativePath.startsWith('http')) {
                return match;
            }
            
            replacements++;
            const newMatch = match.replace(relativePath, '/' + relativePath);
            console.log(`   ${relativePath} → /${relativePath}`);
            return newMatch;
        });
        
        console.log(`   ✅ 完成 ${replacements} 个替换`);
        totalReplacements += replacements;
    }
});

// 写回文件
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

console.log(`\n🎉 修复完成！`);
console.log(`📊 总计修复了 ${totalReplacements} 个相对路径`);
console.log(`📁 文件已更新: ${htmlFilePath}`);

// 验证修复结果
const updatedContent = fs.readFileSync(htmlFilePath, 'utf8');
const remainingRelativePaths = updatedContent.match(/(?:src|href)="[^"/][^"]*"/g);

if (remainingRelativePaths && remainingRelativePaths.length > 0) {
    console.log(`\n⚠️  仍有 ${remainingRelativePaths.length} 个相对路径未修复:`);
    remainingRelativePaths.slice(0, 10).forEach(path => {
        console.log(`   ${path}`);
    });
    if (remainingRelativePaths.length > 10) {
        console.log(`   ... 还有 ${remainingRelativePaths.length - 10} 个`);
    }
} else {
    console.log(`\n✅ 所有相对路径已成功修复为绝对路径！`);
}
