# 数据格式规范

## 1. 核心数据结构

### 1.1 任务调度对象 (CronJob)

```typescript
interface CronJob {
  id: string;                    // 任务ID，系统自动生成
  jobDesc: string;               // 任务描述，用户输入
  scheduleConf: string;          // CRON表达式
  jobType: JobType;              // 作业类型
  jobId: string;                 // 关联的作业ID
  appCode: string;               // 应用代码
  triggerStatus: TriggerStatus;  // 触发状态
  author: string;                // 创建者
  jobParam: JobParam;            // 作业参数对象
  logOutput: boolean;            // 是否输出日志
  isEncrypt: boolean;            // 是否加密参数
  createTime?: string;           // 创建时间
  updateTime?: string;           // 更新时间
}
```

### 1.2 作业类型枚举 (JobType)

```typescript
enum JobType {
  SCRIPT = "script",    // 脚本作业
  REST = "rest",        // REST API作业
  CAC = "cac",          // 配置审计作业
  CMD = "cmd",          // 命令作业
  FLOWS = "flows"       // 流程作业
}
```

### 1.3 触发状态枚举 (TriggerStatus)

```typescript
enum TriggerStatus {
  DISABLED = "0",       // 停用
  ENABLED = "1"         // 启用
}
```

### 1.4 作业参数对象 (JobParam)

作业参数根据不同的作业类型有不同的结构：

#### 1.4.1 脚本作业参数
```typescript
interface ScriptJobParam {
  scriptPath: string;           // 脚本路径
  argline?: string;             // 命令行参数
  hosts: string[];              // 目标主机列表
  timeout?: number;             // 超时时间（秒）
  workingDir?: string;          // 工作目录
  environment?: {[key: string]: string}; // 环境变量
}
```

#### 1.4.2 REST作业参数
```typescript
interface RestJobParam {
  url: string;                  // 请求URL
  method: HttpMethod;           // HTTP方法
  headers?: {[key: string]: string}; // 请求头
  body?: string;                // 请求体
  timeout?: number;             // 超时时间（秒）
  retryCount?: number;          // 重试次数
}
```

#### 1.4.3 CAC作业参数
```typescript
interface CacJobParam {
  templateId: string;           // 模板ID
  annex_name?: string;          // 附件名称
  hosts?: string[];             // 目标主机列表
}
```

#### 1.4.4 命令作业参数
```typescript
interface CmdJobParam {
  commandId: string;            // 命令ID
  hosts: string[];              // 目标主机列表
  timeout?: number;             // 超时时间（秒）
  runAsUser?: string;           // 执行用户
}
```

#### 1.4.5 流程作业参数
```typescript
interface FlowsJobParam {
  flowId: string;               // 流程ID
  flowParams?: {[key: string]: any}; // 流程参数
  priority?: number;            // 优先级
}
```

## 2. API请求/响应格式

### 2.1 创建任务请求格式

```json
{
  "jobDesc": "系统备份任务",
  "scheduleConf": "0 0 2 * * ?",
  "jobType": "script",
  "jobId": "backup_script_001",
  "appCode": "system",
  "jobParam": {
    "scriptPath": "/opt/scripts/backup.sh",
    "hosts": ["server1", "server2"],
    "timeout": 3600,
    "environment": {
      "BACKUP_DIR": "/backup",
      "RETENTION_DAYS": "7"
    }
  },
  "logOutput": true,
  "isEncrypt": false
}
```

### 2.2 任务列表响应格式

```json
[
  {
    "id": "61",
    "jobDesc": "系统巡检",
    "scheduleConf": "0 0/5 * * * ?",
    "jobType": "script",
    "jobId": "inspection_001",
    "appCode": "system",
    "triggerStatus": "1",
    "author": "admin",
    "jobParam": {
      "scriptPath": "/opt/scripts/inspection.sh",
      "hosts": ["server1", "server2", "server3"]
    },
    "logOutput": true,
    "isEncrypt": false,
    "createTime": "2024-01-01 10:00:00",
    "updateTime": "2024-01-01 15:30:00"
  },
  {
    "id": "62",
    "jobDesc": "API健康检查",
    "scheduleConf": "0 */2 * * * ?",
    "jobType": "rest",
    "jobId": "health_check_001",
    "appCode": "monitor",
    "triggerStatus": "1",
    "author": "admin",
    "jobParam": {
      "url": "http://api.example.com/health",
      "method": "GET",
      "timeout": 30,
      "retryCount": 3
    },
    "logOutput": true,
    "isEncrypt": false,
    "createTime": "2024-01-01 11:00:00",
    "updateTime": "2024-01-01 11:00:00"
  }
]
```

### 2.3 CRON表达式执行时间响应格式

```json
[
  {
    "next": [
      "2024-01-01 14:05:00",
      "2024-01-01 14:10:00",
      "2024-01-01 14:15:00",
      "2024-01-01 14:20:00",
      "2024-01-01 14:25:00"
    ]
  }
]
```

### 2.4 批量启停请求格式

```json
{
  "61": "0",
  "62": "1",
  "63": "1"
}
```

## 3. CRON表达式格式

### 3.1 标准格式

```
秒 分 时 日 月 周 年
0-59 0-59 0-23 1-31 1-12 0-7 1970-2099
```

### 3.2 特殊字符说明

