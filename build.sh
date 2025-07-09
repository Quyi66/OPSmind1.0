#!/bin/bash
set -e

echo "[build.sh] 使用 Docker 进行编译..."

echo "用法："
echo "  bash build.sh dist   # 打包，产物在 output 目录"
echo "  bash build.sh dev    # 开发模式，浏览器访问 http://localhost:8888"

MODE=${1:-dist}

# 确保输出目录存在
mkdir -p output

# 检查镜像是否存在，不存在则构建
if ! docker images | grep -q "oplus-angular-build"; then
  echo "[build.sh] Docker 镜像不存在，开始构建..."
  docker build --no-cache -t oplus-angular-build .
else
  echo "[build.sh] Docker 镜像已存在，跳过构建。"
fi

if [ "$MODE" = "dev" ]; then
  echo "[build.sh] 启动开发模式..."
  echo "[build.sh] 先安装bower依赖..."
  docker run --rm \
    -v "$PWD":/app \
    -v "$PWD/output":/app/output \
    oplus-angular-build bash -c "cd /app && bower install --allow-root"
  
  echo "[build.sh] 构建项目文件..."
  docker run --rm \
    -v "$PWD":/app \
    -v "$PWD/output":/app/output \
    oplus-angular-build npm run dist
  
  echo "[build.sh] 启动开发服务器..."
  docker run --rm -it \
    -p 8888:8888 \
    -p 35729:35729 \
    -v "$PWD":/app \
    -v "$PWD/output":/app/output \
    oplus-angular-build npm run serve
else
  echo "[build.sh] 开始打包..."
  echo "[build.sh] 先安装bower依赖..."
  docker run --rm \
    -v "$PWD":/app \
    -v "$PWD/output":/app/output \
    oplus-angular-build bash -c "cd /app && bower install --allow-root"
  
  docker run --rm \
    -v "$PWD":/app \
    -v "$PWD/output":/app/output \
    oplus-angular-build npm run dist
fi

echo "[build.sh] 完成。" 