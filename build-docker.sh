#!/bin/bash

# 简化的Docker镜像构建脚本
# 复用build目录中的配置

set -e

# 配置变量
IMAGE_NAME="oplus-web"
IMAGE_VERSION="1.0"
DOCKERFILE_PATH="test-package/Dockerfile"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}开始构建 ${IMAGE_NAME}:${IMAGE_VERSION}${NC}"

# 检查必要文件
if [ ! -f "$DOCKERFILE_PATH" ]; then
    echo -e "${RED}错误: Dockerfile不存在: $DOCKERFILE_PATH${NC}"
    exit 1
fi

if [ ! -f "build/nginx.conf" ]; then
    echo -e "${RED}错误: nginx.conf不存在: build/nginx.conf${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: package.json不存在${NC}"
    exit 1
fi

# 先构建前端应用
echo -e "${BLUE}构建前端应用...${NC}"
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${BLUE}dist目录不存在或为空，开始构建...${NC}"
    npm ci
    npm run build

    if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
        echo -e "${RED}错误: 前端构建失败，dist目录为空${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 前端构建完成${NC}"
else
    echo -e "${GREEN}✅ 发现已存在的dist目录，跳过构建${NC}"
fi

# 构建Docker镜像
echo -e "${BLUE}构建Docker镜像...${NC}"
docker build \
    -f "$DOCKERFILE_PATH" \
    -t "${IMAGE_NAME}:${IMAGE_VERSION}" \
    -t "${IMAGE_NAME}:latest" \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker镜像构建成功${NC}"
    echo -e "${BLUE}镜像信息:${NC}"
    docker images | grep "${IMAGE_NAME}"
    echo ""
    echo -e "${BLUE}运行命令:${NC}"
    echo "docker run -d -p 80:80 --name oplus-web ${IMAGE_NAME}:${IMAGE_VERSION}"
    echo ""
    echo -e "${BLUE}测试命令:${NC}"
    echo "docker run -d -p 8080:80 --name oplus-web-test ${IMAGE_NAME}:${IMAGE_VERSION}"
else
    echo -e "${RED}❌ Docker镜像构建失败${NC}"
    exit 1
fi
