## 团队管理接口文档（支持修改团队名称）

### 1. 基本信息

- **服务模块**：`oplus-portal`
- **基础路径**：`/oplus-portal/api`
- **认证方式**：与 Portal 一致（`Authorization: Bearer <token>`）
- **数据格式**：`Content-Type: application/json; charset=utf-8`

---

### 2. 数据结构：`TeamDTO`

请求 / 响应中团队对象统一使用 `TeamDTO`，字段说明如下：

```json
{
  "id": "string",              // 团队ID，新增为空，修改必填
  "name": "string",            // 团队名称（当前租户下唯一）
  "code": "string",            // 团队编码（可选，当前租户下唯一）
  "description": "string",     // 描述
  "tenantId": "string",        // 租户ID（后端填充，前端一般不传）
  "tenantName": "string",      // 租户名称（仅查询返回）
  "users": [                   // 团队成员列表（保存时需要完整传入）
    {
      "tenantUserId": "string",
      "login": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  ],
  "appletIds": [ "string" ]    // 授权应用ID列表（仅查询返回）
}
```

---

### 3. 查询团队列表

- **接口**：`GET /api/team`
- **说明**：查询当前系统所有团队（含租户名），用于团队管理列表展示。

#### 请求

```http
GET /oplus-portal/api/team HTTP/1.1
Authorization: Bearer <token>
```

#### 响应（200 OK）

```json
[
  {
    "id": "team-id-1",
    "name": "综合业务组",
    "code": "zonghe",
    "description": "综合业务。。。",
    "tenantId": "tenant-1",
    "tenantName": "某租户",
    "users": [],
    "appletIds": []
  }
]
```

---

### 4. 查询团队详情

- **接口**：`GET /api/team/{id}`
- **说明**：查询单个团队详细信息（包括成员、已授权应用等）。

#### 请求

```http
GET /oplus-portal/api/team/{id} HTTP/1.1
Authorization: Bearer <token>
```

#### 响应（200 OK）

```json
{
  "id": "team-id-1",
  "name": "综合业务组",
  "code": "zonghe",
  "description": "综合业务。。。",
  "tenantId": "tenant-1",
  "tenantName": "某租户",
  "users": [
    {
      "tenantUserId": "user-id-1",
      "login": "zhangsan",
      "firstName": "张",
      "lastName": "三",
      "email": "zhangsan@example.com"
    }
  ],
  "appletIds": [ "applet-1", "applet-2" ]
}
```

---

### 5. 新增团队（含名称）

- **接口**：`POST /api/team`
- **说明**：
  - `id` 为空时视为新增。
  - 当前租户下，`name` 和 `code`（如果传入）必须唯一。

#### 请求

```http
POST /oplus-portal/api/team HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "id": null,
  "name": "综合业务组",
  "code": "zonghe",
  "description": "综合业务。。。",
  "users": [
    { "tenantUserId": "user-id-1" },
    { "tenantUserId": "user-id-2" }
  ]
}
```

#### 成功响应（201 Created）

```http
HTTP/1.1 201 Created
Location: /api/team
X-oplus-alert: teamManagement.created
```

#### 失败响应示例

- 名称重复（当前租户）：

```json
{
  "status": "ERROR",
  "error": { "message": "The name already exists for the current tenant" }
}
```

- 编码重复（当前租户）：

```json
{
  "status": "ERROR",
  "error": { "message": "The code already exists for the current tenant" }
}
```

---

### 6. 修改团队（支持修改团队名称）

> 与新增共用 `POST /api/team` 接口，区别在于 **必须传入 `id`**。  
> 可修改字段包括：`name`、`code`、`description`、`users`。

- **接口**：`POST /api/team`
- **推荐前端流程**：
  1. 打开编辑弹窗前，调用 `GET /api/team/{id}` 获取完整 `TeamDTO`。
  2. 表单编辑后，将 **包含 `id` 在内的整条团队数据** 回传给 `POST /api/team`。

#### 请求

```http
POST /oplus-portal/api/team HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "id": "team-id-1",
  "name": "综合业务组-改名后",
  "code": "zonghe",
  "description": "综合业务，已改名",
  "users": [
    { "tenantUserId": "user-id-1" },
    { "tenantUserId": "user-id-3" }
  ]
}
```

#### 成功响应

```http
HTTP/1.1 201 Created
X-oplus-alert: teamManagement.created
```

> 说明：虽然 Header 文案是 `created`，但当请求体中包含 `id` 时，业务含义为“更新团队”。

#### 失败响应

与新增团队时相同：

- 名称重复：`The name already exists for the current tenant`
- 编码重复：`The code already exists for the current tenant`

前端应根据返回的 `message` 做错误提示。

---

### 7. 删除团队

- **接口**：`DELETE /api/team/{id}`
- **说明**：删除团队，同时删除该团队的成员关联关系。

#### 请求

```http
DELETE /oplus-portal/api/team/{id} HTTP/1.1
Authorization: Bearer <token>
```

#### 响应（200 OK）

```http
HTTP/1.1 200 OK
X-oplus-alert: teamManagement.deleted
```

---

### 8. 通过团队名称查询关联用户（可选）

如需按团队名称反查用户登录名，可使用此接口。

- **接口**：`POST /api/team/names`
- **说明**：通过团队名称列表查询关联用户登录名。

#### 请求

```http
POST /oplus-portal/api/team/names HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>
```

```json
["综合业务组", "test"]
```

#### 响应

```json
["zhangsan", "lisi"]
```

---

### 9. 前端集成要点

- **新增团队**
  - 调 `POST /api/team`，`id` 设为 `null` 或不传。
- **修改团队（包括修改名称）**
  - 先 `GET /api/team/{id}` 获取详情。
  - 表单修改后，带上 `id` 调 `POST /api/team`。
- **错误提示**
  - 捕获 400 响应中的 `error.message`，根据：
    - `The name already exists for the current tenant`
    - `The code already exists for the current tenant`
  - 显示为中文友好提示，例如：
    - “当前租户下已存在同名团队”
    - “当前租户下已存在相同编码的团队”

