# Multi-Page Viewer

一个功能强大的多网页查看器，支持插件系统、CORS代理和响应式网格布局。

## 🚀 功能特性

### 核心功能
- ✅ 多网页集成展示（iframe）
- ✅ 响应式网格布局（自动适配1/2/3列）
- ✅ 全屏模式切换
- ✅ URL配置管理（添加/删除/修改）
- ✅ 本地存储持久化
- ✅ CORS跨域代理支持

### 插件系统
- ✅ 插件接口规范（Plugin Interface）
- ✅ 插件生命周期钩子（onLoad, onUnload, onActivate, onDeactivate）
- ✅ iframe事件钩子（onIframeLoad, onIframeError）
- ✅ 插件上下文API（状态管理、iframe操作、存储、HTTP请求）
- ✅ 插件管理UI
- ✅ 示例插件：Web Monitor

### 技术栈
- **前端**: React 18 + TypeScript + Vite
- **状态管理**: Redux Toolkit
- **代理服务器**: Node.js + Express
- **样式**: CSS3

## 📦 安装

### 前端应用
```bash
npm install
npm run dev
```

### CORS代理服务器
```bash
cd proxy
npm install
npm start
```

## 🎯 使用指南

### 基础使用
1. 访问 `http://localhost:3002`
2. 点击"添加网页"按钮
3. 输入URL和标题
4. 选择是否使用代理（某些跨域网站需要）
5. 点击"确定"添加

### 全屏模式
- 点击iframe右上角的全屏按钮（⤢）
- 再次点击退出全屏

### 插件管理
1. 点击顶部的"🔌 插件"按钮
2. 查看已安装的插件
3. 可以卸载不需要的插件

## 🔌 开发插件

### 插件接口

```typescript
interface Plugin {
  // 基本信息
  id: string
  name: string
  version: string
  description?: string
  author?: string

  // 生命周期钩子
  onLoad?: () => void | Promise<void>
  onUnload?: () => void | Promise<void>
  onActivate?: () => void | Promise<void>
  onDeactivate?: () => void | Promise<void>

  // iframe钩子
  onIframeLoad?: (iframeId: string, url: string) => void
  onIframeError?: (iframeId: string, url: string, error: Error) => void

  // 配置钩子
  onConfigChange?: (config: any) => void
}
```

### 示例插件

```typescript
const myPlugin = (context: PluginContext): Plugin => ({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: '这是一个示例插件',

  onLoad: () => {
    console.log('Plugin loaded!')
    context.showNotification('插件已加载', 'success')
  },

  onIframeLoad: (iframeId, url) => {
    console.log(`Iframe ${iframeId} loaded: ${url}`)
  }
})
```

### 插件上下文API

```typescript
interface PluginContext {
  // 状态管理
  getState: () => any
  setState: (state: any) => void

  // iframe操作
  addIframe: (url: string, title: string, useProxy?: boolean) => void
  removeIframe: (id: string) => void
  updateIframe: (id: string, url: string, title: string, useProxy?: boolean) => void

  // 通知
  showNotification: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void

  // 存储
  storage: {
    get: (key: string) => any
    set: (key: string, value: any) => void
    remove: (key: string) => void
  }

  // HTTP请求（通过代理）
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}
```

## 📁 项目结构

```
multi-page-viewer/
├── src/
│   ├── components/          # React组件
│   │   ├── GridLayout.tsx
│   │   ├── IframeContainer.tsx
│   │   ├── ConfigPanel.tsx
│   │   └── PluginPanel.tsx
│   ├── store/              # Redux状态管理
│   │   ├── index.ts
│   │   └── appSlice.ts
│   ├── types/              # TypeScript类型定义
│   │   ├── index.ts
│   │   └── plugin.ts
│   ├── utils/              # 工具函数
│   │   ├── PluginManager.ts
│   │   ├── initializePlugins.ts
│   │   └── proxy.ts
│   ├── App.tsx
│   └── main.tsx
├── proxy/                  # CORS代理服务器
│   ├── server.js
│   └── package.json
└── dist/                   # 构建输出
```

## 🎨 开发进度

### 已完成 ✅
- [x] 阶段1: 项目初始化
- [x] 阶段2: 核心功能开发
- [x] 阶段3: Redux状态管理
- [x] 阶段4: CORS代理支持
- [x] 阶段5: 插件系统（基础部分）

### 进行中 🚧
- [ ] 阶段5: Web Extensions插件开发
- [ ] 阶段6: 错误处理和安全性
- [ ] 阶段7: 性能优化
- [ ] 阶段8: 测试
- [ ] 阶段9: 文档和部署

## 🔒 安全性

- CORS代理使用域名白名单验证
- iframe使用sandbox属性限制权限
- 生产环境建议配置具体的安全策略

## 📝 配置

### 环境变量

前端应用（`.env`）:
```
VITE_PROXY_URL=http://localhost:3001
```

代理服务器（`proxy/.env`）:
```
PORT=3001
CORS_ORIGIN=http://localhost:3000
ALLOWED_DOMAINS=*
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请创建Issue。