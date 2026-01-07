#!/bin/sh
set -e

# allow overriding backend host while keeping backward compatibility
: "${BACKEND_URL:=http://10.1.40.228:18080}"

# ATA 服务后端地址 (Ansible Task Agent)
# 如果未设置 ATA_BACKEND_URL，则使用 BACKEND_URL 作为默认值
: "${ATA_BACKEND_URL:=${BACKEND_URL}}"

template="/etc/nginx/templates/oplus-web.conf.template"
output="/etc/nginx/conf.d/oplus-web.conf"

if [ ! -f "$template" ]; then
    echo "Template not found: $template" >&2
    exit 1
fi

# 使用 sed 替代 envsubst，避免依赖 gettext
# 先替换 ATA_BACKEND_URL，再替换 BACKEND_URL
sed -e "s|\${ATA_BACKEND_URL}|${ATA_BACKEND_URL}|g" \
    -e "s|\${BACKEND_URL}|${BACKEND_URL}|g" \
    "$template" > "$output"

echo "Nginx config generated: ATA_BACKEND_URL=${ATA_BACKEND_URL}, BACKEND_URL=${BACKEND_URL}"
