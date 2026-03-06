import { useState, memo, useCallback, useRef, useEffect } from 'react'
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

/**
 * Iframe容器组件 - 带懒加载和性能优化
 * 使用React.memo避免不必要的重渲染
 */
export const IframeContainer = memo(function IframeContainer({
  iframe,
  isFullscreen,
  onFullscreenToggle,
  onDelete,
}: IframeContainerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 懒加载：检测iframe是否在视口中
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const displayUrl = iframe.useProxy ? getProxiedUrl(iframe.url) : iframe.url

  // 使用useCallback优化事件处理函数
  const handleLoad = useCallback(() => {
    setIsLoading(false)
    pluginManager.triggerIframeLoad(iframe.id, iframe.url)
  }, [iframe.id, iframe.url])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    pluginManager.triggerIframeError(iframe.id, iframe.url, new Error('Failed to load iframe'))
  }, [iframe.id, iframe.url])

  const handleFullscreenToggle = useCallback(() => {
    onFullscreenToggle(iframe.id)
  }, [iframe.id, onFullscreenToggle])

  const handleDelete = useCallback(() => {
    onDelete(iframe.id)
  }, [iframe.id, onDelete])

  return (
    <div
      ref={containerRef}
      className={`iframe-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      <div className="iframe-header">
        <h3 className="iframe-title">{iframe.title}</h3>
        <div className="iframe-actions">
          {iframe.useProxy && <span className="proxy-badge" title="使用代理">🔌</span>}
          <button
            className="btn-fullscreen"
            onClick={handleFullscreenToggle}
            title={isFullscreen ? '退出全屏' : '全屏显示'}
            aria-label={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="删除"
            aria-label="删除网页"
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

        {/* 懒加载：只有在视口中才渲染iframe */}
        {isInView && (
          <iframe
            src={displayUrl}
            title={iframe.title}
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            style={{ display: isLoading || hasError ? 'none' : 'block' }}
          />
        )}
      </div>
    </div>
  )
})