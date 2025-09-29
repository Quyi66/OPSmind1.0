#!/bin/sh
set -e

# allow overriding backend host while keeping backward compatibility
: "${BACKEND_URL:=http://10.1.40.228:18080}"

template="/etc/nginx/templates/oplus-web.conf.template"
output="/etc/nginx/conf.d/oplus-web.conf"

if [ ! -f "$template" ]; then
    echo "Template not found: $template" >&2
    exit 1
fi

envsubst '$BACKEND_URL' < "$template" > "$output"
