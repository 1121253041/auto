# Multi-Page Viewer Extension

Chrome/Edge 浏览器扩展，为 Multi-Page Viewer 提供1对多输入广播功能。

## 功能特性

- ✅ **输入广播**: 在一个iframe中输入，自动同步到所有其他iframe
- ✅ **一键开关**: 通过Popup界面轻松启用/禁用
- ✅ **状态指示**: 实时显示连接的标签页和iframe数量
- ✅ **自动注入**: 自动检测并注入到新的iframe

## 安装方法

### 1. 准备图标文件

由于浏览器扩展需要PNG格式图标，请将以下SVG文件转换为PNG：

```bash
# 使用在线工具或其他工具转换图标
# 需要的尺寸: 16x16, 48x48, 128x128

# 或使用 ImageMagick:
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

### 2. 加载扩展到Chrome/Edge

1. 打开浏览器，访问 `chrome://extensions/` 或 `edge://extensions/`
2. 启用"开发者模式"（右上角开关）
3. 点击"加载已解压的扩展程序"
4. 选择 `extension` 文件夹
5. 扩展安装成功！

### 3. 配置扩展

1. 点击浏览器工具栏中的扩展图标
2. 在Popup界面中：
   - 启用/禁用扩展
   - 启用/禁用输入广播功能
3. 查看连接状态和iframe数量

## 使用方法

1. 打开 Multi-Page Viewer 应用（http://localhost:3000）
2. 添加多个网页（iframe）
3. 启用扩展的"输入广播"功能
4. 在任意iframe的输入框中输入文本
5. 文本将自动同步到所有其他iframe的输入框

## 工作原理

### 架构

```
┌─────────────────────────────────────────┐
│  Multi-Page Viewer App (localhost:3000)  │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Content Script (content.js)      │   │
│  │ - 监听DOM变化                      │   │
│  │ - 管理iframe通信                   │   │
│  │ - 广播输入消息                     │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │Iframe 1│ │Iframe 2│ │Iframe 3│      │
│  │  (监听) │ │  (监听) │ │  (监听) │      │
│  └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────┘
         ↕
┌─────────────────────────────────────────┐
│  Background Script (Service Worker)      │
│  - 管理扩展状态                           │
│  - 中继消息                               │
│  - 维护配置                               │
└─────────────────────────────────────────┘
         ↕
┌─────────────────────────────────────────┐
│  Popup UI                                │
│  - 用户界面                               │
│  - 状态显示                               │
│  - 配置管理                               │
└─────────────────────────────────────────┘
```

### 消息流

1. **用户在Iframe A输入** → Iframe Listener监听
2. **发送到Content Script** → `postMessage`通信
3. **Content Script广播** → 发送到所有iframe
4. **所有iframe更新** → 同步输入内容

## 文件结构

```
extension/
├── manifest.json          # 扩展配置
├── background/
│   └── background.js      # Background Script
├── content/
│   ├── content.js         # Content Script
│   └── content.css        # 样式
├── popup/
│   ├── popup.html         # Popup界面
│   ├── popup.css          # Popup样式
│   └── popup.js           # Popup逻辑
├── injected/
│   └── iframe-listener.js # 注入到iframe的脚本
└── icons/
    ├── icon.svg           # 图标源文件
    ├── icon16.png         # 16x16图标
    ├── icon48.png         # 48x48图标
    └── icon128.png        # 128x128图标
```

## 权限说明

- `activeTab`: 访问当前标签页
- `storage`: 保存扩展配置
- `scripting`: 注入脚本到页面

## 调试方法

### 查看日志

1. Content Script: 在应用页面打开开发者工具，查看Console
2. Background Script: 在 `chrome://extensions/` 点击扩展的"Service Worker"
3. Popup: 右键点击Popup，选择"检查"

### 测试步骤

1. 确保应用运行在 http://localhost:3000
2. 安装扩展
3. 打开应用并添加多个iframe
4. 查看扩展状态和日志
5. 测试输入广播功能

## 已知限制

- ⚠️ 由于浏览器安全策略，部分iframe（如HTTPS）可能无法注入脚本
- ⚠️ 跨域iframe可能无法访问contentDocument
- ⚠️ 需要手动将SVG图标转换为PNG格式

## 开发计划

- [ ] 支持更多输入类型（checkbox, radio等）
- [ ] 添加键盘快捷键
- [ ] 支持自定义广播规则
- [ ] 添加数据加密传输

## 许可证

MIT License