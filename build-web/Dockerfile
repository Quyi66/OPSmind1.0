# OPLUS Web应用 Dockerfile
# 基于已构建的dist目录，直接打包为nginx镜像

FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="OPLUS Team"
LABEL description="OPLUS Web Application"
LABEL version="1.0"

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 删除默认的nginx配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义nginx配置
# 支持动态配置文件（nginx.conf.tmp优先，否则使用nginx.conf）
COPY nginx.conf* /tmp/
RUN if [ -f /tmp/nginx.conf.tmp ]; then \
        cp /tmp/nginx.conf.tmp /etc/nginx/conf.d/default.conf; \
    else \
        cp /tmp/nginx.conf /etc/nginx/conf.d/default.conf; \
    fi && \
    rm -f /tmp/nginx.conf*

# 复制已构建的dist文件
COPY dist/ /usr/share/nginx/html/

# 设置正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 创建nginx运行所需的目录
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/oplus/base/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]