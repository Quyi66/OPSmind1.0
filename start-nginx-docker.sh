#!/bin/bash

echo "🚀 启动OPLUS Nginx服务器..."

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，请先运行构建命令："
    echo "   npm run build:prod"
    exit 1
fi

# 检查nginx.conf是否存在
if [ ! -f "nginx.conf" ]; then
    echo "❌ nginx.conf文件不存在"
    exit 1
fi

# 停止已存在的容器
echo "🛑 停止已存在的容器..."
docker stop oplus-nginx 2>/dev/null || true
docker rm oplus-nginx 2>/dev/null || true

# 启动nginx容器
echo "📦 启动Docker容器..."
docker run -d \
  --name oplus-nginx \
  -p 8080:80 \
  -v "$(pwd)/dist:/usr/share/nginx/html:ro" \
  -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:alpine

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ OPLUS Nginx服务器启动成功！"
    echo ""
    echo "🌐 访问地址："
    echo "   普通模式: http://localhost:8080/oplus/base/"
    echo "   管理员模式: http://localhost:8080/oplus-admin/"
    echo ""
    echo "📋 管理命令："
    echo "   查看日志: docker logs -f oplus-nginx"
    echo "   停止服务: docker stop oplus-nginx"
    echo "   重启服务: docker restart oplus-nginx"
else
    echo "❌ 启动失败"
    exit 1
fi
