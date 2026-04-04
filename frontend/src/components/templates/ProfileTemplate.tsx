/**
 * ProfileTemplate — user/entity profile with hero card + tabs.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { Tabs, TabList, Tab, TabPanel } from '../ui/Tabs'
import type { OverviewTab } from './ItemOverviewTemplate'

export interface ProfileTemplateProps {
  hero: ReactNode           // Avatar, name, role, badges etc.
  tabs: OverviewTab[]
  activeTab: string
  onTabChange: (tab: string) => void
  sidePanel?: ReactNode
  className?: string
}

export function ProfileTemplate({ hero, tabs, activeTab, onTabChange, sidePanel, className }: ProfileTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Hero */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary-600 to-primary-400" />
        <div className="px-6 pb-5 -mt-10">{hero}</div>
      </div>

      <div className={cn('flex gap-6 items-start', sidePanel ? 'flex-row' : '')}>
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onChange={onTabChange}>
            <TabList>
              {tabs.map(t => <Tab key={t.value} value={t.value} icon={t.icon}>{t.label}</Tab>)}
            </TabList>
            {tabs.map(t => (
              <TabPanel key={t.value} value={t.value} className="mt-4">{t.content}</TabPanel>
            ))}
          </Tabs>
        </div>
        {sidePanel && <div className="w-72 shrink-0">{sidePanel}</div>}
      </div>
    </div>
  )
}
