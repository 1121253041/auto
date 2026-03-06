import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, IframeConfig } from '../types'

const STORAGE_KEY = 'multi-page-viewer-config'
const PROXY_KEY = 'multi-page-viewer-use-proxy'

const loadFromStorage = (): IframeConfig[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load config from storage:', error)
  }
  return []
}

const loadProxySetting = (): boolean => {
  try {
    const saved = localStorage.getItem(PROXY_KEY)
    if (saved !== null) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load proxy setting from storage:', error)
  }
  return false
}

const saveToStorage = (iframes: IframeConfig[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(iframes))
  } catch (error) {
    console.error('Failed to save config to storage:', error)
  }
}

const saveProxySetting = (useProxy: boolean) => {
  try {
    localStorage.setItem(PROXY_KEY, JSON.stringify(useProxy))
  } catch (error) {
    console.error('Failed to save proxy setting to storage:', error)
  }
}

const initialState: AppState = {
  iframes: loadFromStorage(),
  fullscreenId: null,
  useProxy: loadProxySetting(),
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addIframe: (state, action: PayloadAction<{ url: string; title: string; useProxy?: boolean }>) => {
      const newIframe: IframeConfig = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: action.payload.url,
        title: action.payload.title,
        useProxy: action.payload.useProxy ?? state.useProxy,
      }
      state.iframes.push(newIframe)
      saveToStorage(state.iframes)
    },
    removeIframe: (state, action: PayloadAction<string>) => {
      state.iframes = state.iframes.filter((iframe) => iframe.id !== action.payload)
      if (state.fullscreenId === action.payload) {
        state.fullscreenId = null
      }
      saveToStorage(state.iframes)
    },
    updateIframe: (
      state,
      action: PayloadAction<{ id: string; url: string; title: string; useProxy?: boolean }>
    ) => {
      const iframe = state.iframes.find((i) => i.id === action.payload.id)
      if (iframe) {
        iframe.url = action.payload.url
        iframe.title = action.payload.title
        iframe.useProxy = action.payload.useProxy ?? iframe.useProxy
        saveToStorage(state.iframes)
      }
    },
    toggleFullscreen: (state, action: PayloadAction<string>) => {
      state.fullscreenId = state.fullscreenId === action.payload ? null : action.payload
    },
    exitFullscreen: (state) => {
      state.fullscreenId = null
    },
    setUseProxy: (state, action: PayloadAction<boolean>) => {
      state.useProxy = action.payload
      saveProxySetting(action.payload)
    },
  },
})

export const { addIframe, removeIframe, updateIframe, toggleFullscreen, exitFullscreen, setUseProxy } =
  appSlice.actions

export default appSlice.reducer