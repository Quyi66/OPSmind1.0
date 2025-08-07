#!/bin/bash

# Docker多架构镜像构建脚本
# 支持 AMD64 和 ARM64 架构
# 复用build目录中的配置

set -e

# 配置变量
IMAGE_NAME="oplus-web"
IMAGE_VERSION="1.0"
DOCKERFILE_PATH="test-package/Dockerfile"
REGISTRY=""  # 可选：镜像仓库地址，如 "registry.example.com/"

# 多架构配置
DEFAULT_PLATFORMS="linux/amd64,linux/arm64"
BUILDER_NAME="oplus-multiarch-builder"

# 命令行参数
PLATFORMS="$DEFAULT_PLATFORMS"
PUSH_IMAGE=false
LOAD_IMAGE=false
SINGLE_ARCH=false

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示此帮助信息"
    echo "  -p, --platforms ARCH    指定目标架构 (默认: linux/amd64,linux/arm64)"
    echo "  -r, --registry URL      指定镜像仓库地址"
    echo "  -v, --version VERSION   指定镜像版本 (默认: 1.0)"
    echo "  --push                  构建后推送到仓库"
    echo "  --load                  构建单架构镜像并加载到本地 Docker"
    echo "  --single-arch           仅构建当前架构"
    echo ""
    echo "示例:"
    echo "  $0                                    # 构建多架构镜像"
    echo "  $0 --single-arch                     # 仅构建当前架构"
    echo "  $0 --platforms linux/amd64          # 仅构建 AMD64"
    echo "  $0 --push -r registry.example.com/  # 构建并推送到仓库"
    echo "  $0 --load                           # 构建并加载到本地"
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--platforms)
            PLATFORMS="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -v|--version)
            IMAGE_VERSION="$2"
            shift 2
            ;;
        --push)
            PUSH_IMAGE=true
            shift
            ;;
        --load)
            LOAD_IMAGE=true
            shift
            ;;
        --single-arch)
            SINGLE_ARCH=true
            shift
            ;;
        *)
            echo -e "${RED}未知选项: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# 检测当前架构
detect_current_arch() {
    local arch=$(uname -m)
    case $arch in
        x86_64)
            echo "linux/amd64"
            ;;
        aarch64|arm64)
            echo "linux/arm64"
            ;;
        *)
            echo -e "${YELLOW}警告: 未知架构 $arch，默认使用 linux/amd64${NC}"
            echo "linux/amd64"
            ;;
    esac
}

# 如果指定了单架构模式，使用当前架构
if [ "$SINGLE_ARCH" = true ]; then
    PLATFORMS=$(detect_current_arch)
    echo -e "${BLUE}单架构模式: $PLATFORMS${NC}"
fi

# 构建完整镜像名称
build_image_name() {
    if [ -n "$REGISTRY" ]; then
        echo "${REGISTRY}${IMAGE_NAME}"
    else
        echo "${IMAGE_NAME}"
    fi
}

# 获取完整镜像名称
FULL_IMAGE_NAME=$(build_image_name)

echo -e "${BLUE}开始构建 ${FULL_IMAGE_NAME}:${IMAGE_VERSION}${NC}"
echo -e "${BLUE}目标架构: ${PLATFORMS}${NC}"

# 检查必要文件
if [ ! -f "$DOCKERFILE_PATH" ]; then
    echo -e "${RED}错误: Dockerfile不存在: $DOCKERFILE_PATH${NC}"
    exit 1
fi

if [ ! -f "nginx-config/production.conf" ]; then
    echo -e "${RED}错误: nginx配置文件不存在: nginx-config/production.conf${NC}"
    echo -e "${YELLOW}提示: 请确保nginx配置文件存在于nginx-config目录中${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: package.json不存在${NC}"
    exit 1
fi

# 检查Docker buildx是否可用
check_buildx() {
    if ! docker buildx version >/dev/null 2>&1; then
        echo -e "${RED}错误: Docker buildx 不可用，请确保Docker版本支持buildx${NC}"
        exit 1
    fi
}

