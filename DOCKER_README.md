# Docker开发环境使用指南

## 概述

由于项目使用了较老的gulp 3.x版本和bower依赖，在现代Node.js环境下可能会遇到兼容性问题。我们提供了Docker环境来解决这个问题。

## 环境要求

- Docker
- Docker Compose

## 快速开始

### 1. 构建Docker镜像

```bash
./docker-dev.sh build
```

### 2. 启动开发环境

```bash
./docker-dev.sh start
```

### 3. 安装依赖

```bash
./docker-dev.sh install
```

### 4. 构建项目

```bash
./docker-dev.sh dist
```

### 5. 启动开发服务器

```bash
./docker-dev.sh serve
```

## 常用命令

### 管理Docker环境

```bash
# 启动环境
./docker-dev.sh start

# 停止环境
./docker-dev.sh stop

# 重启环境
./docker-dev.sh restart

# 进入容器shell
./docker-dev.sh shell
```

### 运行gulp任务

```bash
# 构建项目
./docker-dev.sh gulp dist-modules

# 编译CSS
./docker-dev.sh gulp build-css

# 编译JS
./docker-dev.sh gulp build-js

# 合并国际化文件
./docker-dev.sh gulp combine-i18n

# 清理构建文件
./docker-dev.sh gulp clean
```

### 开发服务器

```bash
# 启动开发服务器（端口8888）
./docker-dev.sh serve

# 访问 http://localhost:8888
```

## 环境说明

- **Node.js版本**: 10.x (兼容gulp 3.x)
- **Gulp版本**: 3.9.1
- **Bower版本**: 1.8.8
- **端口**: 8888 (应用), 35729 (livereload)

## 文件映射

- 项目根目录映射到容器的 `/app`
- `node_modules` 和 `bower_components` 使用Docker卷，避免性能问题

## 故障排除

### 1. 权限问题

如果遇到权限问题，可以运行：

```bash
sudo chown -R $USER:$USER .
```

### 2. 端口冲突

如果8888端口被占用，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8889:8888"  # 改为8889
```

### 3. 清理Docker环境

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi oplus-modules_oplus-dev

# 清理未使用的Docker资源
docker system prune
```

## 开发工作流

1. 启动Docker环境
2. 安装依赖
3. 修改代码
4. 运行构建任务
5. 启动开发服务器
6. 在浏览器中访问应用

## 注意事项

- 所有gulp任务都应在Docker容器中运行
- 代码修改会自动同步到容器中
- 构建输出在 `dist/` 目录中
- 开发服务器支持livereload功能 