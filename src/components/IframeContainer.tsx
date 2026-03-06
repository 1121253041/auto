import { useState } from 'react'
import type { IframeConfig } from '../types'
import { getProxiedUrl } from '../utils/proxy'
import { pluginManager } from '../utils/initializePlugins'
import './IframeContainer.css'

interface IframeContainerProps {
  iframe: IframeConfig
  isFullscreen: boolean
  onFullscreenToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function IframeContainer({
  iframe,
  isFullscreen,
  onFullscreenToggle,
  onDelete,
}: IframeContainerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const displayUrl = iframe.useProxy ? getProxiedUrl(iframe.url) : iframe.url

  const handleLoad = () => {
    setIsLoading(false)
    // 触发插件钩子
    pluginManager.triggerIframeLoad(iframe.id, iframe.url)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    // 触发插件钩子
    pluginManager.triggerIframeError(iframe.id, iframe.url, new Error('Failed to load iframe'))
  }

  return (
    <div className={`iframe-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="iframe-header">
        <h3 className="iframe-title">{iframe.title}</h3>
        <div className="iframe-actions">
          {iframe.useProxy && <span className="proxy-badge" title="使用代理">🔌</span>}
          <button
            className="btn-fullscreen"
            onClick={() => onFullscreenToggle(iframe.id)}
            title={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(iframe.id)}
            title="删除"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="iframe-content">
        {isLoading && (
          <div className="iframe-loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        )}

        {hasError && (
          <div className="iframe-error">
            <p>⚠️ 加载失败</p>
            <p className="error-url">{iframe.url}</p>
          </div>
        )}

        <iframe
          src={displayUrl}
          title={iframe.title}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          style={{ display: isLoading || hasError ? 'none' : 'block' }}
        />
      </div>
    </div>
  )
}