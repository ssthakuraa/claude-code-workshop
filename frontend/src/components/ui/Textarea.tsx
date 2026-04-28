import { cn } from '@/utils/cn'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  showCount?: boolean
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, showCount, maxLength, className, id, value, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <div className="flex justify-between items-center">
            <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
              {label}
              {required && <span className="ml-0.5 text-error-500">*</span>}
            </label>
            {showCount && maxLength && (
              <span className={cn('text-xs', charCount > maxLength * 0.9 ? 'text-warning-500' : 'text-neutral-400')}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-md border bg-white text-sm text-neutral-900 placeholder:text-neutral-400',
            'px-3 py-2 transition-colors resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-neutral-300 hover:border-neutral-400',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error-500">{error}</p>}
        {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
