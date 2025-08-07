# 单阶段构建 Dockerfile for oplus-web
# 使用预构建的dist包
FROM nginx:1.25-alpine

# 安装必要的工具
RUN apk add --no-cache \
    curl \
    tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

# 删除默认的nginx配置
RUN rm /etc/nginx/conf.d/default.conf \
    && rm -rf /usr/share/nginx/html/*

# 复制生产环境nginx配置
COPY nginx-config/production.conf /etc/nginx/conf.d/default.conf

# 复制预构建的dist文件
COPY dist /usr/share/nginx/html

# 设置正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# 创建nginx运行用户的目录
RUN mkdir -p /var/cache/nginx/client_temp \
    && chown -R nginx:nginx /var/cache/nginx

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 暴露端口
EXPOSE 80

# 添加标签信息
LABEL maintainer="oplus-team" \
      version="1.0" \
      description="Oplus Web Application" \
      build-date="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]