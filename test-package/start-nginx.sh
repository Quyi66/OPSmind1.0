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

CONTAINER_NAME="oplus-nginx"

# 检查容器是否存在
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "� 发现已存在的容器: ${CONTAINER_NAME}"

    # 检查容器是否正在运行
    if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo "✅ 容器已在运行"
        echo "🌐 访问地址："
        echo "   普通模式: http://localhost:8080/oplus/base/"
        echo "   管理员模式: http://localhost:8080/oplus-admin/"
        exit 0
    else
        echo "🚀 启动已存在的容器..."
        docker start ${CONTAINER_NAME}
        echo "✅ 容器启动成功！"
    fi
else
    echo "📦 容器不存在，创建新容器..."

    # 启动nginx容器
    echo "� 创建并启动新容器..."
    docker run -d \
      --name ${CONTAINER_NAME} \
      -p 8080:80 \
      -v "$(pwd)/dist:/usr/share/nginx/html:ro" \
      -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
      nginx:alpine
    echo "✅ 容器创建并启动成功！"
fi

echo ""
echo "🌐 访问地址："
echo "   普通模式: http://localhost:8080/oplus/base/"
echo "   管理员模式: http://localhost:8080/oplus-admin/"
echo ""
echo "📋 管理命令："
echo "   查看日志: docker logs -f ${CONTAINER_NAME}"
echo "   停止服务: docker stop ${CONTAINER_NAME}"
echo "   重启服务: docker restart ${CONTAINER_NAME}"
