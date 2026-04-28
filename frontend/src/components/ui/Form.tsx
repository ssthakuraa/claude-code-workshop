/**
 * react-hook-form convenience wrappers.
 * Provides FormField (label + error) and field-level components
 * that wire into RHF context automatically.
 */
import { cn } from '@/utils/cn'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form'
import type { ReactNode } from 'react'
import { Input, type InputProps } from './Input'
import { Select, type SelectProps } from './Select'
import { Textarea, type TextareaProps } from './Textarea'
import { Checkbox, type CheckboxProps } from './Checkbox'

// ─── FormField wrapper ────────────────────────────────────────────────────────

export interface FormFieldProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}{required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-error-600">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}

// ─── Controlled field helpers ────────────────────────────────────────────────

type OmitValueOnChange<T> = Omit<T, 'value' | 'onChange' | 'error'>

export interface RHFInputProps<T extends FieldValues> extends OmitValueOnChange<InputProps> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
}

export function RHFInput<T extends FieldValues>({ control, name, rules, ...rest }: RHFInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Input {...rest} {...field} error={fieldState.error?.message} />
      )}
    />
  )
}

export interface RHFSelectProps<T extends FieldValues> extends OmitValueOnChange<SelectProps> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
}

export function RHFSelect<T extends FieldValues>({ control, name, rules, ...rest }: RHFSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Select {...rest} value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
      )}
    />
  )
}

export interface RHFTextareaProps<T extends FieldValues> extends OmitValueOnChange<TextareaProps> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
}

export function RHFTextarea<T extends FieldValues>({ control, name, rules, ...rest }: RHFTextareaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Textarea {...rest} {...field} error={fieldState.error?.message} />
      )}
    />
  )
}

export interface RHFCheckboxProps<T extends FieldValues> extends OmitValueOnChange<CheckboxProps> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
}

export function RHFCheckbox<T extends FieldValues>({ control, name, rules, ...rest }: RHFCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Checkbox {...rest} checked={field.value} onChange={e => field.onChange(e.target.checked)} error={fieldState.error?.message} />
      )}
    />
  )
}
