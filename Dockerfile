# 使用官方nginx镜像作为基础镜像
FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="oplus-team"
LABEL description="Oplus Web Application with Nginx"

# 删除默认的nginx配置文件，创建模板目录
RUN rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /etc/nginx/templates

# 复制自定义nginx配置模板和启动脚本
COPY nginx-config/oplus-web.conf /etc/nginx/templates/oplus-web.conf.template
COPY docker/nginx-backend-url.sh /docker-entrypoint.d/30-backend-url.sh
RUN chmod 755 /docker-entrypoint.d/30-backend-url.sh

# 后端服务默认地址，可通过环境变量覆盖
ENV BACKEND_URL=http://10.1.40.228:18080

# 复制预构建的dist包到nginx默认静态文件目录
# 确保dist目录包含完整的构建产物和node_modules
COPY dist/ /usr/share/nginx/html/

# 设置正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 创建nginx运行所需的目录
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
