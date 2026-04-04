/**
 * WidgetLibrary — categorized widget catalog with search and preview.
 * Used with DashboardBuilder to let users discover and add widgets.
 */
import { cn } from '@/utils/cn'
import { Plus, Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export interface WidgetDefinition {
  id: string
  name: string
  description?: string
  category: string
  preview?: ReactNode
  size?: string
}

export interface WidgetLibraryProps {
  widgets: WidgetDefinition[]
  onAdd: (widgetId: string) => void
  className?: string
}

export function WidgetLibrary({ widgets, onAdd, className }: WidgetLibraryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(widgets.map(w => w.category)))
  const filtered = widgets.filter(w => {
    const matchesQuery = !query || w.name.toLowerCase().includes(query.toLowerCase()) || w.description?.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !activeCategory || w.category === activeCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search widgets…"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn('px-3 py-1 rounded-full text-xs font-medium transition-colors', !activeCategory ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn('px-3 py-1 rounded-full text-xs font-medium transition-colors', activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(w => (
          <div key={w.id} className="group flex flex-col rounded-lg border border-neutral-200 bg-white overflow-hidden hover:border-primary-300 hover:shadow-sm transition-all">
            {w.preview ? (
              <div className="h-28 bg-neutral-50 border-b border-neutral-100 flex items-center justify-center p-3 text-neutral-400">
                {w.preview}
              </div>
            ) : (
              <div className="h-28 bg-neutral-50 border-b border-neutral-100 flex items-center justify-center">
                <span className="text-xs text-neutral-400">Preview unavailable</span>
              </div>
            )}
            <div className="p-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-neutral-900">{w.name}</p>
                {w.description && <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{w.description}</p>}
                <span className="mt-1.5 inline-block text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">{w.category}</span>
              </div>
              <button
                type="button"
                onClick={() => onAdd(w.id)}
                className="shrink-0 p-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-neutral-400">No widgets match your search</div>
      )}
    </div>
  )
}
