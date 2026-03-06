import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from './store'
import { addIframe, removeIframe, updateIframe, toggleFullscreen, setUseProxy } from './store/appSlice'
import { GridLayout } from './components/GridLayout'
import { ConfigPanel } from './components/ConfigPanel'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const iframes = useSelector((state: RootState) => state.app.iframes)
  const fullscreenId = useSelector((state: RootState) => state.app.fullscreenId)
  const useProxy = useSelector((state: RootState) => state.app.useProxy)

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
        <ConfigPanel
          iframes={iframes}
          useProxy={useProxy}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onToggleGlobalProxy={handleToggleGlobalProxy}
        />
      </header>

      <main className="app-main">
        <GridLayout
          iframes={iframes}
          fullscreenId={fullscreenId}
          onFullscreenToggle={handleFullscreenToggle}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App