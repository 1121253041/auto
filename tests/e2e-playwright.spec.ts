import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Multi-Page Viewer 端到端测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    // 等待应用加载完成
    await page.waitForLoadState('networkidle')
  })

  test('1. 应用初始加载', async ({ page }) => {
    // 截图：初始状态
    await page.screenshot({ path: 'test-results/01-initial.png', fullPage: true })

    // 验证标题
    await expect(page.locator('h1')).toContainText('Multi-Page Viewer')

    // 验证插件按钮存在
    await expect(page.locator('button:has-text("插件")')).toBeVisible()
  })

  test('2. 添加第一个网页', async ({ page }) => {
    // 点击添加网页按钮
    await page.click('button:has-text("添加网页")')

    // 等待对话框出现
    await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })

    // 填写表单
    await page.fill('input[placeholder*="URL"], input[name="url"]', 'https://example.com')
    await page.fill('input[placeholder*="标题"], input[name="title"]', '示例网站')

    // 截图：填写表单
    await page.screenshot({ path: 'test-results/02-form-filled.png' })

    // 提交
    await page.click('button:has-text("添加"), button:has-text("确定")')

    // 等待iframe出现
    await page.waitForSelector('iframe', { timeout: 10000 })

    // 截图：网页已添加
    await page.screenshot({ path: 'test-results/03-iframe-added.png' })

    // 验证iframe存在
    const iframes = page.frames()
    expect(iframes.length).toBeGreaterThan(1)
  })

  test('3. 添加多个网页测试响应式布局', async ({ page }) => {
    const urls = [
      { url: 'https://example.com', title: '示例1' },
      { url: 'https://www.baidu.com', title: '百度' },
      { url: 'https://www.bing.com', title: '必应' },
      { url: 'https://developer.mozilla.org', title: 'MDN' },
    ]

    // 添加多个网页
    for (const item of urls) {
      await page.click('button:has-text("添加网页")')
      await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })
      await page.fill('input[placeholder*="URL"], input[name="url"]', item.url)
      await page.fill('input[placeholder*="标题"], input[name="title"]', item.title)
      await page.click('button:has-text("添加"), button:has-text("确定")')
      await page.waitForTimeout(1000) // 等待加载
    }

    // 截图：4个网页布局
    await page.screenshot({ path: 'test-results/04-multiple-iframes.png', fullPage: true })

    // 验证iframe数量
    const iframes = await page.locator('iframe').count()
    expect(iframes).toBeGreaterThanOrEqual(4)
  })

  test('4. 全屏功能测试', async ({ page }) => {
    // 先添加一个网页
    await page.click('button:has-text("添加网页")')
    await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })
    await page.fill('input[placeholder*="URL"], input[name="url"]', 'https://example.com')
    await page.fill('input[placeholder*="标题"], input[name="title"]', '测试全屏')
    await page.click('button:has-text("添加"), button:has-text("确定")')
    await page.waitForSelector('iframe', { timeout: 10000 })

    // 点击全屏按钮
    const fullscreenBtn = page.locator('button:has-text("⤢")').first()
    await fullscreenBtn.click()

    // 等待全屏模式
    await page.waitForTimeout(500)

    // 截图：全屏模式
    await page.screenshot({ path: 'test-results/05-fullscreen.png' })

    // 验证全屏类名
    const container = page.locator('.iframe-container.fullscreen')
    await expect(container).toBeVisible()

    // 退出全屏
    await page.click('button:has-text("⤓")')
    await page.waitForTimeout(500)

    // 截图：退出全屏
    await page.screenshot({ path: 'test-results/06-exit-fullscreen.png' })
  })

  test('5. 插件管理面板测试', async ({ page }) => {
    // 点击插件按钮
    await page.click('button:has-text("插件")')

    // 等待插件面板出现
    await page.waitForSelector('.plugin-panel, .plugin-panel-overlay', { timeout: 5000 })

    // 截图：插件面板
    await page.screenshot({ path: 'test-results/07-plugin-panel.png' })

    // 验证Web Monitor插件存在
    await expect(page.locator('text=Web Monitor')).toBeVisible()

    // 验证版本号
    await expect(page.locator('text=v1.0.0')).toBeVisible()

    // 关闭插件面板
    await page.click('.btn-close, button:has-text("✕")')
    await page.waitForTimeout(300)
  })

  test('6. 响应式布局测试', async ({ page }) => {
    // 添加几个网页
    const urls = [
      { url: 'https://example.com', title: '测试1' },
      { url: 'https://www.baidu.com', title: '测试2' },
      { url: 'https://www.bing.com', title: '测试3' },
    ]

    for (const item of urls) {
      await page.click('button:has-text("添加网页")')
      await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })
      await page.fill('input[placeholder*="URL"], input[name="url"]', item.url)
      await page.fill('input[placeholder*="标题"], input[name="title"]', item.title)
      await page.click('button:has-text("添加"), button:has-text("确定")')
      await page.waitForTimeout(1000)
    }

    // 测试桌面布局
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/08-desktop-layout.png' })

    // 测试平板布局
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/09-tablet-layout.png' })

    // 测试手机布局
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/10-mobile-layout.png' })
  })

  test('7. 删除网页功能测试', async ({ page }) => {
    // 添加一个网页
    await page.click('button:has-text("添加网页")')
    await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })
    await page.fill('input[placeholder*="URL"], input[name="url"]', 'https://example.com')
    await page.fill('input[placeholder*="标题"], input[name="title"]', '待删除')
    await page.click('button:has-text("添加"), button:has-text("确定")')
    await page.waitForSelector('iframe', { timeout: 10000 })

    // 截图：删除前
    const countBefore = await page.locator('iframe').count()
    await page.screenshot({ path: 'test-results/11-before-delete.png' })

    // 点击删除按钮
    await page.click('button:has-text("✕")')

    // 等待删除完成
    await page.waitForTimeout(500)

    // 截图：删除后
    await page.screenshot({ path: 'test-results/12-after-delete.png' })

    // 验证数量减少
    const countAfter = await page.locator('iframe').count()
    expect(countAfter).toBeLessThan(countBefore)
  })

  test('8. 持久化存储测试', async ({ page }) => {
    // 添加网页
    await page.click('button:has-text("添加网页")')
    await page.waitForSelector('dialog[open], .modal', { timeout: 5000 })
    await page.fill('input[placeholder*="URL"], input[name="url"]', 'https://example.com')
    await page.fill('input[placeholder*="标题"], input[name="title"]', '持久化测试')
    await page.click('button:has-text("添加"), button:has-text("确定")')
    await page.waitForSelector('iframe', { timeout: 10000 })

    // 截图：刷新前
    await page.screenshot({ path: 'test-results/13-before-refresh.png' })

    // 刷新页面
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 截图：刷新后
    await page.screenshot({ path: 'test-results/14-after-refresh.png' })

    // 验证iframe仍然存在
    await page.waitForSelector('iframe', { timeout: 10000 })
    const iframes = await page.locator('iframe').count()
    expect(iframes).toBeGreaterThanOrEqual(1)
  })
})