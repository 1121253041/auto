/**
 * Iframe Listener Script
 * 注入到每个iframe中，监听输入并同步
 */

(function() {
  'use strict'

  // 标识符
  const IFRAME_ID = 'iframe-' + Math.random().toString(36).substr(2, 9)

  console.log('[Iframe Listener] Initialized, ID:', IFRAME_ID)

  /**
   * 监听来自父窗口的消息
   */
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) return

    const { type, data } = event.data

    if (type === 'SYNC_INPUT') {
      console.log('[Iframe Listener] Received input sync:', data)

      // 查找所有输入框并填充
      const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea')

      inputs.forEach(input => {
        if (data.value !== undefined) {
          input.value = data.value
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
      })
    }
  })

  /**
   * 监听iframe内的输入并发送到父窗口
   */
  document.addEventListener('input', (event) => {
    if (event.target.matches('input[type="text"], input[type="search"], textarea')) {
      const data = {
        value: event.target.value,
        type: event.target.type,
        name: event.target.name
      }

      window.parent.postMessage({
        type: 'INPUT_FROM_IFRAME',
        sourceId: IFRAME_ID,
        data: data
      }, '*')
    }
  }, true)

  console.log('[Iframe Listener] Ready')
})()