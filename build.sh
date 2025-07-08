#!/bin/bash
set -e

echo "[build.sh] 使用 Docker 进行编译..."

echo "用法："
echo "  bash build.sh dist   # 打包，产物在 output 目录"
echo "  bash build.sh dev    # 开发模式，浏览器访问 http://localhost:8888"

MODE=${1:-dist}

if [ "$MODE" = "dev" ]; then
  docker build --no-cache -t oplus-angular-build .
  docker run --rm -it -p 8888:8888 -p 35729:35729 oplus-angular-build npm run serve
else
  docker build --no-cache -t oplus-angular-build .
  docker run --rm -v "$PWD/output":/app/output oplus-angular-build npm run dist
fi

echo "[build.sh] 完成。" 