/**
 * SavedSearch — save/recall filter combinations.
 * Persists to saved_searches table via callbacks.
 */
import { cn } from '@/utils/cn'
import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  triggerClassName?: string
}

export function SavedSearch({ saved, currentFilters, onApply, onSave, onDelete, className, triggerClassName }: SavedSearchProps) {
  const { t } = useTranslation(['common'])
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
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--hr-text)] shadow-[var(--shadow-xs)] transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]',
          triggerClassName,
        )}
      >
        <Bookmark size={15} />
        {t('ui.savedViews', { ns: 'common' })}
        {saved.length > 0 && (
          <span className="rounded-full bg-[color:var(--hr-shell-accent-soft)] px-1.5 py-0.5 text-xs font-semibold text-[color:var(--hr-shell-accent-strong)]">{saved.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-white shadow-[var(--shadow-lg)]">
          {/* Save current */}
          <div className="border-b border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-4 pb-3 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--hr-text-subtle)]">{t('ui.saveCurrentView', { ns: 'common' })}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={t('ui.viewName', { ns: 'common' })}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="hr-app-input flex-1 px-3 text-sm"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!newName.trim()}
                className="rounded-md bg-[color:var(--hr-shell-accent)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--hr-shell-accent-strong)] disabled:opacity-50"
              >
                {t('saveChanges', { ns: 'common' })}
              </button>
            </div>
          </div>

          {/* Saved list */}
          {saved.length > 0 ? (
            <ul className="py-2">
              {saved.map(s => (
                <li key={s.id} className="flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--hr-surface-muted)]">
                  <BookmarkCheck size={14} className="shrink-0 text-[color:var(--hr-shell-accent)]" />
                  <button
                    type="button"
                    onClick={() => { onApply(s.filters); setOpen(false) }}
                    className="flex-1 text-left text-sm text-[color:var(--hr-text)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]"
                  >
                    {s.name}
                  </button>
                  <button type="button" onClick={() => onDelete(s.id)} className="rounded p-0.5 text-[color:var(--hr-text-subtle)] hover:text-[color:var(--color-error-600)]">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-center text-xs text-[color:var(--hr-text-subtle)]">{t('ui.noSavedViews', { ns: 'common' })}</p>
          )}
        </div>
      )}
    </div>
  )
}
