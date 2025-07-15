# API接口文档

## 1. API基础信息

### 1.1 基础配置
- **API基础URL**: `/oplus-portal/jao`
- **完整API路径**: `http://localhost:8080/oplus-portal/jao/api/jao/cron`
- **认证方式**: Session认证
- **数据格式**: JSON

### 1.2 通用响应格式
```json
{
  "code": "200",
  "message": "success",
  "data": {}
}
```

### 1.3 错误响应格式
```json
{
  "code": "500",
  "message": "error message",
  "data": null
}
```

## 2. 任务调度CRUD接口

### 2.1 查询所有任务调度

**接口地址**: `GET /api/jao/cron`

**请求参数**: 无

**响应示例**:
```json
[
  {
    "id": "61",
    "jobDesc": "系统巡检任务",
    "scheduleConf": "0 0/5 * * * ?",
    "jobType": "script",
    "jobId": "script_001",
    "appCode": "system",
    "triggerStatus": "1",
    "author": "admin",
    "jobParam": {
      "hosts": ["server1", "server2"],
      "timeout": "300"
    },
    "logOutput": true,
    "isEncrypt": false,
    "createTime": "2024-01-01 10:00:00",
    "updateTime": "2024-01-01 10:00:00"
  }
]
```

**字段说明**:
- `id`: 任务ID
- `jobDesc`: 任务描述
- `scheduleConf`: CRON表达式
- `jobType`: 作业类型 (script/rest/cac/cmd/flows)
- `jobId`: 关联的作业ID
- `appCode`: 应用代码
- `triggerStatus`: 触发状态 (0-停用, 1-启用)
- `author`: 创建者
- `jobParam`: 作业参数对象
- `logOutput`: 是否输出日志
- `isEncrypt`: 是否加密参数

### 2.2 根据ID查询任务调度

**接口地址**: `GET /api/jao/cron/{id}`

**路径参数**:
- `id`: 任务ID

**响应示例**: 同查询所有任务的单个对象格式

### 2.3 新增任务调度

**接口地址**: `POST /api/jao/cron`

**请求体示例**:
```json
{
  "jobDesc": "新建定时任务",
  "scheduleConf": "0 0 2 * * ?",
  "jobType": "script",
  "jobId": "script_002",
  "appCode": "system",
  "jobParam": {
    "scriptPath": "/opt/scripts/backup.sh",
    "hosts": ["server1"]
  },
  "logOutput": true,
  "isEncrypt": false
}
```

**响应示例**:
```json
{
  "code": "200",
  "message": "任务创建成功",
  "data": {
    "id": "62"
  }
}
```

### 2.4 更新任务调度

**接口地址**: `PUT /api/jao/cron`

**请求体**: 包含id字段的完整任务对象

**响应示例**:
```json
{
  "code": "200",
  "message": "任务更新成功"
}
```

### 2.5 删除任务调度

**接口地址**: `DELETE /api/jao/cron/{id}`

**路径参数**:
- `id`: 任务ID

**响应示例**:
```json
{
  "code": "200",
  "message": "任务删除成功"
}
```

### 2.6 复制任务调度

**接口地址**: `GET /api/jao/cron/copy/{id}`

**路径参数**:
- `id`: 源任务ID

**响应示例**:
```json
{
  "code": "200",
  "message": "任务复制成功",
  "data": {
    "id": "63"
  }
}
```

## 3. 任务控制接口

### 3.1 启动任务调度

**接口地址**: `GET /api/jao/cron/start/{id}`

**路径参数**:
- `id`: 任务ID

**响应示例**:
```json
{
  "code": "200",
  "message": "任务启动成功"
}
```

### 3.2 停止任务调度

**接口地址**: `GET /api/jao/cron/stop/{id}`

**路径参数**:
- `id`: 任务ID

**响应示例**:
```json
{
  "code": "200",
  "message": "任务停止成功"
}
```

### 3.3 立即执行任务

**接口地址**: `GET /api/jao/cron/execute/{id}`

**路径参数**:
- `id`: 任务ID

**响应示例**:
```json
{
  "code": "200",
  "message": "任务执行成功",
  "data": {
    "runId": "run_20240101_001"
  }
}
```

### 3.4 批量启停任务

