/**
 * ItemOverviewTemplate — detail pages with header card + tabbed content (~30 screens).
 * Example: Property detail, Lease detail, Resident profile.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps } from '../ui/PageHeader'
import { Tabs, TabList, Tab, TabPanel } from '../ui/Tabs'

export interface OverviewTab {
  value: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

export interface ItemOverviewTemplateProps extends PageHeaderProps {
  headerCard?: ReactNode        // summary card under the page title
  tabs: OverviewTab[]
  activeTab: string
  onTabChange: (tab: string) => void
  sidePanel?: ReactNode         // optional right-side panel (e.g. quick actions)
  className?: string
}

export function ItemOverviewTemplate({ headerCard, tabs, activeTab, onTabChange, sidePanel, className, ...headerProps }: ItemOverviewTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <PageHeader {...headerProps} />
      {headerCard && <div>{headerCard}</div>}

      <div className={cn('flex gap-6', sidePanel ? 'items-start' : '')}>
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onChange={onTabChange}>
            <TabList>
              {tabs.map(t => (
                <Tab key={t.value} value={t.value} icon={t.icon}>{t.label}</Tab>
              ))}
            </TabList>
            {tabs.map(t => (
              <TabPanel key={t.value} value={t.value} className="mt-4">
                {t.content}
              </TabPanel>
            ))}
          </Tabs>
        </div>
        {sidePanel && <div className="w-80 shrink-0">{sidePanel}</div>}
      </div>
    </div>
  )
}
