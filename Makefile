# Oplus前端开发工具
# 前后台分离项目 - 前端构建与开发环境

.PHONY: help dist serve clean dev install deps

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

# 项目变量
PROJECT_NAME := oplus-frontend
DEV_PORT := 3000
DIST_PATH := output

# 显示帮助信息
help:
	@echo "$(BLUE)Oplus前端开发工具 - 前后台分离项目$(NC)"
	@echo ""
	@echo "$(YELLOW)可用命令:$(NC)"
	@echo "  $(GREEN)make dist$(NC)     构建生产版本"
	@echo "  $(GREEN)make serve$(NC)    启动开发服务器"
	@echo "  $(GREEN)make dev$(NC)      启动开发服务器 (serve的别名)"
	@echo "  $(GREEN)make clean$(NC)    清理构建文件"
	@echo "  $(GREEN)make install$(NC)  安装依赖"
	@echo "  $(GREEN)make deps$(NC)     安装依赖 (install的别名)"
	@echo "  $(GREEN)make help$(NC)     显示帮助信息"
	@echo ""
	@echo "$(YELLOW)开发流程:$(NC)"
	@echo "  1. 安装依赖: $(GREEN)make install$(NC)"
	@echo "  2. 开发调试: $(GREEN)make serve$(NC)"
	@echo "  3. 构建生产: $(GREEN)make dist$(NC)"
	@echo "  4. 清理文件: $(GREEN)make clean$(NC)"

# 构建生产版本
dist:
	@echo "$(BLUE)[INFO]$(NC) 构建生产版本..."
	@bash docker.sh dist

# 启动开发服务器
serve:
	@echo "$(BLUE)[INFO]$(NC) 启动开发服务器..."
	@bash docker.sh serve

# 启动开发服务器 (别名)
dev: serve

# 清理构建文件
clean:
	@echo "$(BLUE)[INFO]$(NC) 清理构建文件..."
	@bash docker.sh clean

# 安装依赖
install:
	@echo "$(BLUE)[INFO]$(NC) 安装项目依赖..."
	@if [ ! -d "node_modules" ]; then \
		echo "$(YELLOW)[WARN]$(NC) node_modules目录不存在，开始安装依赖..."; \
		npm install; \
		echo "$(GREEN)[SUCCESS]$(NC) 依赖安装完成"; \
	else \
		echo "$(GREEN)[INFO]$(NC) node_modules已存在，跳过依赖安装"; \
	fi

# 安装依赖 (别名)
deps: install

# 显示项目信息
info:
	@echo "$(BLUE)项目信息:$(NC)"
	@echo "  项目名称: $(GREEN)$(PROJECT_NAME)$(NC)"
	@echo "  开发端口: $(GREEN)$(DEV_PORT)$(NC)"
	@echo "  构建目录: $(GREEN)$(DIST_PATH)$(NC)"
	@echo ""
	@echo "$(BLUE)环境信息:$(NC)"
	@if command -v node >/dev/null 2>&1; then \
		echo "  Node.js版本: $(GREEN)$$(node --version)$(NC)"; \
	else \
		echo "  Node.js版本: $(RED)未安装$(NC)"; \
	fi
	@if command -v npm >/dev/null 2>&1; then \
		echo "  npm版本: $(GREEN)$$(npm --version)$(NC)"; \
	else \
		echo "  npm版本: $(RED)未安装$(NC)"; \
	fi
	@if command -v gulp >/dev/null 2>&1; then \
		echo "  gulp版本: $(GREEN)$$(gulp --version)$(NC)"; \
	else \
		echo "  gulp版本: $(YELLOW)未全局安装$(NC)"; \
	fi 