**接口地址**: `POST /api/jao/cron/start-stop`

**请求体示例**:
```json
{
  "61": "0",
  "62": "1",
  "63": "0"
}
```

**字段说明**:
- 键: 任务ID
- 值: 目标状态 (0-停用, 1-启用)

**响应示例**:
```json
{
  "code": "200",
  "message": "批量操作成功"
}
```

## 4. 辅助功能接口

### 4.1 获取CRON表达式下次执行时间

**接口地址**: `GET /api/jao/cron/nextTriggerTime`

**查询参数**:
- `scheduleConf`: CRON表达式

**请求示例**:
```
GET /api/jao/cron/nextTriggerTime?scheduleConf=0 0/5 * * * ?
```

**响应示例**:
```json
[
  {
    "next": [
      "2024-01-01 10:05:00",
      "2024-01-01 10:10:00",
      "2024-01-01 10:15:00",
      "2024-01-01 10:20:00",
      "2024-01-01 10:25:00"
    ]
  }
]
```

### 4.2 批量获取CRON表达式执行时间

**接口地址**: `POST /api/jao/cron/next-trigger-times`

**请求体示例**:
```json
[
  "0 0/5 * * * ?",
  "0 0 2 * * ?",
  "0 30 8 * * ?"
]
```

**响应示例**:
```json
[
  {
    "cron": "0 0/5 * * * ?",
    "next": ["2024-01-01 10:05:00", "2024-01-01 10:10:00"]
  },
  {
    "cron": "0 0 2 * * ?",
    "next": ["2024-01-02 02:00:00", "2024-01-03 02:00:00"]
  }
]
```

### 4.3 根据应用代码查询任务

**接口地址**: `GET /api/jao/cron/app`

**查询参数**:
- `appCode`: 应用代码

**请求示例**:
```
GET /api/jao/cron/app?appCode=system
```

**响应示例**: 同查询所有任务的数组格式

## 5. 依赖服务接口

### 5.1 获取CAC模板数据

**接口地址**: `GET /api/cac/v2/templates`

**响应示例**:
```json
[
  {
    "id": "template_001",
    "name": "系统配置检查",
    "description": "检查系统基础配置"
  }
]
```

### 5.2 获取应用列表

**服务**: `appletService.findApplets()`

**响应示例**:
```json
[
  {
    "name": "system",
    "title": "系统管理",
    "code": "system"
  }
]
```

## 6. 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未授权 | 检查用户登录状态 |
| 403 | 权限不足 | 检查用户权限配置 |
| 404 | 资源不存在 | 检查任务ID是否正确 |
| 500 | 服务器内部错误 | 检查后端服务状态 |

## 7. API调用示例

### 7.1 JavaScript调用示例

```javascript
// 查询任务列表
cronJobService.cronRestInterface("query").then(function(data) {
    console.log('任务列表:', data);
}).catch(function(error) {
    console.error('查询失败:', error);
});

// 启动任务
cronJobService.cronRestInterface("start", taskId).then(function(result) {
    console.log('启动成功:', result);
});

// 获取下次执行时间
cronJobService.cronRestInterface("scheduleConf", "0 0/5 * * * ?").then(function(data) {
    console.log('下次执行时间:', data[0].next);
});
```

### 7.2 cURL调用示例

```bash
# 查询任务列表
curl -X GET "http://localhost:8080/oplus-portal/jao/api/jao/cron" \
  -H "Content-Type: application/json"

# 创建新任务
curl -X POST "http://localhost:8080/oplus-portal/jao/api/jao/cron" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDesc": "测试任务",
    "scheduleConf": "0 0 2 * * ?",
    "jobType": "script",
    "jobId": "test_001",
    "appCode": "system"
  }'

# 启动任务
curl -X GET "http://localhost:8080/oplus-portal/jao/api/jao/cron/start/61"
```

## 8. API性能说明

### 8.1 响应时间
- 查询接口: < 500ms
- 创建/更新接口: < 1s
- 控制接口: < 200ms

### 8.2 并发限制
- 单用户并发: 10个请求/秒
- 系统总并发: 100个请求/秒

### 8.3 数据限制
- 任务列表最大返回: 1000条
- 任务描述最大长度: 500字符
- 参数对象最大大小: 10KB