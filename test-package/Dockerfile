# 多阶段构建 Dockerfile
# 第一阶段：构建应用
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build:prod

# 复制node_modules文件到dist
RUN node scripts/copy-node-modules.js

# 第二阶段：Nginx服务器
FROM nginx:alpine

# 删除默认的nginx配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/conf.d/

# 从构建阶段复制dist文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]