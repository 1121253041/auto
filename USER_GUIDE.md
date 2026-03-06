# 📖 Multi-Page Viewer 使用指南

## 🎯 项目简介

Multi-Page Viewer 是一个功能强大的多网页查看器，让你可以在一个页面中同时查看和管理多个网站。

**核心特性：**
- 📱 响应式网格布局（自动适配1/2/3列）
- 🖼️ 多个iframe同时展示
- 🔌 CORS代理支持（突破跨域限制）
- 🎨 全屏模式切换
- 💾 本地存储持久化
- 🧩 插件系统
- 🌐 浏览器扩展（1对多输入同步）

---

## 🚀 快速开始

### 1. 环境要求

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 2. 安装和启动

#### 方式一：基础使用（仅前端）

```bash
# 1. 克隆项目
git clone https://github.com/1121253041/auto.git
cd auto

# 2. 安装依赖
npm install

# 3. 启动前端应用
npm run dev
```

访问：http://localhost:3000

#### 方式二：完整功能（前端+代理）

```bash
# 终端1 - 启动前端
npm run dev

# 终端2 - 启动CORS代理
cd proxy
npm install
npm start
```

访问：
- 前端：http://localhost:3000
- 代理：http://localhost:3001

---

## 📱 基本功能使用

### 添加网页

1. **点击"添加网页"按钮**
   - 位于页面右上角

2. **填写信息**
   - URL：输入要展示的网站地址
   - 标题：给这个网页起个名字
   - 使用代理：勾选后通过CORS代理加载（解决跨域问题）

3. **点击"添加"**
   - 网页会立即出现在网格布局中

**示例URL：**
```
https://example.com
https://www.baidu.com
https://www.bing.com
https://developer.mozilla.org
```

### 网格布局

系统会根据网页数量自动调整布局：

```
1-2个网页 → 1列布局
3-4个网页 → 2列布局
5个以上   → 3列布局
```

### 全屏模式

1. **进入全屏**
   - 点击网页右上角的 **⤢** 按钮
   - 该网页会全屏显示，其他网页隐藏

2. **退出全屏**
   - 再次点击 **⤓** 按钮
   - 恢复网格布局

### 删除网页

- 点击网页右上角的 **✕** 按钮
- 网页会立即从列表中移除

### 修改网页配置

1. 点击"配置"按钮
2. 修改URL或标题
3. 点击"更新"

---

## 🔌 CORS代理功能

### 为什么需要代理？

很多网站有跨域限制（CORS），无法直接在iframe中加载。使用代理可以突破这个限制。

### 如何使用代理？

#### 全局代理
1. 点击"配置"按钮
2. 勾选"全局使用代理"
3. 之后添加的所有网页都会默认使用代理

#### 单个网页代理
1. 添加网页时勾选"使用代理"
2. 或在配置面板中修改单个网页的代理设置

### 代理指示器

- 使用代理的网页会显示 **🔌** 图标
- 提示该网页通过代理加载

### 代理服务器管理

```bash
# 查看代理日志
cd proxy
npm start

# 健康检查
curl http://localhost:3001/health
```

---

## 🧩 浏览器扩展（高级功能）

### 安装扩展

#### Chrome/Edge

1. **打开扩展管理页面**
   ```
   Chrome: chrome://extensions/
   Edge: edge://extensions/
   ```

2. **启用开发者模式**
   - 右上角开关打开

3. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `extension` 文件夹

4. **验证安装**
   - 浏览器工具栏会出现扩展图标

### 使用扩展

#### 1对多输入同步

这个功能允许你在多个iframe中**同步输入相同的内容**。

**使用场景：**
- 在多个搜索引擎中同时搜索
- 在多个表单中填写相同信息
- 在多个工具中输入相同参数

**操作步骤：**

1. **打开扩展**
   - 点击浏览器工具栏的扩展图标

2. **启用功能**
   - 打开"启用扩展"开关
   - 打开"同步输入到iframe"开关

3. **在任意iframe的输入框中输入**
   - 文本会自动同步到所有其他iframe的输入框

4. **查看状态**
   - Popup会显示连接的标签页数量
   - 显示活跃的iframe数量

### 扩展配置

- **启用扩展**：开启/关闭整个扩展功能
- **同步输入到iframe**：开启/关闭输入同步功能
- **刷新状态**：重新扫描当前页面的iframe

---

## 🎨 高级技巧

### 1. 批量添加网页

创建一个配置文件，然后通过localStorage导入：

```javascript
// 在浏览器控制台执行
const config = [
  { url: 'https://example1.com', title: 'Example 1' },
  { url: 'https://example2.com', title: 'Example 2' },
  { url: 'https://example3.com', title: 'Example 3' },
];

localStorage.setItem('multi-page-viewer-config', JSON.stringify(config));
location.reload();
```

