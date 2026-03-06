import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from './store'
import { addIframe, removeIframe, updateIframe, toggleFullscreen, setUseProxy } from './store/appSlice'
import { GridLayout } from './components/GridLayout'
import { ConfigPanel } from './components/ConfigPanel'
import { PluginPanel } from './components/PluginPanel'
import { pluginManager, examplePlugins } from './utils/initializePlugins'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const iframes = useSelector((state: RootState) => state.app.iframes)
  const fullscreenId = useSelector((state: RootState) => state.app.fullscreenId)
  const useProxy = useSelector((state: RootState) => state.app.useProxy)
  const [isPluginPanelOpen, setIsPluginPanelOpen] = useState(false)

  // 初始化插件系统
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        for (const plugin of examplePlugins) {
          await pluginManager.register(plugin)
        }
        console.log('All plugins initialized')
      } catch (error) {
        console.error('Failed to initialize plugins:', error)
      }
    }
    initializePlugins()
  }, [])

  const handleAdd = (url: string, title: string, useProxyForItem?: boolean) => {
    dispatch(addIframe({ url, title, useProxy: useProxyForItem }))
  }

  const handleDelete = (id: string) => {
    dispatch(removeIframe(id))
  }

  const handleUpdate = (id: string, url: string, title: string, useProxyForItem?: boolean) => {
    dispatch(updateIframe({ id, url, title, useProxy: useProxyForItem }))
  }

  const handleFullscreenToggle = (id: string) => {
    dispatch(toggleFullscreen(id))
  }

  const handleToggleGlobalProxy = (useProxy: boolean) => {
    dispatch(setUseProxy(useProxy))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Multi-Page Viewer</h1>
        <div className="header-actions">
          <button
            className="btn-plugin-manager"
            onClick={() => setIsPluginPanelOpen(true)}
            title="插件管理"
          >
            🔌 插件
          </button>
          <ConfigPanel
            iframes={iframes}
            useProxy={useProxy}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onToggleGlobalProxy={handleToggleGlobalProxy}
          />
        </div>
      </header>

      <main className="app-main">
        <GridLayout
          iframes={iframes}
          fullscreenId={fullscreenId}
          onFullscreenToggle={handleFullscreenToggle}
          onDelete={handleDelete}
        />
      </main>

      <PluginPanel
        isOpen={isPluginPanelOpen}
        onClose={() => setIsPluginPanelOpen(false)}
      />
    </div>
  )
}

export default App