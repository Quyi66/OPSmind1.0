# Oplus Web 部署文档

本文档说明如何部署 oplus-web Docker 镜像。

## 前置要求

- Docker 已安装并运行
- 端口 80 或其他指定端口可用

## 1. 配置文件说明

### 内置配置
- 镜像已内置生产环境配置，后端地址为 `127.0.0.1:8080`
- 包含 gzip 压缩、安全头、静态资源缓存等优化

### 自定义配置
- 可通过 `-v` 参数挂载本地配置文件覆盖默认配置
- 参考模板：`nginx-config/oplus-web.conf`
- 根据实际环境修改后端服务器地址

## 2. 快速部署命令

```bash
# 1. 加载镜像
docker load -i oplus-web-1.0.0.tar

# 2. 自定义配置启动
docker run -d --name oplus-web -p 8080:80 \
  -v $(pwd)/nginx-config/oplus-web.conf:/etc/nginx/conf.d/oplus-web.conf:ro \
  --restart unless-stopped oplus-web:latest

```

## 3. 验证部署

### 3.1 检查容器状态

```bash
# 查看容器状态
docker ps | grep oplus-web

# 查看容器日志
docker logs oplus-web
```

## 4. 容器管理

### 4.1 基本操作

```bash
# 停止容器
docker stop oplus-web

# 启动容器
docker start oplus-web

# 重启容器
docker restart oplus-web

# 删除容器
docker stop oplus-web && docker rm oplus-web
```

### 4.2 查看日志

```bash
# 查看日志
docker logs oplus-web

# 实时查看日志
docker logs -f oplus-web
```

## 5. 故障排查

```bash
# 检查容器状态
docker ps -a | grep oplus-web

# 检查端口占用
netstat -tlnp | grep :80

# 测试 nginx 配置
docker exec oplus-web nginx -t

# 查看错误日志
docker exec oplus-web cat /var/log/nginx/error.log
```
