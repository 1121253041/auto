import type { IframeConfig } from '../types'
import { IframeContainer } from './IframeContainer'
import './GridLayout.css'

interface GridLayoutProps {
  iframes: IframeConfig[]
  fullscreenId: string | null
  onFullscreenToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function GridLayout({
  iframes,
  fullscreenId,
  onFullscreenToggle,
  onDelete,
}: GridLayoutProps) {
  const getGridColumns = () => {
    const count = iframes.length
    if (count <= 2) return 1
    if (count <= 4) return 2
    return 3
  }

  if (iframes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📱</div>
        <h2>暂无网页</h2>
        <p>点击上方"添加网页"按钮开始使用</p>
      </div>
    )
  }

  const visibleIframes = fullscreenId
    ? iframes.filter((iframe) => iframe.id === fullscreenId)
    : iframes

  return (
    <div
      className="grid-layout"
      style={{
        gridTemplateColumns: fullscreenId ? '1fr' : `repeat(${getGridColumns()}, 1fr)`,
      }}
    >
      {visibleIframes.map((iframe) => (
        <IframeContainer
          key={iframe.id}
          iframe={iframe}
          isFullscreen={iframe.id === fullscreenId}
          onFullscreenToggle={onFullscreenToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}