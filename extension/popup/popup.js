/**
 * Popup Script
 * 管理扩展的popup界面交互
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Popup] Initialized')

  // DOM元素
  const enableCheckbox = document.getElementById('enable-checkbox')
  const broadcastCheckbox = document.getElementById('broadcast-checkbox')
  const statusText = document.getElementById('status-text')
  const tabsCount = document.getElementById('tabs-count')
  const iframesCount = document.getElementById('iframes-count')
  const refreshBtn = document.getElementById('refresh-btn')

  /**
   * 加载扩展状态
   */
  async function loadState() {
    try {
      const state = await chrome.storage.sync.get(['isEnabled', 'broadcastInputs'])

      enableCheckbox.checked = state.isEnabled !== false
      broadcastCheckbox.checked = state.broadcastInputs !== false

      updateStatus()
      console.log('[Popup] State loaded:', state)
    } catch (error) {
      console.error('[Popup] Failed to load state:', error)
    }
  }

  /**
   * 更新状态显示
   */
  function updateStatus() {
    if (enableCheckbox.checked) {
      statusText.textContent = '已启用'
      statusText.style.color = '#4caf50'
    } else {
      statusText.textContent = '已禁用'
      statusText.style.color = '#f44336'
    }
  }

  /**
   * 保存扩展状态
   */
  async function saveState() {
    try {
      await chrome.storage.sync.set({
        isEnabled: enableCheckbox.checked,
        broadcastInputs: broadcastCheckbox.checked
      })

      updateStatus()
      console.log('[Popup] State saved')
    } catch (error) {
      console.error('[Popup] Failed to save state:', error)
    }
  }

  /**
   * 查询当前标签页的iframe数量
   */
  async function queryIframesCount() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (tab && tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_IFRAMES_COUNT' })
        iframesCount.textContent = response?.count || 0
      }
    } catch (error) {
      console.warn('[Popup] Failed to query iframes count:', error)
      iframesCount.textContent = 'N/A'
    }
  }

  /**
   * 查询连接的标签页数量
   */
  async function queryTabsCount() {
    try {
      const tabs = await chrome.tabs.query({ url: 'http://localhost:3000/*' })
      tabsCount.textContent = tabs.length
    } catch (error) {
      console.warn('[Popup] Failed to query tabs count:', error)
      tabsCount.textContent = 'N/A'
    }
  }

  /**
   * 刷新所有状态
   */
  async function refresh() {
    await Promise.all([
      loadState(),
      queryTabsCount(),
      queryIframesCount()
    ])
  }

  // 事件监听
  enableCheckbox.addEventListener('change', saveState)
  broadcastCheckbox.addEventListener('change', saveState)
  refreshBtn.addEventListener('click', refresh)

  // 初始加载
  await refresh()

  console.log('[Popup] Ready')
})