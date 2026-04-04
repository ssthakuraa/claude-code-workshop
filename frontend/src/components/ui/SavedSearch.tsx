/**
 * SavedSearch — save/recall filter combinations.
 * Persists to saved_searches table via callbacks.
 */
import { cn } from '@/utils/cn'
import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'

export interface SavedSearchItem {
  id: string | number
  name: string
  filters: Record<string, unknown>
}

export interface SavedSearchProps {
  saved: SavedSearchItem[]
  currentFilters: Record<string, unknown>
  onApply: (filters: Record<string, unknown>) => void
  onSave: (name: string, filters: Record<string, unknown>) => void
  onDelete: (id: string | number) => void
  className?: string
}

export function SavedSearch({ saved, currentFilters, onApply, onSave, onDelete, className }: SavedSearchProps) {
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')

  function handleSave() {
    if (!newName.trim()) return
    onSave(newName.trim(), currentFilters)
    setNewName('')
    setOpen(false)
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
      >
        <Bookmark size={15} />
        Saved Searches
        {saved.length > 0 && (
          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{saved.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-neutral-200 w-72 py-2">
          {/* Save current */}
          <div className="px-3 pb-2 border-b border-neutral-100">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Save Current Search</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Search name…"
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="flex-1 text-sm px-2.5 py-1.5 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="button" onClick={handleSave} disabled={!newName.trim()} className="px-2.5 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-md disabled:opacity-50 hover:bg-primary-700 transition-colors">
                Save
              </button>
            </div>
          </div>

          {/* Saved list */}
          {saved.length > 0 ? (
            <ul className="mt-1">
              {saved.map(s => (
                <li key={s.id} className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50">
                  <BookmarkCheck size={14} className="text-primary-500 shrink-0" />
                  <button type="button" onClick={() => { onApply(s.filters); setOpen(false) }} className="flex-1 text-sm text-left text-neutral-700 hover:text-primary-600">
                    {s.name}
                  </button>
                  <button type="button" onClick={() => onDelete(s.id)} className="p-0.5 rounded text-neutral-400 hover:text-error-600">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-xs text-neutral-400 text-center">No saved searches yet</p>
          )}
        </div>
      )}
    </div>
  )
}
