# Oplus前端开发工具

> 前后台分离项目 - 前端构建与开发环境

## 项目简介

本项目为前后台分离的Angular前端项目，提供简化的开发和构建工具。

## 环境要求

- Node.js (推荐 v14+)
- npm 或 yarn
- gulp (自动检测并使用)

## 快速开始

### 1. 安装依赖

```bash
# 使用Makefile
make install

# 或直接使用脚本
bash docker.sh install

# 或使用npm
npm install
```

### 2. 开发调试

```bash
# 启动开发服务器
make serve

# 或使用脚本
bash docker.sh serve

# 或使用别名
make dev
```

开发服务器启动后，访问 `http://localhost:3000` 进行开发调试。

### 3. 构建生产版本

```bash
# 构建生产版本
make dist

# 或使用脚本
bash docker.sh dist
```

构建完成后，生产文件将输出到 `output` 目录。

### 4. 清理构建文件

```bash
# 清理构建文件
make clean

# 或使用脚本
bash docker.sh clean
```

## 命令说明

### Makefile 命令

```bash
make help      # 显示帮助信息
make install   # 安装依赖
make deps      # 安装依赖（别名）
make serve     # 启动开发服务器
make dev       # 启动开发服务器（别名）
make dist      # 构建生产版本
make clean     # 清理构建文件
make info      # 显示项目和环境信息
```

### 脚本命令

```bash
bash docker.sh help    # 显示帮助信息
bash docker.sh serve   # 启动开发服务器
bash docker.sh dist    # 构建生产版本
bash docker.sh clean   # 清理构建文件
```

## 开发流程

1. **初始化项目**
   ```bash
   make install
   ```

2. **开发调试**
   ```bash
   make serve
   ```
   访问 `http://localhost:3000` 进行开发

3. **构建生产版本**
   ```bash
   make dist
   ```
   生产文件输出到 `output` 目录

4. **清理文件**
   ```bash
   make clean
   ```

## 项目结构

```
oplus-modules/
├── src/                    # 源代码
│   └── webapp/            # Web应用
├── output/                # 构建输出目录
├── docker.sh             # 开发工具脚本
├── Makefile              # 构建工具
├── gulpfile.js           # Gulp配置
├── package.json          # 项目依赖
└── README-DOCKER.md      # 本文档
```

## 环境变量

- `DEV_PORT`: 开发服务器端口（默认：3000）
- `DIST_PATH`: 构建输出目录（默认：output）

## 常见问题

### 1. Node.js版本问题

如果遇到Node.js版本兼容问题，请使用Node.js v14+版本。

### 2. 端口冲突

如果3000端口被占用，请修改 `docker.sh` 中的 `DEV_PORT` 变量。

### 3. 依赖安装失败

```bash
# 清理node_modules后重新安装
rm -rf node_modules
npm install
```

### 4. Gulp命令找不到

脚本会自动检测并使用 `npx gulp`，无需全局安装gulp。

## 性能优化

- 使用本地Node.js环境，避免Docker容器开销
- 自动检测并复用已安装的依赖
- 支持增量构建和热重载

## 支持

如有问题，请查看：
1. 确认Node.js和npm正确安装
2. 确认项目依赖正确安装
3. 检查端口是否被占用

## 更新日志

- 移除Docker依赖，直接使用本地Node.js环境
- 简化命令结构，只保留核心功能
- 优化开发体验，提高构建速度 