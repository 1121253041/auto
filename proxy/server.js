import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 域名白名单配置
const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(',')
  : ['*'] // 默认允许所有域名，生产环境建议配置具体域名

// 日志记录
const logRequest = (req, statusCode, message = '') => {
  const timestamp = new Date().toISOString()
  const clientIp = req.ip || req.connection.remoteAddress
  const targetUrl = req.query.url || req.body?.url || 'unknown'
  console.log(`[${timestamp}] ${clientIp} -> ${targetUrl} [${statusCode}] ${message}`)
}

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// 安全头配置
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(express.json())

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 域名验证函数
const isDomainAllowed = (url) => {
  if (ALLOWED_DOMAINS.includes('*')) return true

  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    return ALLOWED_DOMAINS.some(allowed =>
      domain === allowed || domain.endsWith('.' + allowed)
    )
  } catch {
    return false
  }
}

// 代理GET请求
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url

  if (!targetUrl) {
    logRequest(req, 400, 'Missing URL parameter')
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  // 域名白名单验证
  if (!isDomainAllowed(targetUrl)) {
    logRequest(req, 403, 'Domain not allowed')
    return res.status(403).json({ error: 'Domain not allowed' })
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Multi-Page-Viewer-Proxy/1.0',
      }
    })

    const contentType = response.headers.get('content-type')
    res.setHeader('Content-Type', contentType || 'text/html')

    // 添加CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    const data = await response.text()
    logRequest(req, response.status, 'Success')
    res.status(response.status).send(data)
  } catch (error) {
    logRequest(req, 500, `Error: ${error.message}`)
    res.status(500).json({ error: 'Failed to fetch resource', details: error.message })
  }
})

// 代理POST请求
app.post('/proxy', async (req, res) => {
  const { url, method = 'POST', headers = {}, body } = req.body

  if (!url) {
    logRequest(req, 400, 'Missing URL parameter')
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  // 域名白名单验证
  if (!isDomainAllowed(url)) {
    logRequest(req, 403, 'Domain not allowed')
    return res.status(403).json({ error: 'Domain not allowed' })
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        'User-Agent': 'Multi-Page-Viewer-Proxy/1.0',
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const contentType = response.headers.get('content-type')
    res.setHeader('Content-Type', contentType || 'application/json')

    // 添加CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    const data = await response.text()
    logRequest(req, response.status, 'Success')
    res.status(response.status).send(data)
  } catch (error) {
    logRequest(req, 500, `Error: ${error.message}`)
    res.status(500).json({ error: 'Failed to fetch resource', details: error.message })
  }
})

// OPTIONS预检请求处理
app.options('/proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Proxy server error:', err)
  logRequest(req, 500, `Server error: ${err.message}`)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`)
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy?url=<target-url>`)
  console.log(`🔒 Allowed domains: ${ALLOWED_DOMAINS.join(', ')}`)
  console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})