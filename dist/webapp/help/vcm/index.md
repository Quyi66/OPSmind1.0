# vCenter Manager {docsify-ignore}

vCenter Manager 功能提供了对团队 vCenter 资源的管理, 在配置好相关连接参数后实时刷新 vCenter 内的 <ESXi / Cluster / Datastore / VMs / Template / 告警 / 事件 / 任务> 等指标, 并支持根据 Template 创建/批量创建虚拟机的功能, 同时对 NSX服务器 也有部分支持

主要功能：

- **总览**：提供所有已配置的 vCenter Server 的统计指标, 如 <CPU / 内存 / 存储 / 告警 / 异常>, 并支持根据选择的 vCenter Server 查看统计指标
- **ESXi 主机与集群**：展示 ESXi 主机与集群的各项指标
- **虚拟机与模板**：展示虚拟机与模板的各项指标, 并支持对虚拟机进行开关机任务下发
- **告警**：展示告警信息
- **事件与任务**：展示事件与任务的信息
- **操作记录**：可以查看历史下发作业的运行记录
- **参数配置**：可以配置 vCenter Server 的各项参数