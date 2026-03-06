/**
 * Background Script - Service Worker
 * 负责：管理扩展状态，处理消息中继，维护配置
 */

console.log('[Multi-Page Viewer Extension] Background script loaded')

// 扩展状态
let extensionState = {
  isEnabled: true,
  broadcastInputs: true,
  connectedTabs: new Set()
}

// 初始化默认配置
chrome.storage.sync.get(['isEnabled', 'broadcastInputs'], (result) => {
  if (result.isEnabled !== undefined) extensionState.isEnabled = result.isEnabled
  if (result.broadcastInputs !== undefined) extensionState.broadcastInputs = result.broadcastInputs
})

/**
 * 监听来自content scripts的消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Received message:', message, 'from tab:', sender.tab?.id)

  switch (message.type) {
    case 'GET_STATE':
      sendResponse(extensionState)
      break

    case 'UPDATE_STATE':
      extensionState = { ...extensionState, ...message.payload }
      chrome.storage.sync.set(extensionState)
      broadcastToAllTabs({ type: 'STATE_UPDATED', payload: extensionState })
      sendResponse({ success: true })
      break

    case 'INPUT_BROADCAST':
      // 广播输入到所有连接的标签页
      broadcastToAllTabs({
        type: 'RECEIVE_INPUT',
        payload: message.payload
      }, sender.tab?.id)
      sendResponse({ success: true })
      break

    case 'TAB_REGISTERED':
      extensionState.connectedTabs.add(sender.tab?.id)
      console.log('[Background] Tab registered:', sender.tab?.id)
      sendResponse({ success: true })
      break

    case 'TAB_UNREGISTERED':
      extensionState.connectedTabs.delete(sender.tab?.id)
      console.log('[Background] Tab unregistered:', sender.tab?.id)
      sendResponse({ success: true })
      break

    default:
      console.warn('[Background] Unknown message type:', message.type)
      sendResponse({ error: 'Unknown message type' })
  }

  return true // 保持消息通道开放
})

/**
 * 广播消息到所有标签页
 */
async function broadcastToAllTabs(message, excludeTabId = null) {
  try {
    const tabs = await chrome.tabs.query({ url: 'http://localhost:3000/*' })

    tabs.forEach(tab => {
      if (tab.id !== excludeTabId) {
        chrome.tabs.sendMessage(tab.id, message).catch(err => {
          console.warn(`[Background] Failed to send message to tab ${tab.id}:`, err)
        })
      }
    })

    console.log(`[Background] Broadcasted to ${tabs.length} tabs`)
  } catch (error) {
    console.error('[Background] Broadcast error:', error)
  }
}

/**
 * 监听标签页关闭，清理连接
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  if (extensionState.connectedTabs.has(tabId)) {
    extensionState.connectedTabs.delete(tabId)
    console.log('[Background] Tab closed, removed from connected tabs:', tabId)
  }
})

/**
 * 监听扩展安装/更新
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension installed/updated:', details.reason)

  if (details.reason === 'install') {
    // 首次安装，设置默认配置
    chrome.storage.sync.set({
      isEnabled: true,
      broadcastInputs: true
    })
    console.log('[Background] Default configuration set')
  }
})

console.log('[Background] Background script initialized')