# 创建或使用多架构构建器
setup_builder() {
    echo -e "${BLUE}设置多架构构建器...${NC}"

    # 检查构建器是否已存在
    if docker buildx inspect "$BUILDER_NAME" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 构建器 $BUILDER_NAME 已存在${NC}"
    else
        echo -e "${BLUE}创建新的构建器 $BUILDER_NAME...${NC}"
        docker buildx create --name "$BUILDER_NAME" --driver docker-container --bootstrap
    fi

    # 使用构建器
    docker buildx use "$BUILDER_NAME"
    echo -e "${GREEN}✅ 构建器设置完成${NC}"
}

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

# 检查是否需要多架构构建
if [[ "$PLATFORMS" == *","* ]] || [ "$PUSH_IMAGE" = true ]; then
    # 多架构构建或推送模式
    check_buildx
    setup_builder

    echo -e "${BLUE}开始多架构Docker镜像构建...${NC}"

    # 构建命令参数
    BUILD_ARGS=(
        "buildx" "build"
        "--platform" "$PLATFORMS"
        "-f" "$DOCKERFILE_PATH"
        "-t" "${FULL_IMAGE_NAME}:${IMAGE_VERSION}"
        "-t" "${FULL_IMAGE_NAME}:latest"
    )

    # 添加推送或加载选项
    if [ "$PUSH_IMAGE" = true ]; then
        BUILD_ARGS+=("--push")
        echo -e "${BLUE}将推送到仓库: ${REGISTRY}${NC}"
    elif [ "$LOAD_IMAGE" = true ]; then
        # 加载模式只支持单架构
        if [[ "$PLATFORMS" == *","* ]]; then
            echo -e "${YELLOW}警告: --load 只支持单架构，将使用指定的第一个架构${NC}"
            PLATFORMS=$(echo "$PLATFORMS" | cut -d',' -f1)
            echo -e "${BLUE}使用架构: ${PLATFORMS}${NC}"
        fi
        # 更新平台参数
        BUILD_ARGS[3]="$PLATFORMS"
        BUILD_ARGS+=("--load")
    fi

    BUILD_ARGS+=(".")

    # 执行构建
    docker "${BUILD_ARGS[@]}"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 多架构Docker镜像构建成功${NC}"
        if [ "$PUSH_IMAGE" = true ]; then
            echo -e "${GREEN}✅ 镜像已推送到仓库${NC}"
        fi
    else
        echo -e "${RED}❌ 多架构Docker镜像构建失败${NC}"
        exit 1
    fi

else
    # 单架构构建（传统模式）
    echo -e "${BLUE}开始单架构Docker镜像构建...${NC}"
    echo -e "${BLUE}目标平台: ${PLATFORMS}${NC}"

    # 构建命令，添加平台参数
    docker build \
        --platform "$PLATFORMS" \
        -f "$DOCKERFILE_PATH" \
        -t "${FULL_IMAGE_NAME}:${IMAGE_VERSION}" \
        -t "${FULL_IMAGE_NAME}:latest" \
        .

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker镜像构建成功${NC}"
        echo -e "${BLUE}镜像信息:${NC}"
        docker images | grep "${IMAGE_NAME}"

        # 验证镜像架构
        echo -e "${BLUE}镜像架构信息:${NC}"
        docker inspect "${FULL_IMAGE_NAME}:${IMAGE_VERSION}" --format='{{.Architecture}}'
    else
        echo -e "${RED}❌ Docker镜像构建失败${NC}"
        exit 1
    fi
fi

# 显示使用说明
echo ""
echo -e "${BLUE}使用说明:${NC}"
if [ "$PUSH_IMAGE" = false ]; then
    echo -e "${BLUE}运行命令:${NC}"
    echo "docker run -d -p 80:80 --name oplus-web ${FULL_IMAGE_NAME}:${IMAGE_VERSION}"
    echo ""
    echo -e "${BLUE}测试命令:${NC}"
    echo "docker run -d -p 8080:80 --name oplus-web-test ${FULL_IMAGE_NAME}:${IMAGE_VERSION}"
    echo ""
    echo -e "${BLUE}验证镜像架构:${NC}"
    echo "docker inspect ${FULL_IMAGE_NAME}:${IMAGE_VERSION} --format='{{.Architecture}}'"
fi

echo ""
echo -e "${GREEN}✅ 构建完成${NC}"
