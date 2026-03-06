import type { Plugin, PluginContext, PluginConstructor } from '../types/plugin'

class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private context: PluginContext

  constructor(context: PluginContext) {
    this.context = context
  }

  // 注册插件
  async register(PluginConstructor: PluginConstructor): Promise<void> {
    try {
      const plugin = PluginConstructor(this.context)

      if (this.plugins.has(plugin.id)) {
        console.warn(`Plugin ${plugin.id} is already registered`)
        return
      }

      this.plugins.set(plugin.id, plugin)

      // 调用 onLoad 钩子
      if (plugin.onLoad) {
        await plugin.onLoad()
      }

      console.log(`Plugin ${plugin.name} (${plugin.id}) registered successfully`)
    } catch (error) {
      console.error('Failed to register plugin:', error)
      throw error
    }
  }

  // 卸载插件
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found`)
      return
    }

    try {
      // 调用 onUnload 钩子
      if (plugin.onUnload) {
        await plugin.onUnload()
      }

      this.plugins.delete(pluginId)
      console.log(`Plugin ${plugin.name} (${plugin.id}) unregistered successfully`)
    } catch (error) {
      console.error(`Failed to unregister plugin ${pluginId}:`, error)
      throw error
    }
  }

  // 激活插件
  async activate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    if (plugin.onActivate) {
      await plugin.onActivate()
    }
  }

  // 停用插件
  async deactivate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    if (plugin.onDeactivate) {
      await plugin.onDeactivate()
    }
  }

  // 获取所有插件
  getAll(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  // 获取单个插件
  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  // 触发 iframe 加载钩子
  async triggerIframeLoad(iframeId: string, url: string): Promise<void> {
    for (const plugin of this.plugins.values()) {
      try {
        if (plugin.onIframeLoad) {
          await plugin.onIframeLoad(iframeId, url)
        }
      } catch (error) {
        console.error(`Plugin ${plugin.id} onIframeLoad error:`, error)
      }
    }
  }

  // 触发 iframe 错误钩子
  async triggerIframeError(iframeId: string, url: string, error: Error): Promise<void> {
    for (const plugin of this.plugins.values()) {
      try {
        if (plugin.onIframeError) {
          await plugin.onIframeError(iframeId, url, error)
        }
      } catch (err) {
        console.error(`Plugin ${plugin.id} onIframeError error:`, err)
      }
    }
  }

  // 触发配置变更钩子
  async triggerConfigChange(config: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      try {
        if (plugin.onConfigChange) {
          await plugin.onConfigChange(config)
        }
      } catch (error) {
        console.error(`Plugin ${plugin.id} onConfigChange error:`, error)
      }
    }
  }
}

export { PluginManager }