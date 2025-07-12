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
echo "📝 详细日志: DEBUG 级别，包含每个API请求的详情"
echo "⏹️  停止服务: Ctrl+C"
echo ""
echo "📊 日志说明："
echo "  - 🔵 INFO: 服务器启动和基本信息"
echo "  - 🟡 WARN: 警告信息（配置优化建议）"
echo "  - 🔴 ERROR: 错误信息（连接失败等）"
echo "  - 🟢 DEBUG: 详细请求信息（HTTP方法、URL、状态码、响应时间等）"
echo "  - 📋 ACCESS: 每个API请求的访问日志"
echo ""
echo "🧪 测试命令："
echo "  curl -X GET http://localhost:8080/local-portal/api/health"
echo "  curl -X POST http://localhost:8080/local-portal/api/test"
echo ""
echo "📄 日志格式说明："
echo "  [时间戳] [级别] [模块] 消息内容"
echo "  每个API请求都会显示: 请求方法 URL 响应状态码 响应时间"
echo ""
echo "Starting Caddy with enhanced logging..."
echo "=========================================="

# 启动 Caddy（使用环境变量启用详细日志）
CADDY_LOG_LEVEL=DEBUG ./caddy run --config Caddyfile 