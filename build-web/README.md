# OPLUS Web应用部署包

这个目录包含了OPLUS Web应用的完整部署配置，包括已构建的前端资源、Nginx配置和Docker镜像构建脚本。

## 📁 目录结构

```
build-web/
├── dist/                   # 已构建的前端应用
├── nginx.conf             # Nginx配置文件
├── Dockerfile             # Docker镜像构建文件
├── build-oplus.sh         # 🆕 完整的Docker镜像构建脚本
├── quick-build.sh         # 🆕 快速构建脚本
├── start-nginx.sh         # 容器启动脚本
├── validate-config.sh     # 🆕 配置验证脚本
├── .env.example           # 🆕 环境变量配置示例
├── .dockerignore          # Docker构建忽略文件
└── README.md              # 说明文档
```

## 🚀 快速开始

### 步骤1：验证环境配置

```bash
# 赋予执行权限
chmod +x *.sh

# 验证配置和环境
./validate-config.sh
```

### 步骤2：选择构建方式

#### 方式一：快速构建（推荐用于开发测试）

```bash
# 快速构建并运行
./quick-build.sh
```

#### 方式二：完整构建（推荐用于生产部署）

```bash
# 构建并运行容器
./build-oplus.sh --run

# 或者仅构建镜像
./build-oplus.sh --build-only

# 指定后端服务器地址
./build-oplus.sh --backend 192.168.1.100:8080 --run
```

#### 方式三：使用现有的start-nginx脚本

```bash
# 启动容器（需要先有镜像）
./start-nginx.sh
```

## 🔧 配置说明

### 后端服务器配置

#### 方法1：通过build-oplus脚本参数

```bash
./build-oplus.sh --backend 你的后端IP:端口 --run
```

#### 方法2：直接编辑nginx.conf文件

编辑 `nginx.conf` 文件第70行：

```nginx
proxy_pass http://10.1.40.112:18080;  # 改为你的后端服务器IP:端口
```

## 📖 build-oplus脚本详细说明

### 基本用法

```bash
./build-oplus.sh [选项]
```

### 选项说明

| 选项 | 说明 |
|------|------|
| `-h, --help` | 显示帮助信息 |
| `-p, --platforms ARCH` | 指定目标架构 (默认: linux/amd64,linux/arm64) |
| `-r, --registry URL` | 指定镜像仓库地址 |
| `-v, --version VERSION` | 指定镜像版本 (默认: 1.0) |
| `-b, --backend SERVER` | 指定后端服务器地址 |
| `--push` | 构建后推送到仓库 |
| `--load` | 构建单架构镜像并加载到本地 Docker |
| `--single-arch` | 仅构建当前架构 |
| `--build-only` | 仅构建镜像，不运行容器 |
| `--run` | 构建完成后自动运行容器 |

### 使用示例

```bash
# 构建多架构镜像
./build-oplus.sh

# 构建当前架构并加载到本地
./build-oplus.sh --single-arch --load

# 构建并运行容器
./build-oplus.sh --run

# 指定后端地址并运行
./build-oplus.sh --backend 192.168.1.100:8080 --run

# 构建并推送到仓库
./build-oplus.sh --push -r registry.example.com/

# 仅构建镜像，不运行
./build-oplus.sh --build-only
```

## 🌐 访问地址

- **普通模式**: http://localhost:8080/oplus/base/
- **管理员模式**: http://localhost:8080/oplus-admin/

## 🐳 Docker管理命令

```bash
# 查看容器状态
docker ps --filter "name=oplus-web"

# 查看容器日志
docker logs -f oplus-web

# 停止容器
docker stop oplus-web

# 重启容器
docker restart oplus-web

# 删除容器
docker rm -f oplus-web

# 查看镜像
docker images | grep oplus-web
```

## 🔍 故障排除

### 1. 容器无法启动

```bash
# 检查Docker是否运行
docker info

# 查看容器日志
docker logs oplus-web

# 检查端口是否被占用
lsof -i :8080
```

### 2. 无法访问后端服务

- 检查nginx.conf中的后端服务器地址是否正确
- 确保后端服务正在运行
- 检查网络连接

### 3. 构建失败

- 确保dist目录存在且不为空
- 检查Docker是否有足够的磁盘空间
- 查看构建日志中的错误信息

## 🛠️ 脚本说明

### build-oplus.sh
完整的Docker镜像构建脚本，支持多架构构建、自定义配置等高级功能。

### quick-build.sh
快速构建脚本，适用于开发测试环境，自动清理旧容器和镜像。

### validate-config.sh
配置验证脚本，检查构建环境、必要文件、Docker状态等。

### start-nginx.sh
容器启动脚本，使用已有镜像快速启动容器。

## 📋 系统要求

- Docker 20.10+
- Docker Buildx (用于多架构构建)
- 至少2GB可用磁盘空间
- 网络连接（用于拉取基础镜像）

## 🔧 高级配置

### 环境变量配置

```bash
# 复制配置文件
cp .env.example .env

# 编辑配置
vim .env
```

### 自定义nginx配置

直接编辑 `nginx.conf` 文件，或在构建时通过 `--backend` 参数指定后端地址。
