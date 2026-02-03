# CVE查询接口文档

**基础路径**: `/api/vap/v2/cve`

---

## 接口列表

| 序号 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 1 | /list | GET | 分页查询CVE列表（支持多条件搜索） |
| 2 | /detail/{cveId} | GET | 查询CVE详情（包含包状态） |
| 3 | /statistics | GET | 获取统计概览 |

---

## 1. 分页查询CVE列表

**GET** `/api/vap/v2/cve/list`

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| source | string | 否 | - | 数据源：`redhat` / `kylin` |
| severity | string | 否 | - | 严重等级：`critical` / `important` / `moderate` / `low` |
| keyword | string | 否 | - | 关键字（搜索CVE ID或描述） |
| packageName | string | 否 | - | 包名 |
| startDate | string | 否 | - | 开始日期（格式：yyyy-MM-dd） |
| endDate | string | 否 | - | 结束日期（格式：yyyy-MM-dd） |
| page | int | 否 | 0 | 页码（从0开始） |
| size | int | 否 | 20 | 每页数量 |
| sortBy | string | 否 | publicDate | 排序字段：`publicDate` / `severity` / `cveId` |
| sortDir | string | 否 | desc | 排序方向：`asc` / `desc` |

### 请求示例

```
GET /api/vap/v2/cve/list?source=redhat&severity=critical&page=0&size=10
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| content | array | CVE列表 |
| totalElements | long | 总记录数 |
| totalPages | int | 总页数 |
| size | int | 每页数量 |
| number | int | 当前页码 |
| first | boolean | 是否首页 |
| last | boolean | 是否末页 |

### content数组元素

| 参数 | 类型 | 说明 |
|------|------|------|
| id | long | 主键ID |
| cveId | string | CVE编号 |
| source | string | 数据源（redhat/kylin） |
| severity | string | 严重等级 |
| severityLabel | string | 严重等级中文 |
| publicDate | datetime | 发布日期 |
| description | string | 描述 |
| cvss3Score | decimal | CVSS 3.x评分 |
| fixedCount | int | 已修复包数量 |
| affectedCount | int | 受影响包数量 |
| notAffectedCount | int | 不受影响包数量 |

### 响应示例

```json
{
  "content": [
    {
      "id": 1,
      "cveId": "CVE-2025-26597",
      "source": "redhat",
      "severity": "important",
      "severityLabel": "高危",
      "publicDate": "2025-02-25T00:00:00",
      "description": "A buffer overflow vulnerability in X.Org server...",
      "cvss3Score": 7.8,
      "fixedCount": 5,
      "affectedCount": 2,
      "notAffectedCount": 10,
      "willNotFixCount": 3,
      "outOfSupportCount": 4
    }
  ],
  "totalElements": 45000,
  "totalPages": 4500,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false
}
```

---

## 2. 查询CVE详情

**GET** `/api/vap/v2/cve/detail/{cveId}`

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cveId | string | 是 | CVE编号，如 `CVE-2025-26597` |

### 请求示例

```
GET /api/vap/v2/cve/detail/CVE-2025-26597
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| cveId | string | CVE编号 |
| sources | array | 数据源列表（同一CVE可能有多个数据源） |

### sources数组元素

| 参数 | 类型 | 说明 |
|------|------|------|
| source | string | 数据源（redhat/kylin） |
| severity | string | 严重等级 |
| severityLabel | string | 严重等级中文 |
| publicDate | datetime | 发布日期 |
| description | string | 描述 |
| cvss3Score | decimal | CVSS 3.x评分 |
| cwe | string | CWE分类 |
| webUrl | string | 官方详情链接 |
| summary | object | 统计摘要 |
| packages | object | 包状态详情（按状态分组） |

### summary对象

| 参数 | 类型 | 说明 |
|------|------|------|
| fixed | int | 已修复数量 |
| affected | int | 受影响数量 |
| notAffected | int | 不受影响数量 |
| willNotFix | int | 不修复数量 |
| outOfSupport | int | 超出支持数量 |
| total | int | 总数量 |

### packages对象

按状态分组的包列表，key为状态值（fixed/affected/not_affected/will_not_fix/out_of_support/fix_deferred）

| 参数 | 类型 | 说明 |
|------|------|------|
| productName | string | 产品/系统名称 |
| packageName | string | 包名 |
| fixedVersion | string | 修复版本（仅fixed状态有值） |
| status | string | 状态 |
| statusLabel | string | 状态中文 |
| advisory | string | 安全公告编号 |
| architecture | string | 架构（x86_64/aarch64等） |

