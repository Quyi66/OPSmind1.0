#!/bin/bash

# Oplus Web Docker 打包脚本
# 将Docker镜像和相关文件打包成发布包

set -e

# 配置变量
IMAGE_NAME="oplus-web"
IMAGE_VERSION="1.0"
PACKAGE_NAME="oplus-web-docker-${IMAGE_VERSION}"
PACKAGE_DIR="./packages"
TEMP_DIR="${PACKAGE_DIR}/${PACKAGE_NAME}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "Oplus Web Docker 打包脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示帮助信息"
    echo "  -v, --version VERSION   指定镜像版本 (默认: 1.0)"
    echo "  -o, --output DIR        指定输出目录 (默认: ./packages)"
    echo "  --no-compress           不压缩打包文件"
    echo "  --clean                 清理旧的打包文件"
    echo ""
    echo "示例:"
    echo "  $0                      # 默认打包"
    echo "  $0 -v 1.1               # 指定版本"
    echo "  $0 -o /tmp/packages     # 指定输出目录"
    echo "  $0 --clean              # 清理后打包"
}

# 检查Docker镜像是否存在
check_image() {
    if ! docker images | grep -q "${IMAGE_NAME}.*${IMAGE_VERSION}"; then
        log_error "Docker镜像 ${IMAGE_NAME}:${IMAGE_VERSION} 不存在"
        log_info "请先运行构建脚本: ./build-docker-simple.sh"
        exit 1
    fi
    log_info "找到Docker镜像: ${IMAGE_NAME}:${IMAGE_VERSION}"
}

# 创建打包目录
create_package_dir() {
    log_info "创建打包目录: ${TEMP_DIR}"
    
    # 清理旧目录
    if [ -d "${TEMP_DIR}" ]; then
        rm -rf "${TEMP_DIR}"
    fi
    
    # 创建新目录
    mkdir -p "${TEMP_DIR}"
    
    log_success "打包目录创建完成"
}

# 导出Docker镜像
export_docker_image() {
    local image_file="${TEMP_DIR}/${IMAGE_NAME}-${IMAGE_VERSION}.tar"
    
    log_info "导出Docker镜像到: ${image_file}"
    
    docker save -o "${image_file}" "${IMAGE_NAME}:${IMAGE_VERSION}"
    
    if [ -f "${image_file}" ]; then
        local file_size=$(du -h "${image_file}" | cut -f1)
        log_success "镜像导出完成，大小: ${file_size}"
    else
        log_error "镜像导出失败"
        exit 1
    fi
}

# 复制配置文件
copy_configs() {
    log_info "复制配置文件..."
    
    # 复制nginx配置
    if [ -d "nginx-config" ]; then
        cp -r nginx-config "${TEMP_DIR}/"
        log_info "✓ 复制nginx配置文件"
    else
        log_warning "nginx-config目录不存在"
    fi
    
    # 复制部署脚本
    if [ -f "deploy.sh" ]; then
        cp deploy.sh "${TEMP_DIR}/"
        chmod +x "${TEMP_DIR}/deploy.sh"
        log_info "✓ 复制部署脚本"
    else
        log_warning "deploy.sh文件不存在"
    fi
    
    log_success "配置文件复制完成"
}

# 复制文档
copy_docs() {
    log_info "复制文档文件..."
    
    # 复制部署文档
    if [ -f "DEPLOYMENT.md" ]; then
        cp DEPLOYMENT.md "${TEMP_DIR}/"
        log_info "✓ 复制部署文档"
    fi
    
    # 复制构建总结
    if [ -f "BUILD-SUMMARY.md" ]; then
        cp BUILD-SUMMARY.md "${TEMP_DIR}/"
        log_info "✓ 复制构建总结"
    fi
    
    log_success "文档复制完成"
}

