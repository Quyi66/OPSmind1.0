# 多阶段构建：基础镜像
FROM node:10-buster as base

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y \
    python2.7 \
    python2.7-dev \
    build-essential \
    && ln -sf python2.7 /usr/bin/python \
    && ln -sf python2.7 /usr/bin/python2 \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 安装全局依赖（已移除gulp，现在使用webpack）

# 多阶段构建：依赖安装阶段
FROM base as dependencies

# 复制package.json和package-lock.json（如果存在）
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci --only=production --silent && npm cache clean --force

# 多阶段构建：开发环境
FROM base as development

# 复制依赖
COPY --from=dependencies /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 运行postinstall脚本
RUN npm run postinstall || echo "postinstall failed, continuing..."

# 创建优化的启动脚本
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# 确保输出目录存在\n\
mkdir -p /app/output\n\
\n\
# 如果是开发模式，启动实时重载\n\
if [ "$NODE_ENV" = "development" ]; then\n\
    echo "🚀 启动开发模式..."\n\
    exec "$@"\n\
else\n\
    echo "📦 构建生产环境..."\n\
    exec "$@"\n\
fi' > /entrypoint.sh && chmod +x /entrypoint.sh

# 暴露端口
EXPOSE 8888 35729

# 设置入口点
ENTRYPOINT ["/entrypoint.sh"]

# 默认命令
CMD ["npm", "run", "serve"]

# 多阶段构建：生产环境
FROM base as production

# 复制依赖
COPY --from=dependencies /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 运行postinstall脚本
RUN npm run postinstall || echo "postinstall failed, continuing..."

# 构建生产版本
RUN npm run dist

# 设置入口点
ENTRYPOINT ["/entrypoint.sh"]

# 默认命令
CMD ["echo", "Production build completed. Check /app/output directory."]