## 常见问题 {docsify-ignore}

### 执行脚本还是执行作业
Q：如果要运行一个脚本，是在脚本管理中运行，还是在作业中运行？  
A：首先我们要了解，执行脚本只是一种类型的作业，即脚本作业。
脚本管理中的脚本执行功能，主要是为了测试脚本功能的运行，相当于是一个临时的脚本作业。
在作业中定义的脚本执行，具有更丰富的功能，例如设定执行参数默认值，设定日志等，更重要的是，定义好的作业可以在“自助页面”模块中使用，可以方便的实现操作界面

### 配置错误

1. 在使用Tower的时候，脚本作业选择Ansible作为引擎，有些场景会出现下面错误
```
Using a SSH password instead of a key is not possible because Host Key checking is enabled and sshpass does not support this. Please add this host's fingerprint to your known_hosts file to manage this host.
```

2. 使用Tower，Playbook在`localhost`执行某些模块（例如`template`）出现sudo错误，
```
sudo: effective uid is not 0, is /usr/bin/sudo on a file system with the 'nosuid' option set or an NFS file system without root privileges?
```
原因是Tower是用`awx`用户来执行ansible，对于localhost的操作一般是使用`ansible_connection=local`，而不是ssh，
这种情况下无法像操作一般远程主机那样ssh然后sudo，ansible还是用`awx`用户在本地操作。
解决方案：给awx用户赋予sudo权限。

3. Tower环境下，Playbook在localhost`/tmp`目录下写的文件找不到。 
Tower的[Job Isolation](https://docs.ansible.com/ansible-tower/latest/html/userguide/security.html#playbook-access-and-information-sharing)设置会隐藏task的/tmp目录
> [!NOTE]
> By default, process isolation hides the following directories from the above tasks:
> `/etc/tower` - to prevent exposing Tower configuration
> `/var/lib/awx` - with the exception of the current project being used (for regular job templates)
> `/var/log`
> `/tmp` (or whatever the system temp directory is) - with the exception of the processes’ own temp files.

