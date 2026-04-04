import { cn } from '@/utils/cn'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  href?: string
  danger?: boolean
  disabled?: boolean
  separator?: never
}

export interface DropdownSeparator {
  separator: true
  label?: never
}

export type DropdownMenuItemType = DropdownItem | DropdownSeparator

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItemType[]
  align?: 'left' | 'right'
  className?: string
}

export function DropdownMenu({ trigger, items, align = 'right', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  function toggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom + 4, left: align === 'right' ? rect.right : rect.left, width: rect.width })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <>
      <div ref={triggerRef} onClick={toggle} className="inline-flex">
        {trigger}
      </div>
      {open && createPortal(
        <div
          style={{
            position: 'fixed',
            top: coords.top,
            ...(align === 'right' ? { right: window.innerWidth - coords.left } : { left: coords.left }),
            zIndex: 9999,
            minWidth: Math.max(coords.width, 160),
          }}
          className={cn(
            'bg-white rounded-lg shadow-lg border border-neutral-200 py-1 text-sm',
            className,
          )}
        >
          {items.map((item, idx) => {
            if ('separator' in item && item.separator) {
              return <div key={idx} className="my-1 border-t border-neutral-100" />
            }
            const i = item as DropdownItem
            const content = (
              <span className="flex items-center gap-2">
                {i.icon && <span className="shrink-0">{i.icon}</span>}
                {i.label}
              </span>
            )
            const cls = cn(
              'flex w-full items-center px-3 py-2 transition-colors text-left',
              i.danger ? 'text-error-700 hover:bg-error-50' : 'text-neutral-700 hover:bg-neutral-50',
              i.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            )
            return i.href ? (
              <a key={idx} href={i.href} className={cls} onClick={() => setOpen(false)}>{content}</a>
            ) : (
              <button key={idx} type="button" className={cls} disabled={i.disabled} onClick={() => { i.onClick?.(); setOpen(false) }}>{content}</button>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
}
