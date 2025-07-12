#!/bin/bash

# 检查 caddy 二进制文件是否存在
if [ ! -f "caddy" ]; then
    echo "❌ 错误：caddy 二进制文件不存在"
    echo "请确保 caddy 文件在当前目录中"
    exit 1
fi

# 赋予 caddy 可执行权限
chmod +x caddy

echo "🚀 启动 Caddy API 代理服务器..."
echo "🔄 代理规则: /local-portal/api/* -> http://10.1.40.112/oplus-portal/api/*"
echo "🌐 代理地址: http://localhost:8080"
echo "📝 详细日志: DEBUG 级别，包含请求详情"
echo "⏹️  停止服务: Ctrl+C"
echo ""
echo "📊 日志说明："
echo "  - 🔵 INFO: 服务器启动和基本信息"
echo "  - 🟡 WARN: 警告信息（配置优化建议）"
echo "  - 🔴 ERROR: 错误信息（连接失败等）"
echo "  - 🟢 DEBUG: 详细请求信息"
echo ""

# 启动 Caddy（使用环境变量启用详细日志）
CADDY_LOG_LEVEL=DEBUG ./caddy run --config Caddyfile 