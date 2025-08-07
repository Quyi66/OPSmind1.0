#!/bin/bash

# OPLUS Docker镜像构建脚本
# 基于build-web目录的配置，复用已有的dist、nginx配置等
# 支持多架构构建和本地测试

set -e

# 配置变量
IMAGE_NAME="oplus-web"
IMAGE_VERSION="1.0"
REGISTRY=""  # 可选：镜像仓库地址，如 "registry.example.com/"
BACKEND_SERVER="10.1.40.112:18080"  # 默认后端服务器地址

# 多架构配置
DEFAULT_PLATFORMS="linux/amd64,linux/arm64"
BUILDER_NAME="oplus-multiarch-builder"

# 命令行参数
PLATFORMS="$DEFAULT_PLATFORMS"
PUSH_IMAGE=false
LOAD_IMAGE=false
SINGLE_ARCH=false
BUILD_ONLY=false
RUN_CONTAINER=false
BACKEND_OVERRIDE=""

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 帮助信息
show_help() {
    echo "OPLUS Docker镜像构建脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示此帮助信息"
    echo "  -p, --platforms ARCH    指定目标架构 (默认: linux/amd64,linux/arm64)"
    echo "  -r, --registry URL      指定镜像仓库地址"
    echo "  -v, --version VERSION   指定镜像版本 (默认: 1.0)"
    echo "  -b, --backend SERVER    指定后端服务器地址 (默认: $BACKEND_SERVER)"
    echo "  --push                  构建后推送到仓库"
    echo "  --load                  构建单架构镜像并加载到本地 Docker"
    echo "  --single-arch           仅构建当前架构"
    echo "  --build-only            仅构建镜像，不运行容器"
    echo "  --run                   构建完成后自动运行容器"
    echo ""
    echo "示例:"
    echo "  $0                                          # 构建多架构镜像"
    echo "  $0 --single-arch --load                     # 构建当前架构并加载到本地"
    echo "  $0 --run                                    # 构建并运行容器"
    echo "  $0 --backend 192.168.1.100:8080 --run      # 指定后端地址并运行"
    echo "  $0 --push -r registry.example.com/         # 构建并推送到仓库"
    echo ""
    echo "访问地址:"
    echo "  普通模式: http://localhost:8080/oplus/base/"
    echo "  管理员模式: http://localhost:8080/oplus-admin/"
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
        -b|--backend)
            BACKEND_OVERRIDE="$2"
            shift 2
            ;;
        --push)
            PUSH_IMAGE=true
            shift
            ;;
        --load)
            LOAD_IMAGE=true
            SINGLE_ARCH=true  # load模式强制单架构
            shift
            ;;
        --single-arch)
            SINGLE_ARCH=true
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --run)
            RUN_CONTAINER=true
            SINGLE_ARCH=true  # 运行模式强制单架构
            LOAD_IMAGE=true
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

echo -e "${BLUE}🚀 开始构建 OPLUS Docker镜像${NC}"
echo -e "${BLUE}镜像名称: ${FULL_IMAGE_NAME}:${IMAGE_VERSION}${NC}"
echo -e "${BLUE}目标架构: ${PLATFORMS}${NC}"

# 检查必要文件
echo -e "${BLUE}📋 检查必要文件...${NC}"

if [ ! -f "Dockerfile" ]; then
    echo -e "${RED}错误: Dockerfile不存在${NC}"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo -e "${RED}错误: nginx.conf不存在${NC}"
    exit 1
fi

if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${RED}错误: dist目录不存在或为空${NC}"
    echo -e "${YELLOW}请确保已经构建了前端应用并将dist目录复制到build-web目录${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 必要文件检查完成${NC}"

