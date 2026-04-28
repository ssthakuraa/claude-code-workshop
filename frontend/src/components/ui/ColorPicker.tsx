import { cn } from '@/utils/cn'
import { useState, useCallback, type ChangeEvent } from 'react'

const DEFAULT_PRESETS = [
  '#3792FF', '#4CAF50', '#FF9800', '#F44336',
  '#9C27B0', '#00BCD4', '#FF5722', '#607D8B',
  '#E91E63', '#795548', '#212121', '#FFFFFF',
]

export interface ColorPickerProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  presets?: string[]
  disabled?: boolean
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

export function ColorPicker({ label, value = '#3792FF', onChange, presets = DEFAULT_PRESETS, disabled }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value)

  const handlePresetClick = useCallback((color: string) => {
    if (disabled) return
    setHexInput(color)
    onChange?.(color)
  }, [disabled, onChange])

  const handleHexChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setHexInput(raw)
    if (isValidHex(raw)) {
      onChange?.(raw)
    }
  }, [onChange])

  const handleHexBlur = useCallback(() => {
    if (!isValidHex(hexInput)) {
      setHexInput(value)
    }
  }, [hexInput, value])

  const currentColor = isValidHex(value) ? value : '#3792FF'

  return (
    <div className={cn('flex flex-col gap-2', disabled && 'opacity-50 pointer-events-none')}>
      {label && (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      )}
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => handlePresetClick(color)}
            className={cn(
              'w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              color === currentColor ? 'border-primary-500 scale-110' : 'border-transparent',
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-md border border-neutral-300 shrink-0"
          style={{ backgroundColor: currentColor }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          maxLength={7}
          placeholder="#000000"
          className={cn(
            'w-32 rounded-md border bg-white text-sm text-neutral-900 placeholder:text-neutral-400',
            'px-3 py-2 h-10 font-mono uppercase transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            isValidHex(hexInput)
              ? 'border-neutral-300 hover:border-neutral-400'
              : 'border-error-500',
          )}
        />
        <input
          type="color"
          value={currentColor}
          onChange={(e) => handlePresetClick(e.target.value.toUpperCase())}
          className="w-10 h-10 rounded-md border border-neutral-300 cursor-pointer p-0.5 bg-white"
          title="Open color picker"
        />
      </div>
    </div>
  )
}
