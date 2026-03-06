import { describe, it, expect } from 'vitest'
import { debounce, throttle, deepClone, formatFileSize, isValidUrl, generateId } from '../utils/helpers'

describe('Helpers Utilities', () => {
  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let counter = 0
      const increment = debounce(() => counter++, 100)

      increment()
      increment()
      increment()

      expect(counter).toBe(0)

      await new Promise(resolve => setTimeout(resolve, 150))

      expect(counter).toBe(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      let counter = 0
      const increment = throttle(() => counter++, 100)

      increment() // Should execute immediately
      expect(counter).toBe(1)

      increment() // Should be throttled
      expect(counter).toBe(1)

      await new Promise(resolve => setTimeout(resolve, 150))

      increment() // Should execute again
      expect(counter).toBe(2)
    })
  })

  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const original = {
        a: 1,
        b: { c: 2 },
        d: [3, 4, 5],
      }

      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.d).not.toBe(original.d)
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('isValidUrl', () => {
    it('should validate URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })
})