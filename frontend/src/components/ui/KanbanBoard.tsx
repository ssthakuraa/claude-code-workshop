import { cn } from '@/utils/cn'
import { Plus } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const ITEM_TYPE = 'kanban-card'

export interface KanbanCard {
  id: string | number
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  assignee?: string
  data?: unknown
}

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  cards: KanbanCard[]
  limit?: number
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string | number, fromColumn: string, toColumn: string, index: number) => void
  onCardClick?: (card: KanbanCard, column: KanbanColumn) => void
  onAddCard?: (columnId: string) => void
  renderCard?: (card: KanbanCard, column: KanbanColumn) => ReactNode
  className?: string
}

interface DragItem { cardId: string | number; columnId: string }

function KanbanCardItem({ card, column, onCardClick, renderCard }: { card: KanbanCard; column: KanbanColumn; onCardClick?: KanbanBoardProps['onCardClick']; renderCard?: KanbanBoardProps['renderCard'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ITEM_TYPE,
    item: { cardId: card.id, columnId: column.id },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  })
  drag(ref)

  return (
    <div
      ref={ref}
      onClick={() => onCardClick?.(card, column)}
      className={cn(
        'bg-white rounded-lg border border-neutral-200 p-3 shadow-xs cursor-pointer',
        'hover:shadow-sm hover:border-neutral-300 transition-all',
        isDragging && 'opacity-40',
        onCardClick && 'cursor-pointer',
      )}
    >
      {renderCard ? renderCard(card, column) : (
        <>
          <p className="text-sm font-medium text-neutral-900">{card.title}</p>
          {card.subtitle && <p className="text-xs text-neutral-500 mt-0.5">{card.subtitle}</p>}
          {card.badge && (
            <span
              className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: card.badgeColor ? `${card.badgeColor}20` : '#eff6ff', color: card.badgeColor ?? '#2563eb' }}
            >
              {card.badge}
            </span>
          )}
        </>
      )}
    </div>
  )
}

function KanbanColumnView({ column, onCardMove, onCardClick, onAddCard, renderCard }: { column: KanbanColumn } & Omit<KanbanBoardProps, 'columns' | 'className'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    drop: item => {
      if (item.columnId !== column.id) onCardMove?.(item.cardId, item.columnId, column.id, column.cards.length)
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  })
  drop(ref)

  const atLimit = column.limit !== undefined && column.cards.length >= column.limit

  return (
    <div className="flex flex-col min-w-[260px] max-w-[280px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          {column.color && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: column.color }} />}
          <span className="text-sm font-semibold text-neutral-800">{column.title}</span>
          <span className="text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full font-medium">
            {column.cards.length}{column.limit ? `/${column.limit}` : ''}
          </span>
        </div>
        {onAddCard && (
          <button type="button" onClick={() => onAddCard(column.id)} disabled={atLimit} className="p-0.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-40">
            <Plus size={14} />
          </button>
        )}
      </div>
      {/* Drop zone */}
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 flex-1 rounded-lg p-2 min-h-[120px] transition-colors',
          isOver ? 'bg-primary-50 border-2 border-dashed border-primary-300' : 'bg-neutral-100 border-2 border-transparent',
        )}
      >
        {column.cards.map(card => (
          <KanbanCardItem key={card.id} card={card} column={column} onCardClick={onCardClick} renderCard={renderCard} />
        ))}
      </div>
    </div>
  )
}

export function KanbanBoard({ columns, onCardMove, onCardClick, onAddCard, renderCard, className }: KanbanBoardProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {columns.map(col => (
          <KanbanColumnView key={col.id} column={col} onCardMove={onCardMove} onCardClick={onCardClick} onAddCard={onAddCard} renderCard={renderCard} />
        ))}
      </div>
    </DndProvider>
  )
}
