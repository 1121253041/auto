import { describe, it, expect, beforeEach } from 'vitest'
import appReducer, {
  addIframe,
  removeIframe,
  updateIframe,
  toggleFullscreen,
  exitFullscreen,
  setUseProxy,
} from '../../src/store/appSlice'
import type { AppState } from '../../src/types'

describe('appSlice reducer', () => {
  let initialState: AppState

  beforeEach(() => {
    initialState = {
      iframes: [],
      fullscreenId: null,
      useProxy: false,
    }
  })

  describe('addIframe', () => {
    it('should add a new iframe', () => {
      const action = addIframe({
        url: 'https://example.com',
        title: 'Example',
        useProxy: false,
      })

      const newState = appReducer(initialState, action)

      expect(newState.iframes).toHaveLength(1)
      expect(newState.iframes[0].url).toBe('https://example.com')
      expect(newState.iframes[0].title).toBe('Example')
      expect(newState.iframes[0].useProxy).toBe(false)
      expect(newState.iframes[0].id).toBeDefined()
    })

    it('should use global proxy setting when useProxy is not specified', () => {
      const stateWithProxy = { ...initialState, useProxy: true }
      const action = addIframe({
        url: 'https://example.com',
        title: 'Example',
      })

      const newState = appReducer(stateWithProxy, action)

      expect(newState.iframes[0].useProxy).toBe(true)
    })
  })

  describe('removeIframe', () => {
    it('should remove an iframe', () => {
      const stateWithIframe = {
        ...initialState,
        iframes: [
          {
            id: 'test-id',
            url: 'https://example.com',
            title: 'Example',
            useProxy: false,
          },
        ],
      }

      const action = removeIframe('test-id')
      const newState = appReducer(stateWithIframe, action)

      expect(newState.iframes).toHaveLength(0)
    })

    it('should clear fullscreenId when removing fullscreen iframe', () => {
      const stateWithIframe = {
        ...initialState,
        iframes: [
          {
            id: 'test-id',
            url: 'https://example.com',
            title: 'Example',
            useProxy: false,
          },
        ],
        fullscreenId: 'test-id',
      }

      const action = removeIframe('test-id')
      const newState = appReducer(stateWithIframe, action)

      expect(newState.fullscreenId).toBeNull()
    })
  })

  describe('updateIframe', () => {
    it('should update an existing iframe', () => {
      const stateWithIframe = {
        ...initialState,
        iframes: [
          {
            id: 'test-id',
            url: 'https://example.com',
            title: 'Example',
            useProxy: false,
          },
        ],
      }

      const action = updateIframe({
        id: 'test-id',
        url: 'https://updated.com',
        title: 'Updated',
        useProxy: true,
      })

      const newState = appReducer(stateWithIframe, action)

      expect(newState.iframes[0].url).toBe('https://updated.com')
      expect(newState.iframes[0].title).toBe('Updated')
      expect(newState.iframes[0].useProxy).toBe(true)
    })
  })

  describe('toggleFullscreen', () => {
    it('should toggle fullscreen on', () => {
      const action = toggleFullscreen('test-id')
      const newState = appReducer(initialState, action)

      expect(newState.fullscreenId).toBe('test-id')
    })

    it('should toggle fullscreen off', () => {
      const stateWithFullscreen = {
        ...initialState,
        fullscreenId: 'test-id',
      }

      const action = toggleFullscreen('test-id')
      const newState = appReducer(stateWithFullscreen, action)

      expect(newState.fullscreenId).toBeNull()
    })
  })

  describe('exitFullscreen', () => {
    it('should exit fullscreen mode', () => {
      const stateWithFullscreen = {
        ...initialState,
        fullscreenId: 'test-id',
      }

      const action = exitFullscreen()
      const newState = appReducer(stateWithFullscreen, action)

      expect(newState.fullscreenId).toBeNull()
    })
  })

  describe('setUseProxy', () => {
    it('should set global proxy setting', () => {
      const action = setUseProxy(true)
      const newState = appReducer(initialState, action)

      expect(newState.useProxy).toBe(true)
    })
  })
})