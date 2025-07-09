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

# 安装全局依赖
RUN npm install -g gulp@3.9.1 bower@1.8.8

# 创建启动脚本
RUN echo '#!/bin/bash\n\
if [ ! -d "node_modules" ]; then\n\
  echo "安装 npm 依赖..."\n\
  npm install\n\
fi\n\
if [ ! -d "src/webapp/bower_components" ]; then\n\
  echo "安装 bower 依赖..."\n\
  cd src/webapp && bower install --allow-root\n\
fi\n\
exec "$@"' > /entrypoint.sh && chmod +x /entrypoint.sh

# 默认暴露端口（如有需要）
EXPOSE 8888
EXPOSE 35729

# 设置入口点
ENTRYPOINT ["/entrypoint.sh"]