### 2. 键盘快捷键

目前支持的快捷键：
- `Esc` - 退出全屏模式
- `F5` - 刷新页面（配置会保留）

### 3. 响应式设计

- **桌面**：自动使用多列布局
- **平板**：自动调整为2列
- **手机**：自动切换为1列

### 4. 性能优化

系统已内置优化：
- ✅ iframe懒加载（仅在视口内加载）
- ✅ 防抖保存（避免频繁写入localStorage）
- ✅ React.memo优化（减少不必要渲染）

---

## 📊 监控和调试

### 查看插件日志

1. **打开浏览器控制台**（F12）
2. **查看Console标签**
3. **寻找 `[Web Monitor]` 前缀的日志**

示例：
```
[Web Monitor] Iframe abc123 loaded: https://example.com
[Extension] Content script initialized
```

### 查看Redux状态

```javascript
// 在浏览器控制台执行
window.__REDUX_DEVTOOLS_EXTENSION__
```

### 查看localStorage

```javascript
// 查看保存的配置
localStorage.getItem('multi-page-viewer-config')

// 查看代理设置
localStorage.getItem('multi-page-viewer-use-proxy')

// 清空所有配置
localStorage.clear();
```

---

## 🐛 故障排除

### 问题1：网页无法加载

**症状：** iframe显示"加载失败"

**解决方案：**
1. 检查URL是否正确
2. 尝试启用"使用代理"
3. 确认代理服务器是否运行（http://localhost:3001/health）
4. 查看浏览器控制台错误信息

### 问题2：代理服务器无法启动

**症状：** `EADDRINUSE: address already in use :::3001`

**解决方案：**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# 然后重新启动
cd proxy
npm start
```

### 问题3：扩展无法同步输入

**症状：** 在一个iframe输入，其他iframe没有反应

**解决方案：**
1. 确认扩展已启用
2. 确认"同步输入到iframe"已打开
3. 刷新页面重新注入脚本
4. 检查iframe是否跨域（某些iframe可能无法注入）

### 问题4：配置丢失

**症状：** 刷新页面后，之前添加的网页不见了

**解决方案：**
1. 检查浏览器是否禁用了localStorage
2. 检查是否在隐私模式下使用
3. 尝试手动保存配置

---

## 🔒 安全性说明

### CORS代理

- ✅ 代理服务器默认允许所有域名（开发环境）
- ⚠️ 生产环境建议配置白名单
- ⚠️ 不要将代理服务器暴露在公网

### iframe沙箱

所有iframe都使用沙箱模式：
```
sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
```

### 数据存储

- ✅ 所有配置保存在本地（localStorage）
- ✅ 不上传到任何服务器
- ✅ 完全隐私保护

---

## 📈 性能建议

### 最佳实践

1. **控制iframe数量**
   - 建议：3-6个网页
   - 最多：不超过10个

2. **使用代理**
   - 仅在需要时启用
   - 会增加服务器负载

3. **及时删除不需要的网页**
   - 减少内存占用
   - 提升渲染性能

4. **定期清理localStorage**
   ```javascript
   // 清理旧的插件数据
   Object.keys(localStorage)
     .filter(key => key.startsWith('plugin-'))
     .forEach(key => localStorage.removeItem(key));
   ```

---

## 🎓 实用场景

### 场景1：多源信息聚合

```
左：新闻网站
中：社交媒体
右：邮件收件箱
```

### 场景2：开发调试

```
左：代码编辑器
中：API文档
右：测试页面
```

### 场景3：市场监控

```
左：竞争对手A
中：竞争对手B
右：行业数据
```

### 场景4：学习研究

```
左：教程文档
中：示例代码
右：笔记工具
```

---

## 🔄 更新和维护

### 更新项目

```bash
# 拉取最新代码
git pull origin main

# 更新依赖
npm install

# 重启服务
npm run dev
```

### 查看版本信息

```bash
# 查看package.json
cat package.json | grep version

# 查看git提交记录
git log --oneline -10
```

---

## 📞 获取帮助

### 文档资源

- `README.md` - 项目概述
- `TEST_CHECKLIST.md` - 测试清单
- `E2E_TEST_REPORT.md` - 测试报告
- `extension/README.md` - 扩展文档

### 问题反馈

- GitHub Issues: https://github.com/1121253041/auto/issues

### 社区交流

欢迎提交：
- Bug报告
- 功能建议
- 代码贡献
- 文档改进

---

## 🎉 开始使用

现在你已经了解了所有功能，开始使用吧！

```bash
# 快速启动
npm install && npm run dev
```

访问 http://localhost:3000 开始你的多页面浏览之旅！🚀

---

**祝你使用愉快！** 🎊