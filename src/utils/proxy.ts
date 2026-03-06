const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001'

export const getProxiedUrl = (originalUrl: string): string => {
  // 如果URL是相对路径或同源，不需要代理
  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    return originalUrl
  }

  // 对于某些已经支持CORS的域名，可以直接访问
  const corsEnabledDomains = [
    'github.com',
    'githubusercontent.com',
    // 添加其他已知支持CORS的域名
  ]

  try {
    const urlObj = new URL(originalUrl)
    if (corsEnabledDomains.some(domain => urlObj.hostname.includes(domain))) {
      return originalUrl
    }
  } catch {
    // URL解析失败，返回原始URL
    return originalUrl
  }

  // 使用代理
  return `${PROXY_URL}/proxy?url=${encodeURIComponent(originalUrl)}`
}

export const fetchWithProxy = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const proxyUrl = `${PROXY_URL}/proxy`

  const response = await fetch(proxyUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify({
      url,
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body
    }) : JSON.stringify({ url }),
  })

  return response
}