/**
 * SettingsTemplate — side nav (vertical tabs) + content sections layout.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export interface SettingsSection {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

export interface SettingsGroup {
  title?: string
  sections: SettingsSection[]
}

export interface SettingsTemplateProps {
  groups: SettingsGroup[]
  activeSection: string
  onSectionChange?: (id: string) => void
  children: ReactNode
  className?: string
}

export function SettingsTemplate({ groups, activeSection, onSectionChange, children, className }: SettingsTemplateProps) {
  return (
    <div className={cn('flex gap-8 items-start', className)}>
      {/* Side nav */}
      <nav className="w-56 shrink-0 flex flex-col gap-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.title && <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-3 mb-1">{group.title}</p>}
            <div className="flex flex-col gap-0.5">
              {group.sections.map(s => {
                const isActive = s.id === activeSection
                const cls = cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )
                if (s.href) return (
                  <NavLink key={s.id} to={s.href} className={cls}>{s.icon && <span>{s.icon}</span>}{s.label}</NavLink>
                )
                return (
                  <button key={s.id} type="button" onClick={() => { s.onClick?.(); onSectionChange?.(s.id) }} className={cn(cls, 'w-full text-left')}>
                    {s.icon && <span className="shrink-0">{s.icon}</span>}
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
