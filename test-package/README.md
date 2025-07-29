# OPLUS 部署配置

## 🔧 修改后端服务器

编辑 `nginx.conf` 文件第8行：

```nginx
set $backend_server "10.1.40.112:8080";  # 改为你的后端服务器IP:端口
```

## 🚀 启动容器

```bash
./start-nginx.sh
```

## 🌐 访问地址

- http://localhost:8080/oplus/base/
- http://localhost:8080/oplus-admin/
