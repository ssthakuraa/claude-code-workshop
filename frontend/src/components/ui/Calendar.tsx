import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export type CalendarView = 'month' | 'week' | 'day'

export interface CalendarEvent {
  id: string | number
  title: string
  start: Date
  end?: Date
  color?: string
  allDay?: boolean
  data?: unknown
}

export interface CalendarProps {
  events?: CalendarEvent[]
  view?: CalendarView
  onViewChange?: (view: CalendarView) => void
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  renderEvent?: (event: CalendarEvent) => ReactNode
  className?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({ events = [], view: controlledView, onViewChange, onEventClick, onDateClick, renderEvent, className }: CalendarProps) {
  const today = new Date()
  const [internalView, setInternalView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const view = controlledView ?? internalView
  function setView(v: CalendarView) { setInternalView(v); onViewChange?.(v) }

  // ── Month navigation ──
  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }
  function goToday() { setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)) }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build grid cells (6 weeks × 7 days)
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsOnDay(date: Date) {
    return events.filter(e => isSameDay(e.start, date))
  }

  // ── Week view helpers ──
  const weekStart = (() => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay())
    return d
  })()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  return (
    <div className={cn('flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <button type="button" onClick={goToday} className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 hover:bg-neutral-50">Today</button>
          <button type="button" onClick={prevMonth} className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"><ChevronLeft size={16} /></button>
          <button type="button" onClick={nextMonth} className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"><ChevronRight size={16} /></button>
          <span className="text-sm font-semibold text-neutral-900">{MONTHS[month]} {year}</span>
        </div>
        <div className="flex items-center gap-1">
          {(['month', 'week', 'day'] as CalendarView[]).map(v => (
            <button key={v} type="button" onClick={() => setView(v)}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors', view === v ? 'bg-primary-600 text-white' : 'hover:bg-neutral-100 text-neutral-600')}
            >{v}</button>
          ))}
        </div>
      </div>

      {/* Month view */}
      {view === 'month' && (
        <div className="flex-1">
          <div className="grid grid-cols-7 border-b border-neutral-100">
            {DAYS.map(d => (
              <div key={d} className="text-xs font-semibold text-neutral-400 text-center py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, idx) => {
              const dayEvents = date ? eventsOnDay(date) : []
              const isToday = date ? isSameDay(date, today) : false
              return (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[96px] border-b border-r border-neutral-100 p-1.5 last:border-r-0',
                    date && 'cursor-pointer hover:bg-neutral-50 transition-colors',
                    !date && 'bg-neutral-50',
                  )}
                  onClick={() => date && onDateClick?.(date)}
                >
                  {date && (
                    <>
                      <span className={cn(
                        'inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-medium',
                        isToday ? 'bg-primary-600 text-white' : 'text-neutral-700',
                      )}>
                        {date.getDate()}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 3).map(ev => (
                          <div
                            key={ev.id}
                            onClick={e => { e.stopPropagation(); onEventClick?.(ev) }}
                            className="truncate rounded px-1 py-0.5 text-xs font-medium text-white cursor-pointer"
                            style={{ backgroundColor: ev.color ?? '#2563eb' }}
                          >
                            {renderEvent ? renderEvent(ev) : ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-neutral-400 pl-1">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week view */}
      {view === 'week' && (
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[600px]">
            {weekDays.map((d, i) => {
              const dayEvents = eventsOnDay(d)
              const isToday = isSameDay(d, today)
              return (
                <div key={i} className="border-r border-neutral-100 last:border-r-0">
                  <div className={cn('text-center py-2 border-b border-neutral-100', isToday && 'bg-primary-50')}>
                    <div className="text-xs text-neutral-400">{DAYS[d.getDay()]}</div>
                    <div className={cn('text-sm font-semibold', isToday ? 'text-primary-600' : 'text-neutral-900')}>{d.getDate()}</div>
                  </div>
                  <div className="min-h-[200px] p-1.5 space-y-0.5">
                    {dayEvents.map(ev => (
                      <div key={ev.id} onClick={() => onEventClick?.(ev)}
                        className="rounded px-1.5 py-1 text-xs font-medium text-white cursor-pointer truncate"
                        style={{ backgroundColor: ev.color ?? '#2563eb' }}
                      >
                        {renderEvent ? renderEvent(ev) : ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Day view */}
      {view === 'day' && (
        <div className="flex-1 p-4">
          <div className="text-sm font-semibold text-neutral-900 mb-3">
            {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          {eventsOnDay(currentDate).length === 0 ? (
            <p className="text-sm text-neutral-400">No events</p>
          ) : (
            <div className="space-y-2">
              {eventsOnDay(currentDate).map(ev => (
                <div key={ev.id} onClick={() => onEventClick?.(ev)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer text-white"
                  style={{ backgroundColor: ev.color ?? '#2563eb' }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ev.title}</p>
                    {ev.start && <p className="text-xs opacity-80">{ev.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
