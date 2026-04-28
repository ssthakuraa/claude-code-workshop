import { cn } from '@/utils/cn'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export function Tooltip({ content, children, placement = 'top', delay = 200, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const gap = 6
      let top = 0
      let left = 0
      if (placement === 'top') { top = rect.top - gap; left = rect.left + rect.width / 2 }
      else if (placement === 'bottom') { top = rect.bottom + gap; left = rect.left + rect.width / 2 }
      else if (placement === 'left') { top = rect.top + rect.height / 2; left = rect.left - gap }
      else { top = rect.top + rect.height / 2; left = rect.right + gap }
      setCoords({ top, left })
      setVisible(true)
    }, delay)
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const transformMap = {
    top:    'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0)',
    left:   'translate(-100%, -50%)',
    right:  'translate(0, -50%)',
  }

  return (
    <>
      <span ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} className="inline-flex">
        {children}
      </span>
      {visible && createPortal(
        <div
          role="tooltip"
          style={{ position: 'fixed', top: coords.top, left: coords.left, transform: transformMap[placement], zIndex: 9999 }}
          className={cn(
            'px-2 py-1 rounded-md text-xs font-medium shadow-md pointer-events-none',
            'bg-neutral-900 text-white max-w-xs',
            className,
          )}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}
