import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  suggestions?: string[]
  max?: number
  className?: string
}

export function TagInput({ value = [], onChange, placeholder = 'Add tag…', label, error, hint, required, disabled, suggestions = [], max, className }: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s),
  )

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || value.includes(trimmed)) { setInput(''); return }
    if (max && value.length >= max) return
    onChange?.([...value, trimmed])
    setInput('')
    setShowSuggestions(false)
  }

  function removeTag(tag: string) {
    onChange?.(value.filter(t => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && !input && value.length > 0) removeTag(value[value.length - 1])
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}{required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div
        className={cn(
          'flex flex-wrap gap-1.5 px-2.5 py-2 rounded-lg border bg-white min-h-[42px] cursor-text',
          'focus-within:ring-2 focus-within:ring-primary-500',
          error ? 'border-error-500' : 'border-neutral-300',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {tag}
            {!disabled && (
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary-600">
                <X size={11} />
              </button>
            )}
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true) }}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (input) addTag(input); setTimeout(() => setShowSuggestions(false), 150) }}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled || (!!max && value.length >= max)}
            className="w-full text-sm bg-transparent outline-none placeholder:text-neutral-400"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 min-w-[160px] max-h-40 overflow-y-auto">
              {filteredSuggestions.map(s => (
                <button key={s} type="button" className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-50 text-neutral-700" onMouseDown={() => addTag(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-error-600">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}
