#!/bin/bash

# 简化的Docker镜像构建脚本
# 复用build目录中的配置

set -e

# 配置变量
IMAGE_NAME="oplus-web"
BUILD_CONTEXT="."
VERSION="1.1.12"   # 配置的版本号
# TAG 直接使用配置的 VERSION，而不是 latest
TAG="$VERSION"

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -n, --name NAME     设置镜像名称 (默认: oplus-web)"
    echo "  -t, --tag TAG       设置镜像标签 (默认: ${VERSION})"
    echo "  -h, --help          显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                           # 使用默认设置构建"
    echo "  $0 -n myapp -t v1.0.0        # 构建名为myapp:v1.0.0的镜像"
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}错误: 未知参数 $1${NC}"
            show_help
            exit 1
            ;;
    esac
done


# 检查Docker buildx
echo -e "${YELLOW}检查Docker buildx支持...${NC}"
if ! docker buildx version > /dev/null 2>&1; then
    echo -e "${RED}错误: Docker buildx不可用！${NC}"
    echo "请确保Docker版本支持buildx或启用实验性功能"
    exit 1
fi

# 创建并使用buildx构建器
echo -e "${YELLOW}设置多架构构建器...${NC}"
docker buildx create --name multiarch-builder --use --bootstrap > /dev/null 2>&1 || true

# 显示构建信息
echo -e "${GREEN}开始构建多架构Docker镜像...${NC}"
echo "镜像名称: ${IMAGE_NAME}:${TAG}"
echo "版本号: ${VERSION}"
echo "支持架构: linux/amd64, linux/arm64"
echo "构建上下文: ${BUILD_CONTEXT}"
echo ""

# 构建多架构镜像并导出
echo -e "${YELLOW}构建AMD64架构镜像...${NC}"
docker buildx build \
    --platform linux/amd64 \
    --tag "${IMAGE_NAME}:${TAG}" \
    --tag "${IMAGE_NAME}:${VERSION}" \
    --load \
    "${BUILD_CONTEXT}"

AMD64_SUCCESS=$?

echo -e "${YELLOW}构建ARM64架构镜像...${NC}"
docker buildx build \
    --platform linux/arm64 \
    --tag "${IMAGE_NAME}:${TAG}-arm64" \
    --tag "${IMAGE_NAME}:${VERSION}-arm64" \
    --load \
    "${BUILD_CONTEXT}"

ARM64_SUCCESS=$?

# 检查构建结果
if [ $AMD64_SUCCESS -ne 0 ] && [ $ARM64_SUCCESS -ne 0 ]; then
    echo -e "${RED}❌ 所有架构镜像构建失败！${NC}"
    exit 1
elif [ $AMD64_SUCCESS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  AMD64镜像构建失败，仅构建ARM64镜像${NC}"
    # 如果AMD64失败，将ARM64作为默认镜像
    if [ $ARM64_SUCCESS -eq 0 ]; then
        docker tag "${IMAGE_NAME}:${TAG}-arm64" "${IMAGE_NAME}:${TAG}"
        echo "使用ARM64镜像作为默认标签"
    fi
elif [ $ARM64_SUCCESS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  ARM64镜像构建失败，仅构建AMD64镜像${NC}"
fi

echo ""
echo -e "${GREEN}✅ 镜像构建完成！${NC}"

# 导出镜像文件
echo -e "${YELLOW}导出镜像文件...${NC}"

# 确保build目录存在
mkdir -p build

if [ $AMD64_SUCCESS -eq 0 ]; then
    echo "导出AMD64镜像..."
    docker save "${IMAGE_NAME}:${TAG}" -o "build/${IMAGE_NAME}-${VERSION}.tar"
    AMD64_SIZE=$(du -h "build/${IMAGE_NAME}-${VERSION}.tar" | cut -f1)
fi

if [ $ARM64_SUCCESS -eq 0 ]; then
    echo "导出ARM64镜像..."
    docker save "${IMAGE_NAME}:${TAG}-arm64" -o "build/${IMAGE_NAME}-${VERSION}-arm64.tar"
    ARM64_SIZE=$(du -h "build/${IMAGE_NAME}-${VERSION}-arm64.tar" | cut -f1)
fi

echo ""
echo -e "${GREEN}✅ 镜像导出完成！${NC}"
echo "导出文件:"
[ $AMD64_SUCCESS -eq 0 ] && echo "  build/${IMAGE_NAME}-${VERSION}.tar (${AMD64_SIZE})"
[ $ARM64_SUCCESS -eq 0 ] && echo "  build/${IMAGE_NAME}-${VERSION}-arm64.tar (${ARM64_SIZE})"
echo ""
echo "本地镜像:"
echo "  ${IMAGE_NAME}:${TAG} (默认 - AMD64)"
echo "  ${IMAGE_NAME}:${VERSION} (版本标签 - AMD64)"
[ $ARM64_SUCCESS -eq 0 ] && echo "  ${IMAGE_NAME}:${TAG}-arm64"
[ $ARM64_SUCCESS -eq 0 ] && echo "  ${IMAGE_NAME}:${VERSION}-arm64"
echo ""
echo "运行容器 (通过环境变量覆盖后端地址):"
echo "  docker run -d -p 80:80 -e BACKEND_URL=http://backend.example.com:8080 --name oplus-web ${IMAGE_NAME}:${TAG}"
