# Token登录功能部署检查清单

## 📋 部署前检查

### 1. 文件完整性检查
- [ ] `src/webapp/app/modules/uaa/token-url-handler.service.js` - 新增的token处理服务
- [ ] `src/webapp/app/modules/main/main-init.js` - 修改的应用启动流程
- [ ] `src/webapp/app/modules/uaa/auth.service.js` - 增强的认证服务
- [ ] `src/webapp/app/modules/uaa/auth.jwt.service.js` - 增强的JWT认证服务
- [ ] `src/webapp/app/modules/uaa/current-user.js` - 增强的用户服务
- [ ] `src/webapp/index.html` - 更新的脚本引用
- [ ] `src/webapp/test-token-login.html` - 测试页面
- [ ] `TOKEN_LOGIN_README.md` - 功能文档

### 2. 代码变更验证
- [ ] 检查所有修改的文件语法正确
- [ ] 确认没有引入语法错误
- [ ] 验证依赖注入配置正确
- [ ] 检查服务注册和引用

### 3. 配置检查
- [ ] 确认 `window.$oplus.appConfig.tenantId` 配置正确
- [ ] 检查后端API接口 `/api/authenticate/accessToken` 可用
- [ ] 验证nginx配置支持新的路由

## 🚀 部署步骤

### 1. 代码部署
```bash
# 1. 备份现有代码
cp -r src/webapp src/webapp.backup.$(date +%Y%m%d_%H%M%S)

# 2. 部署新代码
# 确保所有修改的文件都已更新

# 3. 重新构建应用（如果需要）
npm run build
```

### 2. 服务重启
```bash
# 重启nginx（如果需要）
sudo systemctl restart nginx

# 重启应用服务（如果需要）
sudo systemctl restart your-app-service
```

## 🧪 功能测试

### 1. 基础功能测试
- [ ] 访问 `/test-token-login.html` 测试页面
- [ ] 测试无token的正常登录流程
- [ ] 测试有效token的自动登录
- [ ] 测试无效token的错误处理
- [ ] 验证token清除功能

### 2. 兼容性测试
- [ ] 现有用户名密码登录正常
- [ ] 现有安全登录模式正常
- [ ] 记住我功能正常
- [ ] 多租户环境正常

### 3. 日志验证
- [ ] 检查浏览器控制台日志输出
- [ ] 验证各个服务的日志前缀正确
- [ ] 确认敏感信息不在日志中泄露

## 🔍 问题排查

### 1. 常见问题
- **Token登录失败**
  - 检查后端API接口状态
  - 验证token格式和有效性
  - 确认租户配置正确

- **脚本加载错误**
  - 检查 `index.html` 中的脚本引用
  - 验证文件路径正确
  - 确认文件权限设置

- **服务注入错误**
  - 检查依赖注入配置
  - 验证服务名称拼写
  - 确认模块加载顺序

### 2. 调试工具
- 浏览器开发者工具 Console
- Network 标签查看API请求
- Application 标签查看存储信息

## 📊 监控指标

### 1. 功能指标
- Token登录成功率
- Token登录响应时间
- 错误日志数量
- 用户登录体验

### 2. 性能指标
- 页面加载时间
- API响应时间
- 内存使用情况
- 网络请求数量

## 🔄 回滚计划

如果部署出现问题，可以按以下步骤回滚：

### 1. 快速回滚
```bash
# 恢复备份文件
rm -rf src/webapp
mv src/webapp.backup.YYYYMMDD_HHMMSS src/webapp

# 重启服务
sudo systemctl restart nginx
sudo systemctl restart your-app-service
```

### 2. 部分回滚
如果只是某个文件有问题，可以单独恢复：
```bash
# 恢复特定文件
cp src/webapp.backup.YYYYMMDD_HHMMSS/app/modules/uaa/token-url-handler.service.js \
   src/webapp/app/modules/uaa/token-url-handler.service.js
```

## ✅ 部署完成确认

- [ ] 所有测试用例通过
- [ ] 日志输出正常
- [ ] 性能指标正常
- [ ] 用户反馈良好
- [ ] 监控告警正常

## 📞 联系信息

如有问题，请联系：
- 开发团队：[开发团队联系方式]
- 运维团队：[运维团队联系方式]
- 项目负责人：[项目负责人联系方式]

---

**部署日期：** ___________  
**部署人员：** ___________  
**验证人员：** ___________  
**批准人员：** ___________