# 创建版本信息文件
create_version_info() {
    local version_file="${TEMP_DIR}/VERSION"
    
    log_info "创建版本信息文件..."
    
    cat > "${version_file}" << EOF
IMAGE_NAME=${IMAGE_NAME}
IMAGE_VERSION=${IMAGE_VERSION}
BUILD_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BUILD_HOST=$(hostname)
BUILD_USER=$(whoami)
DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
EOF

    log_success "版本信息文件创建完成"
}

# 压缩打包
compress_package() {
    local compress_enabled="$1"
    
    if [ "$compress_enabled" = "false" ]; then
        log_info "跳过压缩步骤"
        return 0
    fi
    
    log_info "压缩打包文件..."
    
    cd "${PACKAGE_DIR}"
    
    # 创建tar.gz压缩包
    tar -czf "${PACKAGE_NAME}.tar.gz" "${PACKAGE_NAME}"
    
    if [ -f "${PACKAGE_NAME}.tar.gz" ]; then
        local compressed_size=$(du -h "${PACKAGE_NAME}.tar.gz" | cut -f1)
        local original_size=$(du -sh "${PACKAGE_NAME}" | cut -f1)
        
        log_success "压缩完成"
        log_info "原始大小: ${original_size}"
        log_info "压缩后大小: ${compressed_size}"
        log_info "压缩包: ${PACKAGE_DIR}/${PACKAGE_NAME}.tar.gz"
    else
        log_error "压缩失败"
        exit 1
    fi
    
    cd - > /dev/null
}

# 清理临时文件
cleanup() {
    local keep_temp="$1"
    
    if [ "$keep_temp" = "true" ]; then
        log_info "保留临时目录: ${TEMP_DIR}"
        return 0
    fi
    
    log_info "清理临时文件..."
    
    if [ -d "${TEMP_DIR}" ]; then
        rm -rf "${TEMP_DIR}"
        log_success "临时文件清理完成"
    fi
}

# 显示打包结果
show_result() {
    local compress_enabled="$1"
    
    echo ""
    log_success "打包完成！"
    echo ""
    
    if [ "$compress_enabled" = "true" ]; then
        log_info "压缩包位置: ${PACKAGE_DIR}/${PACKAGE_NAME}.tar.gz"
        echo ""
        log_info "解压命令:"
        echo "  tar -xzf ${PACKAGE_NAME}.tar.gz"
        echo "  cd ${PACKAGE_NAME}"
    else
        log_info "打包目录: ${TEMP_DIR}"
        echo ""
        log_info "进入目录:"
        echo "  cd ${TEMP_DIR}"
    fi
    
    echo ""
    log_info "部署命令:"
    echo "  docker load -i ${IMAGE_NAME}-${IMAGE_VERSION}.tar"
    echo "  ./deploy.sh"
}

# 主函数
main() {
    local compress_enabled="true"
    local clean_first="false"
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                IMAGE_VERSION="$2"
                PACKAGE_NAME="oplus-web-docker-${IMAGE_VERSION}"
                TEMP_DIR="${PACKAGE_DIR}/${PACKAGE_NAME}"
                shift 2
                ;;
            -o|--output)
                PACKAGE_DIR="$2"
                TEMP_DIR="${PACKAGE_DIR}/${PACKAGE_NAME}"
                shift 2
                ;;
            --no-compress)
                compress_enabled="false"
                shift
                ;;
            --clean)
                clean_first="true"
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    log_info "开始打包 ${IMAGE_NAME}:${IMAGE_VERSION}"
    
    # 清理旧文件（如果需要）
    if [ "$clean_first" = "true" ]; then
        log_info "清理旧的打包文件..."
        rm -rf "${PACKAGE_DIR}/${PACKAGE_NAME}"*
        log_success "清理完成"
    fi
    
    # 执行打包流程
    check_image
    create_package_dir
    export_docker_image
    copy_configs
    copy_docs
    create_version_info
    compress_package "$compress_enabled"
    cleanup "$compress_enabled"
    show_result "$compress_enabled"
}

# 执行主函数
main "$@"
