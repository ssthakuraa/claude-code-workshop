/**
 * ColumnManager — drag-to-reorder, show/hide columns.
 * Persists to user_preferences via callback.
 */
import { cn } from '@/utils/cn'
import { GripVertical, Settings2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'
import { Toggle } from './Checkbox'

export interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  locked?: boolean    // cannot be hidden or reordered
}

export interface ColumnManagerProps {
  columns: ColumnConfig[]
  onChange: (columns: ColumnConfig[]) => void
  triggerClassName?: string
}

const DRAG_TYPE = 'column-row'

function ColumnRow({ col, index, onToggle, onMove }: { col: ColumnConfig; index: number; onToggle: () => void; onMove: (from: number, to: number) => void }) {
  const [, drag, preview] = useDrag({ type: DRAG_TYPE, item: { index }, canDrag: !col.locked })
  const [{ isOver }, drop] = useDrop<{ index: number }, void, { isOver: boolean }>({
    accept: DRAG_TYPE,
    drop: item => { if (item.index !== index) onMove(item.index, index) },
    collect: m => ({ isOver: m.isOver() }),
  })
  const setRowRef = useCallback((node: HTMLLIElement | null) => {
    if (node) {
      preview(drop(node))
    }
  }, [drop, preview])

  return (
    <li
      ref={setRowRef}
      className={cn('flex items-center gap-2 px-3 py-2 rounded-md transition-colors', isOver && 'bg-primary-50', col.locked && 'opacity-60')}
    >
      <span ref={drag as unknown as React.Ref<HTMLSpanElement>} className={cn('text-neutral-300 cursor-grab', col.locked && 'cursor-not-allowed')}>
        <GripVertical size={14} />
      </span>
      <span className="flex-1 text-sm text-neutral-700">{col.label}</span>
      <Toggle checked={col.visible} onChange={onToggle} disabled={col.locked} size="sm" />
    </li>
  )
}

export function ColumnManager({ columns, onChange, triggerClassName }: ColumnManagerProps) {
  const { t } = useTranslation(['common'])
  const [open, setOpen] = useState(false)

  function toggle(key: string) {
    onChange(columns.map(c => c.key === key ? { ...c, visible: !c.visible } : c))
  }

  function move(from: number, to: number) {
    const next = [...columns]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn('inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--hr-text)] shadow-[var(--shadow-xs)] transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]', triggerClassName)}
      >
        <Settings2 size={15} />
        {t('ui.columns', { ns: 'common' })}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-white shadow-[var(--shadow-lg)]">
          <p className="border-b border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--hr-text-subtle)]">{t('ui.manageColumns', { ns: 'common' })}</p>
          <DndProvider backend={HTML5Backend}>
            <ul className="py-2">
              {columns.map((col, i) => (
                <ColumnRow key={col.key} col={col} index={i} onToggle={() => toggle(col.key)} onMove={move} />
              ))}
            </ul>
          </DndProvider>
        </div>
      )}
    </div>
  )
}
