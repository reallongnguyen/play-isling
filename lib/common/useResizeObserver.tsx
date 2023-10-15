import { useEffect, useState } from 'react'

export function useResizeObserver(id: string) {
  const [contentRect, setContentRect] = useState<DOMRect>()

  useEffect(() => {
    const ele = document.getElementById(id)

    if (!ele) {
      return
    }

    setContentRect(ele.getBoundingClientRect())

    const observer = new ResizeObserver((entries) => {
      setContentRect(entries[0].contentRect)
    })

    observer.observe(ele)

    return () => {
      observer.unobserve(ele)
    }
  }, [id])

  return { contentRect }
}
