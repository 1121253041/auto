# CORS Proxy Server

用于 Multi-Page Viewer 的 CORS 代理服务器。

## 功能

- 转发 GET/POST 请求，绕过 CORS 限制
- 域名白名单验证
- 请求日志记录
- 安全头配置

## 安装

```bash
cd proxy
npm install
```

## 配置

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

配置项：
- `PORT`: 服务器端口（默认 3001）
- `CORS_ORIGIN`: 允许的前端域名
- `ALLOWED_DOMAINS`: 允许代理的域名（逗号分隔）

## 运行

```bash
npm start
# 或开发模式（自动重启）
npm run dev
```

## 使用

### GET 请求
```
http://localhost:3001/proxy?url=https://example.com
```

### POST 请求
```javascript
fetch('http://localhost:3001/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://api.example.com/data',
    method: 'POST',
    body: { key: 'value' }
  })
})
```

## 安全说明

⚠️ **重要**: 在生产环境中，务必配置 `ALLOWED_DOMAINS` 白名单，避免代理被滥用。