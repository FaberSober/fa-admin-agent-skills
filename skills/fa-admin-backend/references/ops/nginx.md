# Nginx 部署

## 前后端同一服务

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 前后端分离

前端静态目录作为 root，SPA 用 `try_files $uri /index.html`，仅 `/api/` 反代后端：

```nginx
root /var/www/admin;
location / {
    try_files $uri /index.html;
}
location /api/ {
    proxy_pass http://127.0.0.1:8080;
}
```

## WebSocket

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

## 规则

- 替换所有域名、端口、证书路径。
- 用当前安全基线：限制上传体积、启用现代 TLS。
- `nginx -t` 验证后再 reload。
