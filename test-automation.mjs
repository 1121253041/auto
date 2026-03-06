/**
 * 自动化功能测试脚本
 * 测试应用的各项功能是否正常工作
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

const results = []

async function test(name, fn) {
  try {
    log('blue', `\n测试: ${name}`)
    const passed = await fn()
    if (passed) {
      log('green', `✅ 通过: ${name}`)
      results.push({ name, passed: true })
    } else {
      log('red', `❌ 失败: ${name}`)
      results.push({ name, passed: false, error: 'Test returned false' })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    log('red', `❌ 失败: ${name} - ${errorMessage}`)
    results.push({ name, passed: false, error: errorMessage })
  }
}

// 测试1: 项目构建
async function testBuild() {
  try {
    await execAsync('npm run build')
    return true
  } catch {
    return false
  }
}

// 测试2: ESLint检查
async function testLint() {
  try {
    await execAsync('npm run lint')
    return true
  } catch {
    return false
  }
}

// 测试3: 前端服务器健康检查
async function testFrontendServer() {
  try {
    const response = await fetch('http://localhost:3000')
    return response.ok
  } catch {
    return false
  }
}

// 测试4: 代理服务器健康检查
async function testProxyServer() {
  try {
    const response = await fetch('http://localhost:3001/health')
    const data = await response.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}

// 测试5: 代理服务器功能
async function testProxyFunction() {
  try {
    const response = await fetch('http://localhost:3001/proxy?url=https://www.baidu.com')
    const text = await response.text()
    return text.includes('baidu') || text.includes('百度')
  } catch {
    return false
  }
}

// 测试6: 检查dist目录
async function testDistDirectory() {
  try {
    const { stdout } = await execAsync('ls dist')
    return stdout.includes('index.html') && stdout.includes('assets')
  } catch {
    return false
  }
}

// 测试7: 检查package.json配置
async function testPackageJson() {
  try {
    const { stdout } = await execAsync('cat package.json')
    const pkg = JSON.parse(stdout)
    return !!(pkg.scripts.dev && pkg.scripts.build && pkg.dependencies.react)
  } catch {
    return false
  }
}

// 测试8: TypeScript类型检查
async function testTypeScript() {
  try {
    await execAsync('npx tsc --noEmit')
    return true
  } catch {
    return false
  }
}

// 运行所有测试
async function runAllTests() {
  log('yellow', '='.repeat(60))
  log('yellow', '开始自动化功能测试')
  log('yellow', '='.repeat(60))

  await test('项目构建', testBuild)
  await test('ESLint代码检查', testLint)
  await test('前端服务器运行', testFrontendServer)
  await test('代理服务器运行', testProxyServer)
  await test('代理服务器功能', testProxyFunction)
  await test('dist目录生成', testDistDirectory)
  await test('package.json配置', testPackageJson)
  await test('TypeScript类型检查', testTypeScript)

  log('yellow', '\n' + '='.repeat(60))
  log('yellow', '测试结果汇总')
  log('yellow', '='.repeat(60))

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌'
    const color = result.passed ? 'green' : 'red'
    log(color, `${icon} ${result.name}`)
    if (result.error) {
      log('red', `   错误: ${result.error}`)
    }
  })

  log('yellow', '\n' + '='.repeat(60))
  log('green', `总计: ${total} 个测试`)
  log('green', `通过: ${passed} 个`)
  if (failed > 0) {
    log('red', `失败: ${failed} 个`)
  }
  log('yellow', '='.repeat(60))

  if (failed === 0) {
    log('green', '\n🎉 所有测试通过！项目可以进入下一阶段开发。')
    process.exit(0)
  } else {
    log('red', '\n⚠️ 部分测试失败，需要修复后再进行下一阶段开发。')
    process.exit(1)
  }
}

runAllTests().catch(console.error)