| 字符 | 含义 | 示例 |
|------|------|------|
| * | 匹配任意值 | `* * * * * ?` 每秒执行 |
| ? | 不指定值（仅用于日和周） | `0 0 12 ? * MON` 每周一12点 |
| - | 范围 | `0 0 9-17 * * ?` 9点到17点每小时 |
| , | 列举 | `0 0 9,12,15 * * ?` 9点、12点、15点 |
| / | 步长 | `0 0/30 * * * ?` 每30分钟 |
| L | 最后 | `0 0 0 L * ?` 每月最后一天 |
| W | 工作日 | `0 0 0 15W * ?` 15号最近的工作日 |
| # | 第几个 | `0 0 0 ? * 6#3` 每月第3个周五 |

### 3.3 常用表达式示例

```javascript
const cronExamples = {
  "每秒执行": "* * * * * ?",
  "每分钟执行": "0 * * * * ?",
  "每小时执行": "0 0 * * * ?",
  "每天凌晨2点": "0 0 2 * * ?",
  "每周一上午9点": "0 0 9 ? * MON",
  "每月1号凌晨": "0 0 0 1 * ?",
  "工作日上午9点": "0 0 9 ? * MON-FRI",
  "每5分钟": "0 0/5 * * * ?",
  "每30秒": "0/30 * * * * ?",
  "每季度第一天": "0 0 0 1 1,4,7,10 ?"
};
```

## 4. 前端数据表格格式

### 4.1 DataTable配置格式

```javascript
const tableConfig = {
  data: [getPromise],           // 数据获取函数
  columns: [                    // 列定义
    {
      data: 'id',
      title: '任务ID'
    },
    {
      data: 'jobDesc',
      title: '任务描述',
      render: function(data, type, row, meta) {
        return '<span title="' + data + '">' + data + '</span>';
      }
    }
  ],
  order: [[0, 'desc']],         // 默认排序
  buttons: ['reload'],          // 工具按钮
  selection: {                  // 选择配置
    valueData: function(row) {
      return {
        id: row.id,
        scheduleConf: row.scheduleConf,
        triggerStatus: row.triggerStatus
      };
    },
    labelData: 'id',
    preselected: []
  }
};
```

### 4.2 表格行数据格式

```javascript
const tableRowData = {
  id: "61",
  jobDesc: "系统巡检任务",
  scheduleConf: "0 0/5 * * * ?",
  appCode: "系统管理",           // 已转换为应用名称
  jobType: "脚本作业",           // 已转换为显示名称
  triggerStatus: "1",
  author: "admin",
  // 用于操作按钮的原始数据
  _raw: {
    jobType: "script",
    appCode: "system"
  }
};
```

## 5. 错误数据格式

### 5.1 API错误响应

```json
{
  "code": "500",
  "message": "任务执行失败",
  "data": {
    "errorCode": "EXECUTION_FAILED",
    "errorDetail": "脚本文件不存在: /opt/scripts/missing.sh",
    "timestamp": "2024-01-01 14:30:00"
  }
}
```

### 5.2 前端错误对象

```javascript
const errorObject = {
  message: "API调用失败",
  status: 500,
  statusText: "Internal Server Error",
  data: {
    error: "Database connection failed"
  },
  config: {
    method: "GET",
    url: "/api/jao/cron"
  }
};
```

## 6. 本地存储数据格式

### 6.1 用户偏好设置

```javascript
const userPreferences = {
  taskScheduling: {
    pageSize: 20,               // 每页显示数量
    defaultJobType: "script",   // 默认作业类型
    showAdvanced: false,        // 是否显示高级选项
    autoRefresh: true,          // 是否自动刷新
    refreshInterval: 30000      // 刷新间隔（毫秒）
  }
};
```

### 6.2 缓存数据格式

```javascript
const cacheData = {
  applets: [                    // 应用列表缓存
    {
      name: "system",
      title: "系统管理"
    }
  ],
  jobTypes: [                   // 作业类型缓存
    {
      value: "script",
      label: "脚本作业"
    }
  ],
  lastUpdate: "2024-01-01T14:30:00Z"
};
```

## 7. 数据验证规则

### 7.1 前端验证规则

```javascript
const validationRules = {
  jobDesc: {
    required: true,
    maxLength: 500,
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_]+$/
  },
  scheduleConf: {
    required: true,
    pattern: /^[0-9\*\-\,\/\?\sA-Z]+$/,
    custom: validateCronExpression
  },
  jobType: {
    required: true,
    enum: ["script", "rest", "cac", "cmd", "flows"]
  },
  appCode: {
    required: true,
    maxLength: 50
  }
};
```

### 7.2 数据转换函数

```javascript
// 状态转换
function convertTriggerStatus(status) {
  return status === "1" ? "启用" : "停用";
}

// 作业类型转换
function convertJobType(type) {
  const typeMap = {
    "script": "脚本作业",
    "rest": "REST作业",
    "cac": "配置审计",
    "cmd": "命令作业",
    "flows": "流程作业"
  };
  return typeMap[type] || type;
}

// 时间格式转换
function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN');
}
```

## 8. 数据同步机制

### 8.1 实时数据更新

```javascript
// 数据更新事件
const dataUpdateEvents = {
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",
  TASK_STATUS_CHANGED: "task.status.changed"
};

// 数据同步配置
const syncConfig = {
  enableRealtime: true,
  syncInterval: 30000,          // 30秒同步一次
  maxRetries: 3,
  retryDelay: 5000
};
```

### 8.2 数据一致性检查

```javascript
// 数据完整性验证
function validateDataIntegrity(data) {
  const requiredFields = ['id', 'jobDesc', 'scheduleConf', 'jobType'];
  return requiredFields.every(field => data.hasOwnProperty(field));
}

// 数据版本控制
const dataVersion = {
  version: "1.0.0",
  lastSync: "2024-01-01T14:30:00Z",
  checksum: "abc123def456"
};
```