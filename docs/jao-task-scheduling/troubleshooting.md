# 问题诊断指南

## 1. 常见问题分类

### 1.1 页面加载问题
- 任务调度页面无法打开
- 页面显示空白或加载失败
- 菜单点击无响应

### 1.2 数据加载问题
- 任务列表显示为空
- 数据加载缓慢或超时
- 数据格式错误

### 1.3 功能操作问题
- 无法创建新任务
- 启停操作失效
- 立即执行无响应

### 1.4 API通信问题
- 网络请求失败
- 权限验证失败
- 服务器错误

## 2. 诊断工具和方法

### 2.1 内置调试功能

#### 使用API连接测试功能
```javascript
// 在浏览器控制台中执行
angular.element(document.body).scope().$ctrl.debugApiConnection();
```

这个命令会：
- 显示API配置信息
- 测试基础API连接
- 显示详细的错误信息

#### 检查API配置
```javascript
// 查看API基础URL配置
console.log('JAO API Base URL:', window.$oplus.appConfig.apiBaseUrls.jao);
console.log('Complete API URL:', window.$oplus.appConfig.apiBaseUrls.jao + '/api/jao/cron');
```

### 2.2 浏览器开发者工具

#### 网络请求检查
1. 打开开发者工具 (F12)
2. 切换到 Network 标签
3. 刷新页面或执行操作
4. 检查API请求状态：
   - 请求URL是否正确
   - HTTP状态码
   - 响应内容
   - 请求耗时

#### 控制台错误检查
1. 打开 Console 标签
2. 查看JavaScript错误信息
3. 检查网络错误
4. 查看自定义日志输出

#### 应用状态检查
```javascript
// 检查Angular作用域
angular.element(document.body).scope();

// 检查控制器状态
angular.element('[ng-controller="CronJobController"]').scope().$ctrl;

// 检查服务状态
angular.element(document.body).injector().get('cronJobService');
```

## 3. 具体问题解决方案

### 3.1 页面无法加载

#### 问题现象
- 点击任务调度菜单无响应
- 页面显示404错误
- 路由跳转失败

#### 诊断步骤
1. **检查路由配置**
```javascript
// 检查状态是否正确注册
$state.get('app.jao.cron_job');
```

2. **检查模板文件**
```bash
# 确认模板文件存在
ls -la src/webapp/app/modules/jao/cronJob/cron-job-list.html
```

3. **检查脚本加载**
```javascript
// 检查控制器是否注册
angular.module('oplus.jao')._invokeQueue.filter(item => 
  item[1] === 'controller' && item[2][0] === 'CronJobController'
);
```

#### 解决方案
1. **修复路由配置**
```javascript
// 确保状态定义正确
.state('app.jao.cron_job', {
    url: '/cron-list',
    views: {
        'jaoMainView': {
            templateUrl: 'app/modules/jao/cronJob/cron-job-list.html',
            controller: 'CronJobController',
            controllerAs: '$ctrl'
        }
    }
})
```

2. **检查文件引用**
```html
<!-- 确保在index.html中正确引用 -->
<script src="app/modules/jao/cronJob/cron-job-list.controller.js"></script>
<script src="app/modules/jao/cronJob/cron-job.state.js"></script>
```

### 3.2 数据加载失败

#### 问题现象
- 任务列表显示为空
- 显示"加载失败"错误
- 数据表格无法初始化

#### 诊断步骤
1. **检查API调用**
```javascript
// 手动测试API调用
cronJobService.cronRestInterface("query").then(
  data => console.log('Success:', data),
  error => console.error('Error:', error)
);
```

2. **检查网络请求**
- 打开Network标签
- 查看 `/api/jao/cron` 请求
- 检查响应状态和内容

3. **检查数据格式**
```javascript
// 验证返回数据格式
function validateApiResponse(data) {
    if (!Array.isArray(data)) {
        console.error('API返回数据不是数组格式:', data);
        return false;
    }
    return true;
}
```

#### 解决方案
1. **API连接问题**
```javascript
// 检查API基础URL配置
if (!window.$oplus.appConfig.apiBaseUrls.jao) {
    console.error('JAO API基础URL未配置');
    // 手动设置
    window.$oplus.appConfig.apiBaseUrls.jao = '/oplus-portal/jao';
}
```

2. **后端服务问题**
```bash
# 检查后端服务状态
curl -X GET "http://localhost:8080/oplus-portal/jao/api/jao/cron"
```

