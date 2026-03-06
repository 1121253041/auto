import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { GridLayout } from '../../src/components/GridLayout'
import appReducer from '../../src/store/appSlice'
import type { IframeConfig } from '../../src/types'

describe('GridLayout', () => {
  const mockIframes: IframeConfig[] = [
    {
      id: '1',
      url: 'https://example1.com',
      title: 'Example 1',
      useProxy: false,
    },
    {
      id: '2',
      url: 'https://example2.com',
      title: 'Example 2',
      useProxy: true,
    },
  ]

  const createTestStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        app: appReducer,
      },
      preloadedState: {
        app: {
          iframes: [],
          fullscreenId: null,
          useProxy: false,
          ...initialState,
        },
      },
    })
  }

  it('should render correct number of iframes', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <GridLayout
          iframes={mockIframes}
          fullscreenId={null}
          onFullscreenToggle={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    )

    const titles = screen.getAllByRole('heading', { level: 3 })
    expect(titles).toHaveLength(2)
  })

  it('should apply fullscreen class to the correct iframe', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <GridLayout
          iframes={mockIframes}
          fullscreenId="1"
          onFullscreenToggle={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    )

    const fullscreenContainer = screen.getByTitle('Example 1').closest('.iframe-container')
    expect(fullscreenContainer).toHaveClass('fullscreen')
  })

  it('should apply correct grid columns for different iframe counts', () => {
    const store = createTestStore()

    // Test 1-2 iframes (should use 1 column)
    const { rerender } = render(
      <Provider store={store}>
        <GridLayout
          iframes={[mockIframes[0]]}
          fullscreenId={null}
          onFullscreenToggle={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    )

    let containers = document.querySelectorAll('.iframe-container')
    expect(containers).toHaveLength(1)

    // Test 3-4 iframes (should use 2 columns)
    rerender(
      <Provider store={store}>
        <GridLayout
          iframes={[...mockIframes, ...mockIframes]}
          fullscreenId={null}
          onFullscreenToggle={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    )

    containers = document.querySelectorAll('.iframe-container')
    expect(containers).toHaveLength(4)
  })
})