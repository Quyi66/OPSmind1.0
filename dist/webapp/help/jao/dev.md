## 开发指南 {docsify-ignore}

### Ansible Playbook编写

Playbook可以以zip包或目录的形式提供。一个最简单的playbook结构如下：

```
simple-playbook/
  |--hosts              --> 可选
  +--site.yml           --> 必须  
```

hosts文件是可选的，一般在需要对多个主机组进行操作的时候需要用到。在hosts中，可以使用`#oplus-var:hosts`作为占位符。
一键作业在执行的时候，会把占位符替换成作业对应的主机。

例如`fetch-seclog`，
```ini
[servers]
#通过`#oplus-var:hosts`占位符来设定主机，在执行的时候会被替换成传入的主机
#oplus-var:hosts

[fileserver]
#文件服务器的IP，固定值
127.0.0.1
```

### 回调API开发

回调API是一个RESTful API URL，用于接收作业执行完成后回传的数据。API需要能够支持如下格式的请求：

```bash
curl -X POST '<callback_url>' -d '<callback_data>' -H 'Content-Type:application/json;charset=UTF-8' -H 'Tenant-Id:<tenant_id>'
```
其中：
- `<callback_url>`: 回调API的URL
- `<tenant_id>`: 作业回传的租户ID
- `<callback_data>`: 作业回传的结果数据，格式如下：

`<callback_data>` 有三种格式，取决于Playbook的输出。

1. 格式一：
```json
{
  "runId": "string",
  "batches": [
     {
        "runId": "string",
        "batchId": "string",
        "output": "string"
     }
  ]
}
```
- `batches[].output`：playbook的原始输出，格式为`AnsibleOutput`的JSON字符串。

2. 格式二：如果Playbook包含名为`$OPLUS_RESULT$`的任务，那么这个任务的输出将被作为回调数据

````json
{
  "runId": "string",
  "batches": [
     {
        "result": *
     }
  ]
}
````

- `runId`: 作业运行的ID
- `batches`: 作业的批次，一个作业可能会包含多个批次结果，每个元素代表一批结果数据
- `batches[].result`: 一批结果数据，类型由API定义。一键作业会把脚本输出的`$OPLUS_RESULT$`部分作为最终结果，放在各个批次的`result`字段里面。

`$OPLUS_RSEULT:merge$`

