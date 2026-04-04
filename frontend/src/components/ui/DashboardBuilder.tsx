/**
 * DashboardBuilder — drag-drop widget layout builder.
 * Persists widget layout to user_preferences via onLayoutChange.
 */
import { cn } from '@/utils/cn'
import { GripVertical, Plus, X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1' | 'full'

export interface WidgetInstance {
  id: string
  widgetId: string
  title: string
  size: WidgetSize
  content: ReactNode
}

export interface DashboardBuilderProps {
  widgets: WidgetInstance[]
  onLayoutChange?: (widgets: WidgetInstance[]) => void
  onAddWidget?: () => void
  onRemoveWidget?: (id: string) => void
  editable?: boolean
  className?: string
}

const DRAG_TYPE = 'widget'
const colSpan: Record<WidgetSize, string> = {
  '1x1': 'col-span-1',
  '2x1': 'col-span-2',
  '1x2': 'col-span-1 row-span-2',
  '2x2': 'col-span-2 row-span-2',
  '3x1': 'col-span-3',
  'full': 'col-span-full',
}

function WidgetCard({ widget, index, onMove, onRemove, editable }: { widget: WidgetInstance; index: number; onMove: (from: number, to: number) => void; onRemove?: () => void; editable?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag({ type: DRAG_TYPE, item: { index }, canDrag: !!editable, collect: m => ({ isDragging: m.isDragging() }) })
  const [{ isOver }, drop] = useDrop<{ index: number }, void, { isOver: boolean }>({
    accept: DRAG_TYPE,
    drop: item => { if (item.index !== index) onMove(item.index, index) },
    collect: m => ({ isOver: m.isOver() }),
  })
  drop(ref)

  return (
    <div
      ref={ref}
      className={cn('bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all', colSpan[widget.size], isDragging && 'opacity-40', isOver && 'ring-2 ring-primary-400')}
    >
      <div className={cn('flex items-center justify-between px-4 py-2.5 border-b border-neutral-100', editable && 'cursor-move')}>
        <div className="flex items-center gap-2">
          {editable && <span ref={drag as unknown as React.Ref<HTMLSpanElement>}><GripVertical size={14} className="text-neutral-300" /></span>}
          <span className="text-sm font-semibold text-neutral-800">{widget.title}</span>
        </div>
        {editable && onRemove && (
          <button type="button" onClick={onRemove} className="p-0.5 rounded text-neutral-400 hover:text-error-600 hover:bg-error-50">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="p-4">{widget.content}</div>
    </div>
  )
}

export function DashboardBuilder({ widgets, onLayoutChange, onAddWidget, onRemoveWidget, editable = false, className }: DashboardBuilderProps) {
  function move(from: number, to: number) {
    const next = [...widgets]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onLayoutChange?.(next)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('grid grid-cols-4 gap-4 auto-rows-min', className)}>
        {widgets.map((w, i) => (
          <WidgetCard
            key={w.id}
            widget={w}
            index={i}
            onMove={move}
            onRemove={onRemoveWidget ? () => onRemoveWidget(w.id) : undefined}
            editable={editable}
          />
        ))}
        {editable && onAddWidget && (
          <button
            type="button"
            onClick={onAddWidget}
            className="col-span-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 py-8 text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Add Widget</span>
          </button>
        )}
      </div>
    </DndProvider>
  )
}
