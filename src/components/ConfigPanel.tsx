import { useState } from 'react'
import type { IframeConfig } from '../types'
import './ConfigPanel.css'

interface ConfigPanelProps {
  iframes: IframeConfig[]
  useProxy: boolean
  onAdd: (url: string, title: string, useProxy?: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, url: string, title: string, useProxy?: boolean) => void
  onToggleGlobalProxy: (useProxy: boolean) => void
}

export function ConfigPanel({
  iframes,
  useProxy,
  onAdd,
  onDelete,
  onUpdate,
  onToggleGlobalProxy,
}: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [useProxyForItem, setUseProxyForItem] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleAdd = () => {
    if (!url.trim()) {
      alert('请输入 URL')
      return
    }

    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    if (!isValidUrl(finalUrl)) {
      alert('请输入有效的 URL')
      return
    }

    const finalTitle = title.trim() || new URL(finalUrl).hostname
    onAdd(finalUrl, finalTitle, useProxyForItem || undefined)
    setUrl('')
    setTitle('')
    setUseProxyForItem(false)
  }

  const handleUpdate = (id: string, useProxyForUpdate?: boolean) => {
    if (!url.trim()) {
      alert('请输入 URL')
      return
    }

    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    if (!isValidUrl(finalUrl)) {
      alert('请输入有效的 URL')
      return
    }

    const finalTitle = title.trim() || new URL(finalUrl).hostname
    onUpdate(id, finalUrl, finalTitle, useProxyForUpdate)
    setEditingId(null)
    setUrl('')
    setTitle('')
    setUseProxyForItem(false)
  }

  const startEdit = (iframe: IframeConfig) => {
    setEditingId(iframe.id)
    setUrl(iframe.url)
    setTitle(iframe.title)
    setUseProxyForItem(iframe.useProxy || false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setUrl('')
    setTitle('')
    setUseProxyForItem(false)
  }

  return (
    <>
      <button className="config-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕ 关闭配置' : '⚙️ 配置管理'}
      </button>

      {isOpen && (
        <div className="config-panel">
          <h2>网页配置</h2>

          <div className="global-settings">
            <h3>全局设置</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useProxy}
                onChange={(e) => onToggleGlobalProxy(e.target.checked)}
              />
              <span>默认使用 CORS 代理</span>
            </label>
            <p className="help-text">
              启用后，新添加的网页将默认通过代理加载，解决跨域问题
            </p>
          </div>

          <div className="add-form">
            <h3>添加新网页</h3>
            <div className="form-group">
              <label>URL:</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="form-group">
              <label>标题 (可选):</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="自动从 URL 获取"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useProxyForItem}
                  onChange={(e) => setUseProxyForItem(e.target.checked)}
                />
                <span>使用 CORS 代理</span>
              </label>
            </div>
            <button className="btn-add" onClick={handleAdd}>
              添加网页
            </button>
          </div>

          <div className="iframe-list">
            <h3>已添加的网页 ({iframes.length})</h3>
            {iframes.length === 0 ? (
              <p className="no-items">暂无网页</p>
            ) : (
              <ul>
                {iframes.map((iframe) => (
                  <li key={iframe.id}>
                    {editingId === iframe.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="URL"
                        />
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="标题"
                        />
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={useProxyForItem}
                            onChange={(e) => setUseProxyForItem(e.target.checked)}
                          />
                          <span>使用代理</span>
                        </label>
                        <button onClick={() => handleUpdate(iframe.id, useProxyForItem)}>保存</button>
                        <button onClick={cancelEdit}>取消</button>
                      </div>
                    ) : (
                      <>
                        <div className="iframe-info">
                          <strong>
                            {iframe.title}
                            {iframe.useProxy && <span className="proxy-indicator">🔌</span>}
                          </strong>
                          <span className="iframe-url">{iframe.url}</span>
                        </div>
                        <div className="iframe-actions">
                          <button className="btn-edit" onClick={() => startEdit(iframe)}>
                            编辑
                          </button>
                          <button className="btn-delete" onClick={() => onDelete(iframe.id)}>
                            删除
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}