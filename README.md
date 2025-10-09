# OPSmind Modules

> 企业级自动化运维平台前端模块

## 项目简介

OPSmind 是一个无代理模式的自动化运维平台，可以助力完成系统巡检、漏洞扫描、软件包安装、用户权限管理、信息采集等运维工作的自动化。

本项目为 OPSmind 平台的前端模块，基于 AngularJS 1.5.8 构建，提供丰富的运维管理功能界面。

## 主要功能

- **资产管理** - 设备信息统一管理和自动化纳管
- **脚本管理** - 运维脚本版本控制和统一管理  
- **作业编排** - 可视化作业流程编排和执行
- **低代码开发** - 数据看板和报表的可视化开发
- **用户权限** - 细粒度的用户和权限管理
- **系统监控** - 实时监控和巡检功能

## 环境要求

- **Node.js**: 10.24.1 (推荐)
- **npm**: 6.14.12
- **Gulp**: 3.9.1 (通过npm自动安装)

## 快速开始

### 1. 安装依赖

```bash
# 安装项目依赖
npm install
```

### 2. 构建项目

```bash
# 构建开发版本
npm run build-dev

# 或构建生产版本
npm run build
```

### 3. 启动开发服务器

```bash
# 启动开发服务器
npm run serve
```

### 4. 访问应用

开发服务器启动后，可通过以下地址访问：

- 根路径: `http://localhost:3000/`
- 标准路径: `http://localhost:3000/oplus/base/` (推荐，匹配生产环境)

## 项目结构

```
oplus-modules/
├── src/
│   └── webapp/                 # 前端源码
│       ├── app/
│       │   └── modules/        # 功能模块
│       │       ├── acm/        # 资产管理
│       │       ├── dts/        # 数据采集
│       │       ├── jao/        # 作业编排  
│       │       ├── udp/        # 低代码开发
│       │       └── ...         # 其他模块
│       ├── content/            # 样式和静态资源
│       ├── i18n/              # 国际化文件
│       └── index.html         # 主页面
├── dist/                      # 构建输出目录
├── docs/                      # 项目文档
├── gulpfile.js               # 构建配置
├── package.json              # 依赖配置
└── README.md                 # 本文档
```

## 开发指南

### 可用命令

```bash
# 开发相关
npm run dev              # 开发模式构建和监听
npm run dev-simple       # 简化开发模式
npm run build-dev        # 构建开发版本
npm run serve            # 启动开发服务器
npm run watch            # 监听文件变化

# 构建相关  
npm run build            # 构建生产版本
npm run clean            # 清理构建文件
npm run dist             # 打包发布版本

# 工具相关
npm run translator       # 启动翻译工具
npm run detect-cn        # 检测中文文本
```

### 模块开发

每个功能模块位于 `src/webapp/app/modules/` 目录下，包含：

- `*.js` - 控制器、服务、指令等JavaScript代码
- `*.html` - HTML模板文件
- `*.scss` - 样式文件
- `assets/` - 模块静态资源

### 国际化

项目支持多语言，语言文件位于 `src/webapp/i18n/` 目录：

- `zh-cn/` - 简体中文
- `zh-tw/` - 繁体中文  
- `en/` - 英文

## 常见问题

### Node.js 版本问题

推荐使用 Node.js 10.24.1，如遇到版本兼容问题：

```bash
# 使用 nvm 切换版本
nvm use 10.24.1
```

### /oplus/base 路径访问问题

如果访问 `http://localhost:3000/oplus/base` 时遇到静态资源加载失败：

1. 确保已重新构建项目：`npm run build-dev`
2. 重新启动开发服务器：`npm run serve`
3. 开发服务器已配置路径重写，支持两种访问方式

### 内存不足问题

如果构建时遇到内存不足错误，npm scripts 已配置增加内存限制：

```bash
# 自动使用 --max-old-space-size=4096
npm run build
```

## 技术栈

- **前端框架**: AngularJS 1.5.8
- **UI组件**: Bootstrap 3.3.7
- **路由**: UI-Router
- **构建工具**: Gulp 3.9.1
- **样式**: SCSS
- **模块化**: AMD/UMD

## 文档

- [用户指南](docs/OplusUserGuide_3.0.md) - 详细的功能使用说明
- [开发文档](README-DOCKER.md) - 开发环境和构建说明
- [修复记录](FIX_SUMMARY.md) - 问题修复历史记录

## 支持与反馈

如遇到问题，请查看：

1. [修复记录](FIX_SUMMARY.md) - 查看已知问题和解决方案
2. [常见问题](#常见问题) - 检查常见问题的解决方法
3. 项目 Issues - 提交新的问题反馈

## 更新日志

- **2025-01-12**: 修复 `/oplus/base` 路径访问问题，完善开发服务器配置
- **2024**: 完成从 Bower 到 NPM 的依赖迁移，解决各种构建问题

## 许可证

本项目为企业内部项目，请遵循企业相关使用规定。
