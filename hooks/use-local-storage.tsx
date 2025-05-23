"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Create a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize state on first render only
  useEffect(() => {
    if (!isFirstRender.current) return

    try {
      if (typeof window === "undefined") return

      // Get from local storage by key
      const item = window.localStorage.getItem(key)

      // Parse stored json or return initialValue
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    } finally {
      isFirstRender.current = false
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      if (typeof window === "undefined") return

      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue]
}
