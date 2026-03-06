export interface IframeConfig {
  id: string
  url: string
  title: string
  useProxy?: boolean
}

export interface AppState {
  iframes: IframeConfig[]
  fullscreenId: string | null
  useProxy: boolean
}