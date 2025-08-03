# CAC邮件配置功能最终结构

## 📁 项目结构

### 原始邮件配置 (`/cac/email/list`)
```
src/webapp/app/modules/cac/email/
├── email-recipient-list.controller.js  # 原始控制器，添加了按钮拦截逻辑
├── email-recipient-list.html           # 原始视图
└── assets/udp/
    ├── cac-email.json                  # 原始UDP配置
    └── cac-email-enhanced.json         # 增强版UDP配置
```

### 邮件配置2 (`/cac/email/list2`)
```
src/webapp/app/modules/cac/assets/udp/
└── cac-email-v2.json                   # 邮件配置2的UDP配置
```

### EmailV2重写模块 (`emailv2/`)
```
src/webapp/app/modules/cac/emailv2/
├── emailv2.module.js                   # 模块定义
├── emailv2.state.js                    # 路由配置
├── email-template-list.controller.js   # 模版列表控制器 (新增)
├── email-template-list.html            # 模版列表视图 (新增)
├── email-recipient-list.controller.js  # 收件人列表控制器
├── email-recipient-list.html           # 收件人列表视图
├── email-recipient-manage.controller.js # 收件人管理控制器
├── email-recipient-manage.html         # 收件人管理视图
├── email-recipient-manage.service.js   # 收件人管理服务
├── email-recipient-dialog.controller.js # 收件人对话框控制器
├── email-recipient-dialog.html         # 收件人对话框视图
├── email-recipient-test.html           # 邮件测试视图
└── README.md                           # 模块说明文档
```

### 样式文件
```
src/webapp/content/css/
└── cac-email-recipient.css             # 邮件收件人相关样式
```

## 🔧 技术实现

### 1. UDP页面配置
- **邮件配置**: 使用原始的UDP页面配置
- **邮件配置2**: 使用UDP页面配置，但按钮点击被拦截跳转到emailv2实现

### 2. 按钮拦截机制
在原始控制器中添加jQuery事件监听：
```javascript
$(document).off('click', '[data-action="recipient-manage-v2"]').on('click', '[data-action="recipient-manage-v2"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var templateId = $(this).data('template-id');
    $state.go('app.cac.emailv2.recipient-manage', { templateId: templateId });
});
```

### 3. 路由映射
- `/cac/email/list` → 原始UDP页面实现
- `/cac/email/list2` → UDP页面 + emailv2功能实现
- `app.cac.emailv2.template-list` → emailv2模版列表页面
- `app.cac.emailv2.recipient-manage` → emailv2收件人管理页面

### 4. 日期格式化修复
所有UDP配置文件中的日期格式化函数已修复：
```javascript
// 修复前
"convertFn":"js:$.formatDate(${executed_at},\"YYYY-MM-DD HH:mm:ss\")"

// 修复后  
"convertFn":"js:$$.formatDate(${executed_at},\"YYYY-MM-DD HH:mm:ss\")"
```

## 🎯 功能特性

### 邮件配置 (原版)
- 基础的模版列表显示
- 基础的收件人管理功能

### 邮件配置2 (增强版)
- 使用UDP页面显示，保持与原版一致的外观
- 点击"收件人列表"按钮跳转到emailv2的增强功能
- 支持模版扩展功能
- 更丰富的收件人管理功能
- 正确的日期格式化显示

### EmailV2模块特性
- **模版列表管理**: 独立的模版列表页面，支持搜索和刷新
- **收件人管理**: 完整的收件人增删改查功能
- **模版扩展**: 支持基于现有模版创建扩展模版
- **邮件测试**: 邮件发送测试功能

## 📋 使用说明

1. **访问邮件配置**: 通过 `/cac/email/list` 访问原始功能
2. **访问邮件配置2**: 通过 `/cac/email/list2` 访问增强功能
3. **收件人管理**: 在邮件配置2中点击"收件人列表"按钮进入增强的收件人管理页面
4. **直接访问**: 可通过路由直接访问emailv2的各个功能页面

## 🔄 数据流

1. UDP页面调用 `CAC_QUERY_TEMPLATE` 接口显示模版列表
2. 用户点击"收件人列表"按钮
3. 按钮事件被拦截，跳转到emailv2的收件人管理页面
4. emailv2提供完整的收件人管理功能，包括模版扩展

## 🐛 修复内容

1. **日期格式化问题**: 修复了`executed_at`字段显示异常的问题
2. **按钮拦截逻辑**: 完善了按钮事件拦截机制
3. **模块结构**: 完善了emailv2模块的完整结构
4. **路由配置**: 更新了路由配置以支持新的功能结构