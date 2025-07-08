## 开发指南 {docsify-ignore}

### 特别变量

在执行Playbook的时候，系统会增加以下特别变量：
- `OPLUS_GFS_DIR`：文件库的目录路径，位于Oplus主机的`/opt/oplus/assets/gfs/fs-repos/<tenant_id>`。
- `OPLUS_SERVER`: oplus服务器ip
- `OPLUS_TNT`: 租户ID
- `OPLUS_RUN_ID`: 一键作业的runId

### 使用文件库

在编写脚本时，经常会遇到如下场景：
- 收集多个远程主机上的信息（例如日志，或基础指标数据），并将收集到的信息保存成文件供下载使用。
- 将一个大的文件分发到多台远程主机上。

实现这类场景有多种方法，我们这里介绍使用文件库的方法。

#### 场景：将远程主机的文件上传到文件库

这里以Ansible所在的主机作为中间节点，先将远程主机上的文件`fetch`到Ansible主机，
再将文件从Ansible主机`copy`到文件库的`OPLUS_GFS_DIR`目录下。

inventory文件`hosts`
```ini
[servers]
#需要下载文件的远程主机

[fileserver]
#----在这里定义文件库的IP，放在fileserver主机组下面
127.0.0.1 
```

Playbook的`site.yml`文件
```yaml
- name: "从远程主机下载"
  hosts: "servers"
  tasks:
    - name: "从远程主机取回检查结果至本地"
      fetch:
        src: "/path/to/file/on/remote/host"
        dest: "/tmp/staging/"
        validate_checksum: no

- name: "上传到文件服务器"
  #----使用fileserver主机组
  hosts: "fileserver"
  gather_facts: no
  tasks:
    - name: "从本地上传文件至fileserver的results目录"
      copy:
        src: "/tmp/staging"
        #----通过特别变量OPLUS_GFS_DIR引用文件库目录
        dest: "{{OPLUS_GFS_DIR}}/results/"
        force: true
```





