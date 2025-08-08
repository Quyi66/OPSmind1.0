docker run -d -p 8080:80 -v ./nginx-config/oplus-web.conf:/etc/nginx/conf.d/oplus-web.conf:ro --name oplus-web oplus-web:latest
