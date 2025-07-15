# JAO任务调度模块文档

## 概述

JAO（Job Automation Operations）任务调度模块是OPLUS平台中负责定时任务管理和执行的核心组件。本文档详细描述了任务调度模块的业务流程、API接口、数据格式以及问题诊断方法。

## 文档结构

- [业务流程分析](./business-flow.md) - 任务调度的完整业务流程
- [API接口文档](./api-reference.md) - REST API接口详细说明
- [数据格式规范](./data-format.md) - 数据结构和格式定义
- [前端架构说明](./frontend-architecture.md) - 前端组件和状态管理
- [问题诊断指南](./troubleshooting.md) - 常见问题和解决方案
- [开发指南](./development-guide.md) - 开发和调试指南

## 快速开始

### 功能概览

任务调度模块提供以下核心功能：

1. **任务管理** - 创建、编辑、删除定时任务
2. **调度控制** - 启动、停止、立即执行任务
3. **时间管理** - CRON表达式配置和下次执行时间预览
4. **批量操作** - 批量启停多个任务
5. **监控统计** - 任务执行状态和历史记录

### 技术栈

- **前端框架**: AngularJS 1.5.8
- **UI组件**: Bootstrap + 自定义组件
- **数据表格**: DataTables
- **HTTP通信**: Angular $http + restUtils
- **状态管理**: UI-Router

### 模块结构

```
src/webapp/app/modules/jao/cronJob/
├── cron-job-list.controller.js    # 任务列表控制器
├── cron-job-list.html            # 任务列表模板
├── cron-job-dialog.controller.js # 任务编辑对话框控制器
├── cron-job-dialog.html          # 任务编辑对话框模板
├── cron-job.service.js           # 任务调度服务
├── cron-job.state.js             # 路由状态定义
└── cron.html                     # CRON表达式生成器
```

## 版本信息

- **文档版本**: 1.0.0
- **最后更新**: 2024年
- **适用版本**: OPLUS 3.0+

## 联系信息

如有问题或建议，请联系开发团队。