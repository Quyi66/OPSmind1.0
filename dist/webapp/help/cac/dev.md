## 开发指南 {docsify-ignore}

### 巡检脚本的编写

#### 编写规范
巡检脚本由Ansible playbook编写，编写的规范如下：

- 通过task来组织检查项
    1. 不是所有的task都是检查项，只有name以`[RULE]`前缀开头的task才会被认为是检查项。
    采用前缀的原因是因为有时候需要多个task才能完成一项检查。
    2. task可以通过任意Ansible模块（例如shell、command、script、stat等）来完成检查工作。
    3. 一个检查项结果的状态判断规则如下：
      - 如果task的结果`failed`为`true`，那么该检查项为`失败`
      - 否则，有两种情形：
        * 如果task的输出`stdout`或者`msg`，以`[CHECK]`开头，那么该检查项为`人工判断`
        * 否则，检查项为`通过`
    4. task的输出（`stdout`、`stderr`或`msg`，Ansible不同的模块使用的输出属性不同）会作为检查项的输出值。
    
检查项的task编写示例
```yaml
- name: "[RULE]主机名必须大写"
  #----通过一个表达式判断task是否failed
  failed_when: "ansible_hostname | regex_search('[a-z]')"
  #----把hostname的值作为检查项的输出
  debug:
    msg: "{{ansible_hostname}}"
  changed_when: false
  ignore_errors: true

  #----这个不是检查项，task name没有以[RULE]开头
- name: "列出crontab"
  shell: crontab -l
  register: crontab_result
  ignore_errors: true

- name: "[RULE]检查crontab"
  #----把前一个任务的输出作为检查项输出，同时标记[CHECK]，表明检查项结果为“人工核查”
  debug:
    msg: "[CHECK]Crontab:\n{{crontab_result.stdout}}"
  ignore_errors: true
```
注意上面的每个任务都加了一个`ignore_errors: true`，表示即使该task失败了，还要继续下一个检查任务。

- 通过脚本来组织检查项
    1. 检查项的名字应在脚本第一行输出`####CHECK_ITEM:<检查项名>`，如`echo "####CHECK_ITEM:系统运行时长"`，那么该检查项为`系统运行时长`。
    若脚本不按`####CHECK_ITEM:<检查项名>`输出检查项名，那么默认检查项名为脚本名。
    2. 与task组织检查项为`人工判断`的要求一致，脚本在检查项名输出之后，以`[CHECK]`开头，那么该检查项为`人工判断`。
    3. 检查项的结果根据脚本返回码来判断，脚本返回`0`，则表示`通过`或`人工判断`，脚本返回`1`，则表示`失败`。
    4. 除检查项名`####CHECK_ITEM:<检查项名>`之外的脚本输出作为检查项的输出值。
    5. 脚本组织配置示例：

在playbook的参数文件`group_vars/all`添加对应的脚本：
```yaml
scripts:
  #----script：脚本名字
  #----argline（可选）：脚本参数
  #----condition（可选）：执行该检查项的条件
  - script: check_repo_cento.sh
    argline: -repo=public -type=boot
    condition: "{{ansible_distribution == 'CentOS'}}"
  - script: check_uptime.sh
```
获取`系统运行时长`的检查脚本示例：
```shell script
#!/bin/bash
#----输出检查项名
echo "####CHECK_ITEM:系统运行时长"

check_supported_kernel() {
    running_kernel=$(uname -r)
    if [[ "$running_kernel" != *".el"[5-7]* ]]; then
        echo "This script is meant to be used only on RHEL 5, 6 and 7"
        exit 1
    fi
    rhel_num=$(sed -r -n 's/^.*el([[:digit:]]).*$/\1/p' <<<"$running_kernel")
}

check_uptime() {
    sysuptime=$(uptime |awk -F ',' '{print $1}' |sed 's/^[ \t]*//g')
    updays=$(cat /proc/uptime| awk -F. '{run_days=$1 / 86400;printf("%d",run_days)}')

    if [ $updays -lt 365 ]; then
        echo -e "OK: System running time not over a year."
        echo -e $sysuptime
        exit 0
    else
        echo -e "Failed: System running time over a year."
        echo -e $sysuptime
        #----通过脚本返回码设置检查结果
        exit 1
    fi
}

# main
check_supported_kernel
check_uptime
```

#### playbook示例  
[playbook巡检模板](http://81.71.132.81/oplus-doc/system-check-template.zip)包含以下检查项：
1. 获取主机名，主机名必须大写
2. 列出系统的crontab，结果需要人工判断是否合规
3. 检查系统运行时长，通过脚本`check_uptime.sh`来完成检查

#### New support added(巡检API调用使用规则)
1. ansible-Playbook脚本`Play`的名称（第一个 - name）在命名加上`[API]`作为标识，且`hosts IP必须`是`localhost`
2. 下面是调用API的实例模版：

```yaml
---
- name: "Demo API Inspection[API]" # Play 名称 - 描述整体操作
  hosts: localhost #从本机
  gather_facts: true
  vars: #变量为调用api的账号密码，方式随便，只要ansible-playbook能读取到
    test_ip: 'oplus.famessoft.com'
    test_port: '443'
    test_user: 'fENMGAjnhKuvnw=='
    test_pwd: '58DYDJNHSQUaGA=='
    health_checks:
  tasks:
    - name: Login to test
      ansible.builtin.uri:
        url: "https://{{ test_ip }}:{{ test_port }}/oplus-portal/api/authenticate"
        method: POST
        validate_certs: false
        headers:
          Content-Type: "application/json"
        body_format: json
        body:
          username: "{{ test_user }}"
          password: "{{ test_pwd }}"
          rememberMe: "false"
          tenantId: "ff808081727a047f017292d0d72e0004"
        status_code: 200
        return_content: yes
      register: login_result
    
    - name: output
      debug: msg="{{ login_result.authorization }}"
    
    - name: "巡检项模版"
      ansible.builtin.uri:
        url: "https://{{ test_ip }}:{{ test_port }}/oplus-portal/cac/api/cac/v2/templates?cacheBuster=1740625501532"
        method: GET
        validate_certs: false
        headers:
          Content-Type: "application/json"
          Authorization: "{{ login_result.authorization }}"
        status_code: 200
        return_content: yes
      register: api_response  # 注册变量
      no_log: true  # 关键！隐藏此任务的详细输出（包括返回内容）
    - name: "[RULE]巡检项模版" #巡检项 [RULE]
      ansible.builtin.debug:
        msg: "{{ api_response.json }}"  # 用作Oplus解析显示的巡检项输出
```