3. **权限问题**
```javascript
// 检查用户权限
if (!currentUser.hasPermission('jao:view')) {
    console.error('用户没有查看权限');
}
```

### 3.3 功能操作失效

#### 问题现象
- 启停按钮点击无效果
- 新增任务对话框无法打开
- 删除操作无响应

#### 诊断步骤
1. **检查权限配置**
```javascript
// 检查编辑权限
console.log('Has edit permission:', currentUser.hasPermission('jao:edit'));
```

2. **检查事件绑定**
```javascript
// 检查按钮事件绑定
angular.element('[ng-click*="startStop"]').scope();
```

3. **检查API调用**
```javascript
// 测试启停API
cronJobService.cronRestInterface("start", "61").then(
  result => console.log('Start success:', result),
  error => console.error('Start failed:', error)
);
```

#### 解决方案
1. **权限配置修复**
```html
<!-- 确保权限指令正确 -->
<button uaa-has-permission="jao:edit:*" 
        ng-click="$ctrl.startStop(row.id, row.triggerStatus, row.scheduleConf)">
    启停
</button>
```

2. **事件处理修复**
```javascript
// 确保控制器方法正确绑定
that.startStop = function(id, triggerStatus, scheduleConf) {
    // 实现逻辑
};
```

### 3.4 CRON表达式问题

#### 问题现象
- CRON表达式验证失败
- 下次执行时间显示错误
- 高频任务警告异常

#### 诊断步骤
1. **测试CRON表达式API**
```javascript
cronJobService.cronRestInterface("scheduleConf", "0 0/5 * * * ?").then(
  data => console.log('CRON validation:', data),
  error => console.error('CRON error:', error)
);
```

2. **检查表达式格式**
```javascript
function validateCronExpression(cron) {
    const cronRegex = /^[0-9\*\-\,\/\?\sA-Z]+$/;
    return cronRegex.test(cron);
}
```

#### 解决方案
1. **表达式格式修正**
```javascript
// 标准CRON表达式格式: 秒 分 时 日 月 周 年
const validExpressions = {
    "每5分钟": "0 0/5 * * * ?",
    "每天凌晨2点": "0 0 2 * * ?",
    "工作日上午9点": "0 0 9 ? * MON-FRI"
};
```

2. **API响应处理**
```javascript
// 改进的响应数据处理
if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('Invalid scheduleConf API response:', data);
    messageService.toast('error', "Failed to get schedule information");
    return;
}
```

## 4. 性能问题诊断

### 4.1 页面加载缓慢

#### 诊断方法
1. **性能分析**
```javascript
// 使用Performance API
performance.mark('page-start');
// ... 页面加载逻辑
performance.mark('page-end');
performance.measure('page-load', 'page-start', 'page-end');
console.log(performance.getEntriesByName('page-load'));
```

2. **网络请求分析**
- 检查请求数量和大小
- 分析请求并发情况
- 查看缓存策略

#### 优化方案
1. **数据分页加载**
```javascript
// 实现分页加载
function loadTasksWithPagination(page = 1, size = 20) {
    return cronJobService.cronRestInterface("query", {page, size});
}
```

2. **缓存策略**
```javascript
// 实现数据缓存
const dataCache = {
    tasks: null,
    timestamp: null,
    ttl: 5 * 60 * 1000, // 5分钟
    
    get: function() {
        if (this.tasks && Date.now() - this.timestamp < this.ttl) {
            return Promise.resolve(this.tasks);
        }
        return null;
    },
    
    set: function(data) {
        this.tasks = data;
        this.timestamp = Date.now();
    }
};
```

### 4.2 内存泄漏问题

#### 诊断方法
1. **监控内存使用**
```javascript
// 监控内存使用情况
function monitorMemory() {
    if (performance.memory) {
        console.log('Memory usage:', {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
    }
}

setInterval(monitorMemory, 10000);
```

2. **检查事件监听器**
```javascript
// 检查未清理的事件监听器
function checkEventListeners() {
    const listeners = getEventListeners(document);
    console.log('Active event listeners:', listeners);
}
```

#### 解决方案
1. **正确清理资源**
```javascript
$scope.$on('$destroy', function() {
    // 清理定时器
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    
    // 取消未完成的请求
    if (pendingRequests.length > 0) {
        pendingRequests.forEach(request => request.cancel());
    }
    
    // 清理事件监听器
    angular.element(window).off('resize', onWindowResize);
});
```