### 响应示例

```json
{
  "cveId": "CVE-2025-26597",
  "sources": [
    {
      "source": "redhat",
      "severity": "important",
      "severityLabel": "高危",
      "publicDate": "2025-02-25T00:00:00",
      "description": "A buffer overflow vulnerability in X.Org server...",
      "cvss3Score": 7.8,
      "cwe": "CWE-122",
      "webUrl": "https://access.redhat.com/security/cve/CVE-2025-26597",
      "summary": {
        "fixed": 5,
        "affected": 2,
        "notAffected": 10,
        "willNotFix": 3,
        "outOfSupport": 4,
        "total": 24
      },
      "packages": {
        "fixed": [
          {
            "productName": "Red Hat Enterprise Linux 8",
            "packageName": "tigervnc",
            "fixedVersion": "tigervnc-1.13.1-8.el8_10",
            "status": "fixed",
            "statusLabel": "已修复",
            "advisory": "RHSA-2025:0863",
            "architecture": ""
          }
        ],
        "will_not_fix": [
          {
            "productName": "Red Hat Enterprise Linux 7",
            "packageName": "tigervnc",
            "fixedVersion": "",
            "status": "will_not_fix",
            "statusLabel": "不修复",
            "advisory": "",
            "architecture": ""
          }
        ],
        "out_of_support": [
          {
            "productName": "Red Hat Enterprise Linux 6",
            "packageName": "xorg-x11-server",
            "fixedVersion": "",
            "status": "out_of_support",
            "statusLabel": "超出支持",
            "advisory": "",
            "architecture": ""
          }
        ]
      }
    },
    {
      "source": "kylin",
      "severity": "important",
      "severityLabel": "高危",
      "publicDate": null,
      "description": "",
      "cvss3Score": null,
      "cwe": "",
      "webUrl": "https://support.kylinos.cn/#/security/cveDetail?allTitle=CVE-2025-26597",
      "summary": {
        "fixed": 3,
        "affected": 0,
        "notAffected": 5,
        "willNotFix": 0,
        "outOfSupport": 0,
        "total": 8
      },
      "packages": {
        "fixed": [
          {
            "productName": "银河麒麟高级服务器操作系统 V10",
            "packageName": "tigervnc",
            "fixedVersion": "1.13.1-3.ky10",
            "status": "fixed",
            "statusLabel": "已修复",
            "advisory": "KYSA-202502-0123",
            "architecture": "x86_64"
          }
        ],
        "not_affected": [
          {
            "productName": "银河麒麟高级服务器操作系统 V10 SP1",
            "packageName": "",
            "fixedVersion": "",
            "status": "not_affected",
            "statusLabel": "不受影响",
            "advisory": "",
            "architecture": "aarch64"
          }
        ]
      }
    }
  ]
}
```

---

## 3. 获取统计概览

**GET** `/api/vap/v2/cve/statistics`

### 请求示例

```
GET /api/vap/v2/cve/statistics
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| totalCves | long | CVE总数 |
| bySource | object | 按数据源统计 |
| bySeverity | object | 按严重等级统计 |

### 响应示例

```json
{
  "totalCves": 50000,
  "bySource": {
    "redhat": 45000,
    "kylin": 5000
  },
  "bySeverity": {
    "critical": 5000,
    "important": 15000,
    "moderate": 20000,
    "low": 10000
  }
}
```

---

## 附录

### 严重等级对照表

| 英文 | 中文 | 说明 |
|------|------|------|
| critical | 严重 | 严重漏洞，需立即修复 |
| important | 高危 | 高危漏洞，建议尽快修复 |
| moderate | 中危 | 中等风险，计划修复 |
| low | 低危 | 低风险，可选修复 |

### 包状态对照表

| 状态 | 英文 | 中文 | 说明 |
|------|------|------|------|
| fixed | fixed | 已修复 | 已发布补丁包 |
| affected | affected | 受影响 | 受影响，待处理 |
| not_affected | not_affected | 不受影响 | 不受该漏洞影响 |
| will_not_fix | will_not_fix | 不修复 | 官方决定不修复 |
| fix_deferred | fix_deferred | 延迟修复 | 计划后续版本修复 |
| out_of_support | out_of_support | 超出支持 | 产品已停止支持 |

### 数据源

| 值 | 说明 |
|------|------|
| redhat | Red Hat官方CVE数据 |
| kylin | 麒麟操作系统CVE数据 |

