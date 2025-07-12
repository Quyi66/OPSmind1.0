#!/bin/bash

# Oplus前端开发工具
# 前后台分离项目 - 前端构建与开发环境

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="oplus-frontend"
DEV_PORT=3000
DIST_PATH="output"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Node.js环境
check_node_env() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js未安装，请先安装Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm未安装，请先安装npm"
        exit 1
    fi
    
    log_info "Node.js版本: $(node --version)"
    log_info "npm版本: $(npm --version)"
}

# 安装依赖
install_deps() {
    log_info "检查并安装依赖..."
    
    if [ ! -d "node_modules" ]; then
        log_info "node_modules目录不存在，开始安装依赖..."
        npm install
    else
        log_info "node_modules已存在，跳过依赖安装"
    fi
    
    # 检查gulp是否安装
    if ! command -v gulp &> /dev/null; then
        log_info "gulp未全局安装，使用本地gulp"
        GULP_CMD="npx gulp"
    else
        GULP_CMD="gulp"
    fi
}

# 构建生产版本
build_dist() {
    log_info "开始构建生产版本..."
    check_node_env
    install_deps
    
    # 清理输出目录
    if [ -d "$DIST_PATH" ]; then
        rm -rf "$DIST_PATH"
        log_info "清理输出目录: $DIST_PATH"
    fi
    
    # 执行构建
    $GULP_CMD dist-modules
    
    log_success "生产版本构建完成！"
    log_info "构建文件位于: $DIST_PATH"
}

# 启动开发服务器
start_dev_server() {
    log_info "启动开发服务器..."
    check_node_env
    install_deps
    
    log_info "开发服务器将在端口 $DEV_PORT 启动"
    log_info "访问地址: http://localhost:$DEV_PORT"
    
    # 启动开发服务器
    $GULP_CMD serve
}

# 清理构建文件
clean_build() {
    log_info "清理构建文件..."
    
    if [ -d "$DIST_PATH" ]; then
        rm -rf "$DIST_PATH"
        log_success "已清理输出目录: $DIST_PATH"
    fi
    
    if [ -d "node_modules" ]; then
        log_warn "发现node_modules目录，是否要清理？(y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
            rm -rf node_modules
            log_success "已清理node_modules目录"
        fi
    fi
    
    log_success "清理完成！"
}

# 显示帮助信息
show_help() {
    cat << EOF
Oplus前端开发工具 - 前后台分离项目

用法:
    bash docker.sh <command>

命令:
    dist        构建生产版本 (gulp dist-modules)
    serve       启动开发服务器 (gulp serve)
    clean       清理构建文件
    help        显示帮助信息

示例:
    bash docker.sh dist     # 构建生产版本
    bash docker.sh serve    # 启动开发服务器
    bash docker.sh clean    # 清理构建文件

开发流程:
    1. 开发时使用: bash docker.sh serve
    2. 构建时使用: bash docker.sh dist
    3. 清理时使用: bash docker.sh clean

EOF
}

# 主函数
main() {
    case "${1:-help}" in
        "dist")
            build_dist
            ;;
        "serve")
            start_dev_server
            ;;
        "clean")
            clean_build
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口
main "$@" 