#!/bin/bash

# OPLUS 快速构建脚本
# 用于快速构建和测试Docker镜像

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

IMAGE_NAME="oplus-web"
CONTAINER_NAME="oplus-web"

echo -e "${BLUE}🚀 OPLUS 快速构建和部署${NC}"

# 检查必要文件
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${RED}❌ dist目录不存在或为空${NC}"
    echo -e "${YELLOW}请确保已经构建了前端应用并将dist目录复制到build-web目录${NC}"
    exit 1
fi

# 检查Docker是否运行
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker未运行或无法访问，请启动Docker${NC}"
    exit 1
fi

# 停止并删除旧容器
echo -e "${BLUE}🧹 清理旧容器...${NC}"
docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true

# 删除旧镜像
echo -e "${BLUE}🗑️ 清理旧镜像...${NC}"
docker rmi ${IMAGE_NAME}:latest >/dev/null 2>&1 || true

# 构建新镜像
echo -e "${BLUE}🔨 构建Docker镜像...${NC}"
docker build -t ${IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 镜像构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 镜像构建成功${NC}"

# 启动容器
echo -e "${BLUE}🚀 启动容器...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  -p 8080:80 \
  --restart unless-stopped \
  ${IMAGE_NAME}:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 容器启动成功！${NC}"
    
    # 等待容器启动
    echo -e "${BLUE}⏳ 等待容器启动...${NC}"
    sleep 3
    
    # 检查容器状态
    echo -e "${BLUE}📊 容器状态：${NC}"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo -e "${GREEN}🌐 访问地址：${NC}"
    echo -e "${GREEN}   普通模式: http://localhost:8080/oplus/base/${NC}"
    echo -e "${GREEN}   管理员模式: http://localhost:8080/oplus-admin/${NC}"
    echo ""
    echo -e "${BLUE}📋 管理命令：${NC}"
    echo "   查看日志: docker logs -f ${CONTAINER_NAME}"
    echo "   停止服务: docker stop ${CONTAINER_NAME}"
    echo "   重启服务: docker restart ${CONTAINER_NAME}"
    echo "   删除容器: docker rm -f ${CONTAINER_NAME}"
else
    echo -e "${RED}❌ 容器启动失败${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 快速构建完成${NC}"
