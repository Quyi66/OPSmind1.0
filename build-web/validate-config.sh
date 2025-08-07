#!/bin/bash

# OPLUS 配置验证脚本
# 验证构建环境和配置文件

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 OPLUS 配置验证${NC}"
echo ""

# 检查必要文件
echo -e "${BLUE}📁 检查必要文件...${NC}"

files_to_check=(
    "Dockerfile"
    "nginx.conf"
    "build-oplus.sh"
    "start-nginx.sh"
    "quick-build.sh"
)

missing_files=()

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file${NC}"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo -e "${RED}缺少必要文件: ${missing_files[*]}${NC}"
    exit 1
fi

# 检查dist目录
echo ""
echo -e "${BLUE}📦 检查dist目录...${NC}"

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist目录不存在${NC}"
    exit 1
elif [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${RED}❌ dist目录为空${NC}"
    exit 1
else
    echo -e "${GREEN}✅ dist目录存在且不为空${NC}"
    
    # 检查关键文件
    key_files=("index.html" "app" "lib")
    for file in "${key_files[@]}"; do
        if [ -e "dist/$file" ]; then
            echo -e "${GREEN}  ✅ dist/$file${NC}"
        else
            echo -e "${YELLOW}  ⚠️  dist/$file 不存在${NC}"
        fi
    done
fi

# 检查Docker环境
echo ""
echo -e "${BLUE}🐳 检查Docker环境...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker未安装${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Docker已安装${NC}"
    docker --version
fi

if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker未运行或无法访问${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Docker正在运行${NC}"
fi

# 检查Docker Buildx
if docker buildx version >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Buildx可用${NC}"
    docker buildx version
else
    echo -e "${YELLOW}⚠️  Docker Buildx不可用（多架构构建将不可用）${NC}"
fi

# 验证nginx配置
echo ""
echo -e "${BLUE}⚙️  验证nginx配置...${NC}"

# 使用Docker临时容器验证nginx配置
if docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ nginx配置文件语法正确${NC}"
else
    echo -e "${RED}❌ nginx配置文件语法错误${NC}"
    echo -e "${YELLOW}运行以下命令查看详细错误信息:${NC}"
    echo "docker run --rm -v \"\$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro\" nginx:alpine nginx -t"
    exit 1
fi

# 检查端口占用
echo ""
echo -e "${BLUE}🔌 检查端口占用...${NC}"

if command -v lsof &> /dev/null; then
    if lsof -i :8080 >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口8080已被占用${NC}"
        echo -e "${YELLOW}当前占用进程:${NC}"
        lsof -i :8080
    else
        echo -e "${GREEN}✅ 端口8080可用${NC}"
    fi
elif command -v netstat &> /dev/null; then
    if netstat -an | grep :8080 >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口8080可能已被占用${NC}"
        netstat -an | grep :8080
    else
        echo -e "${GREEN}✅ 端口8080可用${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  无法检查端口占用（lsof和netstat都不可用）${NC}"
fi

# 检查磁盘空间
echo ""
echo -e "${BLUE}💾 检查磁盘空间...${NC}"

available_space=$(df . | awk 'NR==2 {print $4}')
if [ "$available_space" -gt 2097152 ]; then  # 2GB in KB
    echo -e "${GREEN}✅ 磁盘空间充足 ($(df -h . | awk 'NR==2 {print $4}')可用)${NC}"
else
    echo -e "${YELLOW}⚠️  磁盘空间可能不足 ($(df -h . | awk 'NR==2 {print $4}')可用)${NC}"
    echo -e "${YELLOW}建议至少有2GB可用空间${NC}"
fi

echo ""
echo -e "${GREEN}✅ 配置验证完成${NC}"
echo ""
echo -e "${BLUE}📖 使用说明:${NC}"
echo "  快速构建: ./quick-build.sh"
echo "  完整构建: ./build-oplus.sh --run"
echo "  仅启动容器: ./start-nginx.sh"
