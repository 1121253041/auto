import { useState, useEffect } from 'react'
import { pluginManager } from '../utils/initializePlugins'
import type { Plugin } from '../types/plugin'
import './PluginPanel.css'

interface PluginPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function PluginPanel({ isOpen, onClose }: PluginPanelProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([])

  useEffect(() => {
    if (isOpen) {
      setPlugins(pluginManager.getAll())
    }
  }, [isOpen])

  const handleUnregister = async (pluginId: string) => {
    if (confirm('确定要卸载此插件吗？')) {
      try {
        await pluginManager.unregister(pluginId)
        setPlugins(pluginManager.getAll())
      } catch (error) {
        console.error('Failed to unregister plugin:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="plugin-panel-overlay">
      <div className="plugin-panel">
        <div className="plugin-panel-header">
          <h2>🔌 插件管理</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="plugin-panel-content">
          {plugins.length === 0 ? (
            <div className="no-plugins">
              <p>暂无已安装的插件</p>
            </div>
          ) : (
            <div className="plugin-list">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="plugin-item">
                  <div className="plugin-info">
                    <h3 className="plugin-name">{plugin.name}</h3>
                    <p className="plugin-version">v{plugin.version}</p>
                    {plugin.description && (
                      <p className="plugin-description">{plugin.description}</p>
                    )}
                    {plugin.author && (
                      <p className="plugin-author">作者: {plugin.author}</p>
                    )}
                  </div>
                  <div className="plugin-actions">
                    <button
                      className="btn-plugin btn-deactivate"
                      onClick={() => handleUnregister(plugin.id)}
                    >
                      卸载
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}