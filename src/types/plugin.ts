// 插件接口规范

export interface Plugin {
  // 插件基本信息
  id: string
  name: string
  version: string
  description?: string
  author?: string

  // 插件生命周期钩子
  onLoad?: () => void | Promise<void>
  onUnload?: () => void | Promise<void>
  onActivate?: () => void | Promise<void>
  onDeactivate?: () => void | Promise<void>

  // iframe 相关钩子
  onIframeLoad?: (iframeId: string, url: string) => void
  onIframeError?: (iframeId: string, url: string, error: Error) => void

  // 配置相关钩子
  onConfigChange?: (config: any) => void

  // 自定义UI组件（可选）
  customUI?: {
    settingsPanel?: React.ComponentType<any>
    toolbarButton?: React.ComponentType<any>
  }
}

export interface PluginContext {
  // 应用状态
  getState: () => any
  setState: (state: any) => void

  // iframe 操作
  addIframe: (url: string, title: string, useProxy?: boolean) => void
  removeIframe: (id: string) => void
  updateIframe: (id: string, url: string, title: string, useProxy?: boolean) => void

  // 通知
  showNotification: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void

  // 存储API
  storage: {
    get: (key: string) => any
    set: (key: string, value: any) => void
    remove: (key: string) => void
  }

  // HTTP请求（通过代理）
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

export type PluginConstructor = (context: PluginContext) => Plugin