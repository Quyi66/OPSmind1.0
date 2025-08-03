# CAC邮件配置架构说明

## 🤔 为什么邮件配置2使用email控制器而不是emailv2控制器？

### 架构设计原理

#### 邮件配置 (`/cac/email/list`)
```
UDP页面 (cac-email.json) 
    ↓
email/email-recipient-list.html 
    ↓
CacEmailRecipientController (email目录)
    ↓
基础功能
```

#### 邮件配置2 (`/cac/email/list2`) 
```
UDP页面 (cac-email-v2.json) 
    ↓
email/email-recipient-list.html (复用相同页面)
    ↓
CacEmailRecipientController (email目录，但添加了按钮拦截逻辑)
    ↓
点击"收件人列表"按钮时拦截 → 跳转到emailv2增强功能
```

#### EmailV2独立功能 (`/cac/emailv2/xxx`)
```
emailv2/email-template-list.html
    ↓
EmailTemplateListController (emailv2目录)
    ↓
完整的重写功能，支持模版扩展
```

## 🎯 设计思路

### 1. 保持用户体验一致性
- 邮件配置和邮件配置2使用相同的UDP页面显示
- 用户看到的界面完全一样
- 只是在功能增强上有区别

### 2. 渐进式增强
- 邮件配置2不是完全重写，而是在原有基础上增强
- 通过按钮拦截机制，在需要时跳转到增强功能
- 保持了向后兼容性

### 3. 代码复用
- UDP页面配置可以复用
- 基础控制器逻辑可以复用
- 只在需要增强的地方添加新功能

## 🔧 技术实现

### 按钮拦截机制
```javascript
// 在CacEmailRecipientController中
$(document).on('click', '[data-action="recipient-manage-v2"]', function(e) {
    e.preventDefault();
    var templateId = $(this).data('template-id');
    // 跳转到emailv2的增强功能
    $state.go('app.cac.emailv2.recipient-manage', { templateId: templateId });
});
```

### UDP配置差异
```json
// cac-email.json (邮件配置)
"data-action": "recipient-manage"

// cac-email-v2.json (邮件配置2) 
"data-action": "recipient-manage-v2"  // 不同的action标识
```

## 📋 文件职责

### email目录
- **职责**: 基础邮件配置功能 + 邮件配置2的页面显示
- **控制器**: 处理UDP页面交互 + 按钮拦截逻辑
- **视图**: UDP页面渲染

### emailv2目录  
- **职责**: 增强功能实现（模版扩展、高级收件人管理等）
- **控制器**: 完整的重写功能逻辑
- **视图**: 自定义HTML页面

## ✅ 这样设计的优势

1. **用户体验**: 邮件配置2看起来和原版一样，用户无感知
2. **功能增强**: 点击按钮时获得增强功能
3. **代码维护**: 基础功能复用，增强功能独立
4. **向后兼容**: 不影响原有邮件配置功能
5. **渐进升级**: 可以逐步将更多功能迁移到emailv2

## 🔄 数据流

```
用户访问 /cac/email/list2
    ↓
加载UDP页面 (cac-email-v2.json)
    ↓  
使用CacEmailRecipientController渲染页面
    ↓
用户点击"收件人列表"按钮
    ↓
按钮拦截逻辑触发
    ↓
跳转到app.cac.emailv2.recipient-manage
    ↓
使用emailv2的增强功能
```

这就是为什么邮件配置2使用email控制器而不是emailv2控制器的原因！