#!/bin/bash

# Docker开发环境管理脚本

case "$1" in
    "start")
        echo "启动Docker开发环境..."
        docker-compose up -d
        echo "环境已启动，使用 'docker exec -it oplus-modules-dev bash' 进入容器"
        ;;
    "stop")
        echo "停止Docker开发环境..."
        docker-compose down
        ;;
    "restart")
        echo "重启Docker开发环境..."
        docker-compose restart
        ;;
    "build")
        echo "构建Docker镜像..."
        docker-compose build
        ;;
    "shell")
        echo "进入容器shell..."
        docker exec -it oplus-modules-dev bash
        ;;
    "install")
        echo "在容器中安装依赖..."
        docker exec -it oplus-modules-dev bash -c "npm install"
        ;;
    "gulp")
        shift
        echo "在容器中运行gulp任务: $@"
        docker exec -it oplus-modules-dev bash -c "gulp $@"
        ;;
    "serve")
        echo "启动开发服务器..."
        docker exec -it oplus-modules-dev bash -c "gulp serve"
        ;;
    "dist")
        echo "构建项目..."
        docker exec -it oplus-modules-dev bash -c "gulp dist-modules"
        ;;
    *)
        echo "用法: $0 {start|stop|restart|build|shell|install|gulp|serve|dist}"
        echo ""
        echo "命令说明:"
        echo "  start   - 启动Docker开发环境"
        echo "  stop    - 停止Docker开发环境"
        echo "  restart - 重启Docker开发环境"
        echo "  build   - 构建Docker镜像"
        echo "  shell   - 进入容器shell"
        echo "  install - 安装npm和bower依赖"
        echo "  gulp    - 运行gulp任务 (例如: ./docker-dev.sh gulp dist-modules)"
        echo "  serve   - 启动开发服务器"
        echo "  dist    - 构建项目"
        exit 1
        ;;
esac 