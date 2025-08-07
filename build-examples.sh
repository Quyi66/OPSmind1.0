#!/bin/bash

# Docker多架构构建示例脚本
# 展示不同的构建场景

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Docker多架构构建示例 ===${NC}"
echo ""

echo -e "${BLUE}1. 基本多架构构建（AMD64 + ARM64）${NC}"
echo "   ./build-docker.sh"
echo ""

echo -e "${BLUE}2. 仅构建当前架构${NC}"
echo "   ./build-docker.sh --single-arch"
echo ""

echo -e "${BLUE}3. 指定特定架构${NC}"
echo "   ./build-docker.sh --platforms linux/amd64"
echo "   ./build-docker.sh --platforms linux/arm64"
echo ""

echo -e "${BLUE}4. 构建并加载到本地Docker（仅单架构）${NC}"
echo "   ./build-docker.sh --load --single-arch"
echo ""

echo -e "${BLUE}5. 构建并推送到仓库${NC}"
echo "   ./build-docker.sh --push --registry registry.example.com/"
echo ""

echo -e "${BLUE}6. 指定版本号${NC}"
echo "   ./build-docker.sh --version 2.0"
echo ""

echo -e "${BLUE}7. 组合使用${NC}"
echo "   ./build-docker.sh --platforms linux/amd64,linux/arm64 --push --registry myregistry.com/ --version 1.2.0"
echo ""

echo -e "${YELLOW}注意事项:${NC}"
echo "- 多架构构建需要Docker buildx支持"
echo "- --load选项只支持单架构构建"
echo "- --push选项会将镜像推送到指定仓库"
echo "- 确保build/nginx.conf文件存在"
echo "- 确保dist目录已构建或将自动构建"
echo ""

echo -e "${GREEN}选择一个示例运行，或查看帮助信息:${NC}"
echo "./build-docker.sh --help"
