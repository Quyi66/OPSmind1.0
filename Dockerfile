# 基础镜像，包含 Node 10, npm 6, Python 2.7
FROM node:10-buster

# 安装 Python 2.7
RUN apt-get update && \
    apt-get install -y python2.7 python2.7-dev && \
    ln -sf python2.7 /usr/bin/python && \
    ln -sf python2.7 /usr/bin/python2 && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制依赖声明
COPY package.json package-lock.json ./

# 安装依赖，使用 npm ci 保证锁定
RUN npm install

# 再复制其他所有文件（不包含 node_modules）
COPY . .

# 默认暴露端口（如有需要）
EXPOSE 8888
EXPOSE 35729