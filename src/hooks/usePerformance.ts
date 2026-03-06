import { useRef, useCallback } from 'react'

/**
 * 自定义Hook：防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fnRef = useRef(fn)

  // 更新fn引用
  fnRef.current = fn

  return useCallback((...args: Parameters<T>) => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      fnRef.current(...args)
    }, delay)
  }, [delay])
}

/**
 * 自定义Hook：节流函数
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<number>(0)
  const fnRef = useRef(fn)

  fnRef.current = fn

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      fnRef.current(...args)
    }
  }, [delay])
}

/**
 * 自定义Hook：防抖值
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

import { useState, useEffect } from 'react'