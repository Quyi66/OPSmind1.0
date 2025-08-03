# CAC EmailV2 模块

这是CAC邮件配置功能的完全重写版本，不依赖UDP页面，使用纯AngularJS实现，支持模版扩展功能。

## 功能特性

1. **模版列表** - 完全重新实现的模版列表页面，模仿UDP样式
2. **收件人管理** - 弹出对话框形式的收件人管理功能
3. **模版扩展** - 支持基于现有模版创建扩展模版
4. **邮件测试** - 支持邮件发送测试功能
5. **日期格式化** - 正确显示上次检查时间
6. **错误处理** - 完善的错误处理和用户反馈

## 文件结构

### 核心文件
- `emailv2.module.js` - 模块定义
- `emailv2.state.js` - 路由配置

### 模版管理
- `email-template-list.controller.js` - 模版列表控制器
- `email-template-list.html` - 模版列表视图

### 收件人管理
- `email-recipient-list.controller.js` - 收件人列表控制器
- `email-recipient-list.html` - 收件人列表视图
- `email-recipient-manage.controller.js` - 收件人管理控制器
- `email-recipient-manage.html` - 收件人管理视图
- `email-recipient-manage.service.js` - 收件人管理服务
- `email-recipient-dialog.controller.js` - 收件人对话框控制器
- `email-recipient-dialog.html` - 收件人对话框视图

### 测试功能
- `email-recipient-test.html` - 邮件测试视图

## 路由结构

- `app.cac.emailv2.template-list` - 模版列表页面
- `app.cac.emailv2.recipient-list` - 收件人列表页面
- `app.cac.emailv2.recipient-manage` - 收件人管理页面
- `app.cac.emailv2.test` - 邮件测试页面

## 数据接口

### 模版列表接口
- **URL**: `/oplus-portal/dts/api/dts/q/data/CAC_QUERY_TEMPLATE/`
- **方法**: GET
- **参数**: 
  - `cacheBuster`: 时间戳
  - `tenantId`: 租户ID

### 返回数据格式
```json
{
  "total": 4,
  "records": [
    {
      "created_at": "2025-07-28T11:42:18",
      "template_id": "2c9f80839840fa5101984f1fc42e001e",
      "template_name": "巡检测试模板-copy",
      "created_by": "admin",
      "executed_at": "2025-08-02T14:00:00"
    }
  ]
}
```

## 使用方式

1. **邮件配置2**: 访问 `/cac/email/list2` 查看重新实现的模版列表
2. **收件人管理**: 点击模版列表中的"收件人列表"按钮打开收件人管理对话框
3. **自定义内容**: 点击"自定义内容"按钮进行邮件内容自定义

## 实现特点

1. **完全重写**: 不依赖UDP页面，使用纯AngularJS实现
2. **样式模仿**: 完全模仿UDP页面的外观和交互体验
3. **对话框交互**: 收件人管理使用模态对话框，提供更好的用户体验
4. **错误处理**: 完善的加载状态、错误提示和重试机制
5. **实时搜索**: 支持模版名称的实时搜索过滤
6. **统计信息**: 显示模版数量和最后更新时间