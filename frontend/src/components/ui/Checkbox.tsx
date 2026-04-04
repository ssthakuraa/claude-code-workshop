import { cn } from '@/utils/cn'
import { Check, Minus } from 'lucide-react'
import React, { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, disabled, indeterminate, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const innerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? innerRef.current
      if (el) el.indeterminate = !!indeterminate
    }, [indeterminate, ref])

    return (
      <div className={cn('flex items-start gap-2.5', className)}>
        <div className="relative flex items-center mt-0.5">
          <input
            ref={ref ?? innerRef}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
              'peer-checked:bg-primary-500 peer-checked:border-primary-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              error ? 'border-error-500' : 'border-neutral-300',
            )}
          >
            {indeterminate ? <Minus size={10} className="text-white" /> : <Check size={10} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />}
          </div>
        </div>
        {(label || description) && (
          <label htmlFor={inputId} className={cn('flex flex-col', disabled && 'opacity-50 cursor-not-allowed')}>
            {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
            {description && <span className="text-xs text-neutral-500">{description}</span>}
          </label>
        )}
        {error && <p className="text-xs text-error-500 mt-0.5">{error}</p>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'


export interface RadioGroupProps {
  label?: string
  options: { value: string; label: string; description?: string }[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export function RadioGroup({ label, options, value, onChange, error, disabled, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      {label && <legend className="text-sm font-medium text-neutral-700 mb-1">{label}</legend>}
      <div className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map(opt => (
          <label key={opt.value} className={cn('flex items-start gap-2.5 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className={cn(
              'w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
              'peer-checked:border-primary-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1',
              value === opt.value ? 'border-primary-500' : 'border-neutral-300',
            )}>
              {value === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-700">{opt.label}</span>
              {opt.description && <span className="text-xs text-neutral-500">{opt.description}</span>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-error-500">{error}</p>}
    </fieldset>
  )
}


export interface ToggleProps {
  label?: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Toggle({ label, description, checked = false, onChange, disabled, size = 'md' }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
          size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
          checked ? 'bg-primary-500' : 'bg-neutral-300',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transition-transform duration-200',
            size === 'sm' ? 'h-3.5 w-3.5 mt-0.75 mx-0.75' : 'h-4.5 w-4.5 m-0.75',
            size === 'sm'
              ? checked ? 'translate-x-4' : 'translate-x-0'
              : checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          {description && <span className="text-xs text-neutral-500">{description}</span>}
        </div>
      )}
    </label>
  )
}
