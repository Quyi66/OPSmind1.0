# CAC 邮件收件人管理功能

## 功能概述

本功能为系统巡检/邮件配置模块提供了两个版本的实现：

1. **原始邮件配置** (`/cac/email/list`) - 保持原有的UDP页面实现，功能不变
2. **新版邮件配置2** (`/cac/email/list2`) - 新增收件人管理的模版扩展功能，支持在新增、编辑、删除收件人时同步操作到多个模版

## 主要特性

### 1. 模版扩展选择
- **默认收起**：模版扩展列表默认处于收起状态，界面简洁
- **默认选中当前模版**：当前正在操作的模版默认被选中且不可取消
- **多选支持**：可以选择多个模版进行同步操作

### 2. 收件人操作
- **新增收件人**：支持同时添加到多个选中的模版
- **编辑收件人**：支持同步修改到多个选中的模版  
- **删除收件人**：支持从多个选中的模版中删除

### 3. 用户界面
- **直观的操作界面**：清晰的表格展示收件人信息
- **模态对话框**：统一的操作体验
- **状态反馈**：操作成功/失败的即时反馈

## 文件结构

```
src/webapp/app/modules/cac/email/
├── email-recipient-manage.html              # 收件人管理主页面
├── email-recipient-manage.controller.js     # 收件人管理控制器
├── email-recipient-dialog.html              # 收件人操作对话框
├── email-recipient-dialog.controller.js     # 对话框控制器
├── email-recipient-manage.service.js        # API服务
├── email-recipient-test.html                # 测试页面
├── email-recipient-test.controller.js       # 测试控制器
└── README.md                                # 说明文档
```

## 路由配置

### 原始邮件配置 (email目录)
- `/cac/email/list` - 原始邮件配置主页面（UDP页面）
- `/cac/email/test` - 功能测试页面
- `/cac/email/demo` - 功能演示页面
- `/cac/email/access-test` - 访问测试页面

## API接口

### 服务方法

1. `getTemplate(templateId)` - 获取单个模版信息
2. `getAllTemplates()` - 获取所有模版列表
3. `getRecipients(templateId)` - 获取指定模版的收件人列表
4. `addRecipient(recipientData)` - 新增收件人
5. `updateRecipient(recipientId, recipientData)` - 更新收件人
6. `deleteRecipient(recipientId, templateIds)` - 删除收件人
7. `syncRecipientToTemplates(action, recipientData, templateIds)` - 同步收件人到多个模版

### 预期API端点

- `GET /api/cac/templates/{templateId}` - 获取模版信息
- `GET /api/cac/templates` - 获取所有模版
- `GET /api/cac/templates/{templateId}/recipients` - 获取收件人列表
- `POST /api/cac/recipients` - 新增收件人
- `PUT /api/cac/recipients/{recipientId}` - 更新收件人
- `DELETE /api/cac/recipients/{recipientId}` - 删除收件人
- `POST /api/cac/recipients/sync` - 同步收件人操作

## 使用方法

### 1. 访问收件人管理
有以下几种访问方式：

**主要入口：**
- 原始邮件配置：`/cac/email/list`（保持原有功能）
- 新版邮件配置2：`/cac/email/list2`（支持模版扩展功能）
- 从模版列表点击"收件人列表"按钮

**菜单访问：**
- 从CAC模块左侧菜单选择"邮件配置"（原始版本）
- 从CAC模块左侧菜单选择"邮件配置2"（新版本）

**直接访问：**
- 收件人管理：`/cac/email/manage/{templateId}`

**测试页面：**
- 简单测试：`/cac/email/test`
- 完整演示：`/cac/email/demo`
- 访问测试：`/cac/email/access-test`

### 2. 新增收件人
1. 点击"新增收件人"按钮
2. 填写收件人邮箱和姓名
3. 点击"展开"查看模版扩展选项（可选）
4. 选择要同步的其他模版
5. 点击"新增"完成操作

### 3. 编辑收件人
1. 点击收件人行的"编辑"按钮
2. 修改收件人信息
3. 选择要同步的模版
4. 点击"保存"完成操作

### 4. 删除收件人
1. 点击收件人行的"删除"按钮
2. 确认删除操作
3. 选择要同步删除的模版
4. 点击"删除"完成操作

## 测试

访问测试页面：`/cac/email/test`

该页面提供了快速测试不同模版收件人管理功能的按钮。

## 注意事项

1. **当前模版**：在模版扩展选择中，当前模版始终被选中且不可取消
2. **API集成**：当前使用模拟数据，需要后端提供相应的API接口
3. **权限控制**：需要确保用户有相应的操作权限
4. **错误处理**：所有API调用都包含错误处理和用户反馈

## 样式文件

相关样式定义在：`src/webapp/content/css/cac-email-recipient.css`

## 依赖

- AngularJS 1.x
- UI Bootstrap
- FontAwesome 图标
- Bootstrap 4/5 样式