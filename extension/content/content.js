/**
 * Content Script - 在主应用页面中运行
 * 负责：监听用户输入，广播到所有iframe
 */

(function() {
  'use strict'

  console.log('[Multi-Page Viewer Extension] Content script loaded')

  // 扩展配置
  let isEnabled = true
  let broadcastInputs = true

  // 从storage加载配置
  chrome.storage.sync.get(['isEnabled', 'broadcastInputs'], (result) => {
    if (result.isEnabled !== undefined) isEnabled = result.isEnabled
    if (result.broadcastInputs !== undefined) broadcastInputs = result.broadcastInputs
    console.log('[Extension] Config loaded:', { isEnabled, broadcastInputs })
  })

  // 监听storage变化
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      if (changes.isEnabled) isEnabled = changes.isEnabled.newValue
      if (changes.broadcastInputs) broadcastInputs = changes.broadcastInputs.newValue
      console.log('[Extension] Config updated:', { isEnabled, broadcastInputs })
    }
  })

  /**
   * 查找所有iframe
   */
  function getAllIframes() {
    const iframes = document.querySelectorAll('iframe')
    return Array.from(iframes)
  }

  /**
   * 向iframe发送消息
   */
  function sendMessageToIframe(iframe, message) {
    try {
      iframe.contentWindow.postMessage(message, '*')
    } catch (error) {
      console.warn('[Extension] Failed to send message to iframe:', error)
    }
  }

  /**
   * 广播消息到所有iframe
   */
  function broadcastToAllIframes(message) {
    if (!isEnabled || !broadcastInputs) return

    const iframes = getAllIframes()
    iframes.forEach(iframe => {
      sendMessageToIframe(iframe, message)
    })
    console.log(`[Extension] Broadcasted to ${iframes.length} iframes:`, message.type)
  }

  /**
   * 监听来自background的消息
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Extension] Received message from background:', message)

    if (message.type === 'BROADCAST_INPUT') {
      broadcastToAllIframes({
        type: 'SYNC_INPUT',
        data: message.data
      })
      sendResponse({ success: true })
    }

    if (message.type === 'GET_IFRAMES_COUNT') {
      const count = getAllIframes().length
      sendResponse({ count })
    }

    return true // 保持消息通道开启
  })

  /**
   * 监听来自iframe的消息
   */
  window.addEventListener('message', (event) => {
    // 只处理来自iframe的消息
    if (event.source === window) return

    if (event.data.type === 'INPUT_FROM_IFRAME') {
      // 将来自某个iframe的输入广播到其他iframe
      broadcastToAllIframes({
        type: 'SYNC_INPUT',
        data: event.data.data,
        sourceIframe: event.data.sourceId
      })
    }
  })

  /**
   * 注入脚本到iframe
   */
  function injectScriptToIframe(iframe) {
    try {
      // 向iframe注入监听脚本
      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('injected/iframe-listener.js')
      iframe.contentDocument?.body?.appendChild(script)
    } catch (error) {
      console.warn('[Extension] Cannot inject script to iframe (CORS restriction):', error)
    }
  }

  /**
   * 监听DOM变化，检测新的iframe
   */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'IFRAME') {
          console.log('[Extension] New iframe detected')
          setTimeout(() => injectScriptToIframe(node), 1000)
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // 初始化时注入到现有的iframe
  setTimeout(() => {
    const iframes = getAllIframes()
    console.log(`[Extension] Found ${iframes.length} existing iframes`)
    iframes.forEach(injectScriptToIframe)
  }, 2000)

  console.log('[Extension] Content script initialized')
})()