## 5. 错误日志分析

### 5.1 常见错误类型

#### JavaScript错误
```javascript
// TypeError: Cannot read property 'length' of undefined
// 原因: 数据格式不正确
// 解决: 添加数据验证

if (data && Array.isArray(data)) {
    data.forEach(item => {
        // 处理数据
    });
}
```

#### 网络错误
```javascript
// ERR_NETWORK_CHANGED
// 原因: 网络连接问题
// 解决: 添加重试机制

function retryApiCall(apiCall, maxRetries = 3) {
    return apiCall().catch(error => {
        if (maxRetries > 0 && isNetworkError(error)) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(retryApiCall(apiCall, maxRetries - 1));
                }, 1000);
            });
        }
        throw error;
    });
}
```

#### 权限错误
```javascript
// 403 Forbidden
// 原因: 用户权限不足
// 解决: 检查权限配置

function checkPermissionAndExecute(permission, action) {
    if (currentUser.hasPermission(permission)) {
        return action();
    } else {
        messageService.toast('error', '权限不足，无法执行此操作');
        return Promise.reject(new Error('Permission denied'));
    }
}
```

### 5.2 日志收集和分析

#### 前端日志收集
```javascript
// 全局错误处理
window.addEventListener('error', function(event) {
    const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // 发送错误日志到服务器
    sendErrorLog(errorInfo);
});

// Promise错误处理
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    sendErrorLog({
        type: 'unhandledrejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
    });
});
```

## 6. 环境相关问题

### 6.1 开发环境问题

#### 本地开发服务器
```bash
# 检查开发服务器状态
netstat -an | grep :8080

# 检查API代理配置
cat gulpfile.js | grep -A 10 "proxy"
```

#### 跨域问题
```javascript
// 检查CORS配置
fetch('/api/jao/cron', {
    method: 'GET',
    mode: 'cors'
}).then(response => {
    console.log('CORS test:', response.status);
}).catch(error => {
    console.error('CORS error:', error);
});
```

### 6.2 生产环境问题

#### 静态资源加载
```bash
# 检查静态资源
curl -I http://localhost:8080/app/modules/jao/cronJob/cron-job-list.html
```

#### 缓存问题
```javascript
// 清除浏览器缓存
if ('caches' in window) {
    caches.keys().then(names => {
        names.forEach(name => {
            caches.delete(name);
        });
    });
}
```

## 7. 监控和预警

### 7.1 性能监控
```javascript
// 页面性能监控
function monitorPagePerformance() {
    const perfData = performance.getEntriesByType('navigation')[0];
    const metrics = {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        request: perfData.responseStart - perfData.requestStart,
        response: perfData.responseEnd - perfData.responseStart,
        dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        load: perfData.loadEventEnd - perfData.loadEventStart
    };
    
    console.log('Performance metrics:', metrics);
    return metrics;
}
```

### 7.2 错误率监控
```javascript
// API错误率统计
const apiStats = {
    total: 0,
    errors: 0,
    
    record: function(success) {
        this.total++;
        if (!success) this.errors++;
    },
    
    getErrorRate: function() {
        return this.total > 0 ? (this.errors / this.total) * 100 : 0;
    }
};

// 定期报告错误率
setInterval(() => {
    const errorRate = apiStats.getErrorRate();
    if (errorRate > 10) { // 错误率超过10%
        console.warn('High error rate detected:', errorRate + '%');
    }
}, 60000);
```

## 8. 快速修复清单

### 8.1 页面无法访问
- [ ] 检查路由配置
- [ ] 验证模板文件存在
- [ ] 确认脚本文件加载
- [ ] 检查权限配置

### 8.2 数据加载失败
- [ ] 测试API连接
- [ ] 检查网络请求
- [ ] 验证数据格式
- [ ] 确认后端服务状态

### 8.3 功能操作异常
- [ ] 检查用户权限
- [ ] 验证事件绑定
- [ ] 测试API调用
- [ ] 检查错误处理

### 8.4 性能问题
- [ ] 分析网络请求
- [ ] 检查内存使用
- [ ] 优化数据加载
- [ ] 实现缓存策略

通过以上诊断指南，可以系统性地排查和解决JAO任务调度模块的各种问题。建议在遇到问题时，按照诊断步骤逐一检查，并使用提供的工具和方法进行深入分析。