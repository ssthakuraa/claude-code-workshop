import { cn } from '@/utils/cn'
import { createContext, useContext, type ReactNode } from 'react'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>')
  return ctx
}

export interface TabsProps {
  value: string
  onChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
  className?: string
}

export function Tabs({ value, onChange, orientation = 'horizontal', children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange, orientation }}>
      <div className={cn(orientation === 'vertical' ? 'flex gap-6' : 'flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList({ children, className }: TabListProps) {
  const { orientation } = useTabsContext()
  return (
    <div
      role="tablist"
      className={cn(
        orientation === 'vertical'
          ? 'flex flex-col min-w-[160px] border-r border-neutral-200 pr-1'
          : 'flex border-b border-neutral-200 gap-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface TabProps {
  value: string
  children: ReactNode
  disabled?: boolean
  icon?: ReactNode
}

export function Tab({ value, children, disabled, icon }: TabProps) {
  const { value: activeValue, onChange, orientation } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        orientation === 'vertical'
          ? cn(
              'w-full text-left px-3 py-2 rounded-md',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
            )
          : cn(
              'px-3 py-2 border-b-2 -mb-px rounded-t-md',
              isActive
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
            ),
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

export interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: activeValue } = useTabsContext()
  if (activeValue !== value) return null
  return (
    <div role="tabpanel" className={cn('flex-1', className)}>
      {children}
    </div>
  )
}