# 处理后端服务器地址配置
handle_backend_config() {
    local backend_addr="${BACKEND_OVERRIDE:-$BACKEND_SERVER}"

    if [ -n "$BACKEND_OVERRIDE" ]; then
        echo -e "${BLUE}🔧 配置后端服务器地址: $backend_addr${NC}"

        # 创建临时nginx配置文件
        cp nginx.conf nginx.conf.tmp

        # 替换后端服务器地址
        sed -i.bak "s|proxy_pass http://[^;]*;|proxy_pass http://$backend_addr;|g" nginx.conf.tmp

        echo -e "${GREEN}✅ 后端服务器地址已更新${NC}"
    else
        echo -e "${BLUE}使用默认后端服务器地址: $backend_addr${NC}"
        cp nginx.conf nginx.conf.tmp
    fi
}

# 检查Docker buildx是否可用
check_buildx() {
    if ! docker buildx version >/dev/null 2>&1; then
        echo -e "${RED}错误: Docker buildx 不可用，请确保Docker版本支持buildx${NC}"
        exit 1
    fi
}

# 创建或使用多架构构建器
setup_builder() {
    echo -e "${BLUE}🔧 设置多架构构建器...${NC}"

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

# 清理临时文件
cleanup() {
    if [ -f "nginx.conf.tmp" ]; then
        rm -f nginx.conf.tmp
    fi
    if [ -f "nginx.conf.tmp.bak" ]; then
        rm -f nginx.conf.tmp.bak
    fi
}

# 设置清理陷阱
trap cleanup EXIT

# 处理后端配置
handle_backend_config

# 检查Docker是否运行
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker未运行或无法访问，请启动Docker${NC}"
    exit 1
fi

echo -e "${BLUE}🐳 开始Docker镜像构建...${NC}"

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
        "-f" "Dockerfile"
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
        -f "Dockerfile" \
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

# 运行容器（如果指定了--run选项）
if [ "$RUN_CONTAINER" = true ] && [ "$BUILD_ONLY" = false ]; then
    echo -e "${BLUE}🚀 启动容器...${NC}"

    CONTAINER_NAME="oplus-web"

    # 检查容器是否存在
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${BLUE}🔍 发现已存在的容器: ${CONTAINER_NAME}${NC}"

        # 停止并删除旧容器
        echo -e "${BLUE}🗑️ 删除旧容器...${NC}"
        docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1
    fi

    # 启动新容器
    echo -e "${BLUE}📦 创建并启动新容器...${NC}"
    docker run -d \
      --name ${CONTAINER_NAME} \
      -p 8080:80 \
      --restart unless-stopped \
      --health-cmd="nginx -t && curl -f http://localhost/oplus/base/ || exit 1" \
      --health-interval=30s \
      --health-timeout=10s \
      --health-retries=3 \
      ${FULL_IMAGE_NAME}:${IMAGE_VERSION}

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
fi

# 显示使用说明
if [ "$BUILD_ONLY" = true ] || [ "$RUN_CONTAINER" = false ]; then
    echo ""
    echo -e "${BLUE}📖 使用说明:${NC}"
    if [ "$PUSH_IMAGE" = false ]; then
        echo -e "${BLUE}运行命令:${NC}"
        echo "docker run -d -p 8080:80 --name oplus-web ${FULL_IMAGE_NAME}:${IMAGE_VERSION}"
        echo ""
        echo -e "${BLUE}或者使用现有的启动脚本:${NC}"
        echo "./start-nginx.sh"
        echo ""
        echo -e "${BLUE}测试命令:${NC}"
        echo "docker run -d -p 9080:80 --name oplus-web-test ${FULL_IMAGE_NAME}:${IMAGE_VERSION}"
        echo ""
        echo -e "${BLUE}验证镜像架构:${NC}"
        echo "docker inspect ${FULL_IMAGE_NAME}:${IMAGE_VERSION} --format='{{.Architecture}}'"
    fi

    echo ""
    echo -e "${GREEN}🌐 访问地址:${NC}"
    echo -e "${GREEN}   普通模式: http://localhost:8080/oplus/base/${NC}"
    echo -e "${GREEN}   管理员模式: http://localhost:8080/oplus-admin/${NC}"
fi

echo ""
echo -e "${GREEN}✅ 构建完成${NC}"

# 清理临时文件
cleanup
