# CAC EmailV2 模块

这是CAC邮件配置功能的重写版本，支持模版扩展功能。

## 功能特性

1. **模版列表** - 显示所有邮件模版，支持搜索和刷新
2. **收件人管理** - 支持收件人列表的增删改查
3. **模版扩展** - 支持基于现有模版创建扩展模版
4. **邮件测试** - 支持邮件发送测试功能
5. **日期格式化** - 正确显示上次检查时间

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

1. **通过UDP页面**: 访问 `/cac/email/list2` 查看模版列表
2. **直接访问**: 通过路由 `app.cac.emailv2.template-list` 访问模版列表
3. **按钮跳转**: 点击模版列表中的"收件人列表"按钮跳转到收件人管理页面

## 修复内容

1. **日期格式化**: 修复了`executed_at`字段的日期格式化问题，使用`$$.formatDate`替代`$.formatDate`
2. **按钮拦截**: 在原始控制器中添加了按钮拦截逻辑，确保点击"收件人列表"按钮时跳转到emailv2的收件人管理页面
3. **模块结构**: 完善了emailv2模块的结构，添加了模版列表功能