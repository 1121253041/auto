import { PluginManager } from './PluginManager'
import type { PluginContext } from '../types/plugin'
import { store } from '../store'
import { addIframe, removeIframe, updateIframe } from '../store/appSlice'

// 创建插件上下文
const createPluginContext = (): PluginContext => {
  return {
    // 应用状态
    getState: () => store.getState().app,
    setState: (_state: any) => {
      console.warn('Direct state setting is not recommended. Use Redux actions instead.')
    },

    // iframe 操作
    addIframe: (url: string, title: string, useProxy?: boolean) => {
      store.dispatch(addIframe({ url, title, useProxy }))
    },
    removeIframe: (id: string) => {
      store.dispatch(removeIframe(id))
    },
    updateIframe: (id: string, url: string, title: string, useProxy?: boolean) => {
      store.dispatch(updateIframe({ id, url, title, useProxy }))
    },

    // 通知
    showNotification: (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      console.log(`[${type.toUpperCase()}] ${message}`)
      // TODO: 集成真实的UI通知系统
    },

    // 存储API
    storage: {
      get: (key: string) => {
        try {
          const value = localStorage.getItem(`plugin-${key}`)
          return value ? JSON.parse(value) : null
        } catch {
          return null
        }
      },
      set: (key: string, value: any) => {
        try {
          localStorage.setItem(`plugin-${key}`, JSON.stringify(value))
        } catch (error) {
          console.error('Failed to save to storage:', error)
        }
      },
      remove: (key: string) => {
        try {
          localStorage.removeItem(`plugin-${key}`)
        } catch (error) {
          console.error('Failed to remove from storage:', error)
        }
      },
    },

    // HTTP请求（通过代理）
    fetch: async (url: string, options?: RequestInit) => {
      const proxyUrl = '/api/proxy'
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options?.headers,
          'X-Proxy-URL': url,
        },
      })
      return response
    },
  }
}

// 创建插件管理器实例
export const pluginManager = new PluginManager(createPluginContext())

// 示例插件：网页监控插件
const webMonitorPlugin = (context: PluginContext) => ({
  id: 'web-monitor',
  name: 'Web Monitor',
  version: '1.0.0',
  description: '监控网页加载状态和性能',

  onLoad: () => {
    console.log('Web Monitor Plugin loaded')
    context.showNotification('Web Monitor Plugin 已加载', 'success')
  },

  onIframeLoad: (iframeId: string, url: string) => {
    console.log(`[Web Monitor] Iframe ${iframeId} loaded: ${url}`)
    context.storage.set(`load-${iframeId}`, {
      url,
      timestamp: Date.now(),
    })
  },

  onIframeError: (iframeId: string, url: string, error: Error) => {
    console.error(`[Web Monitor] Iframe ${iframeId} error:`, error)
    context.showNotification(`网页加载失败: ${url}`, 'error')
  },
})

// 导出示例插件
export const examplePlugins = [webMonitorPlugin]