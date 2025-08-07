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

# 检查Docker是否运行
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker未运行或无法访问，请启动Docker"
    exit 1
fi

# 检查容器是否存在
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "🔍 发现已存在的容器: ${CONTAINER_NAME}"

    # 检查容器是否正在运行
    if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo "⚡ 容器已在运行，执行重启操作..."
        echo "🔄 重启容器以应用最新配置..."
        docker restart ${CONTAINER_NAME}
        if [ $? -eq 0 ]; then
            echo "✅ 容器重启成功！"
        else
            echo "❌ 容器重启失败"
            exit 1
        fi
    else
        echo "🚀 启动已存在的容器..."
        docker start ${CONTAINER_NAME}
        echo "✅ 容器启动成功！"
    fi
else
    echo "📦 容器不存在，创建新容器..."

    # 启动nginx容器
    echo "🚀 创建并启动新容器..."
    docker run -d \
      --name ${CONTAINER_NAME} \
      -p 8080:80 \
      -v "$(pwd)/dist:/usr/share/nginx/html:ro" \
      -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
      --restart unless-stopped \
      --health-cmd="nginx -t && curl -f http://localhost/oplus/base/ || exit 1" \
      --health-interval=30s \
      --health-timeout=10s \
      --health-retries=3 \
      nginx:alpine
    echo "✅ 容器创建并启动成功！"
fi

echo ""
echo "🌐 访问地址："
echo "   普通模式: http://localhost:8080/oplus/base/"
echo "   管理员模式: http://localhost:8080/oplus-admin/"
echo ""
echo "� 容器状态："
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "�📋 管理命令："
echo "   查看日志: docker logs -f ${CONTAINER_NAME}"
echo "   停止服务: docker stop ${CONTAINER_NAME}"
echo "   重启服务: docker restart ${CONTAINER_NAME}"
echo "   删除容器: docker rm -f ${CONTAINER_NAME}"
echo ""
echo "💡 重启说明："
echo "   再次运行此脚本会自动重启容器以应用最新配置"
echo "   容器配置了自动重启策略(unless-stopped)"
