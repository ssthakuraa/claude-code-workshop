import { cn } from '@/utils/cn'
import { File, Image, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file?: File
}

export interface FileUploadProps {
  value?: UploadedFile[]
  onChange?: (files: UploadedFile[]) => void
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({ value = [], onChange, accept, multiple = true, maxSizeMb = 10, label, hint, error, disabled, className }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function processFiles(files: FileList | null) {
    if (!files) return
    const maxBytes = maxSizeMb * 1024 * 1024
    const newFiles: UploadedFile[] = []
    for (const f of Array.from(files)) {
      if (f.size > maxBytes) continue
      newFiles.push({ id: `${Date.now()}-${f.name}`, name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), file: f })
    }
    onChange?.(multiple ? [...value, ...newFiles] : newFiles)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (!disabled) processFiles(e.dataTransfer.files)
  }

  function remove(id: string) {
    onChange?.(value.filter(f => f.id !== id))
  }

  const isImage = (type: string) => type.startsWith('image/')

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors',
          dragging ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error-400',
        )}
      >
        <Upload size={24} className="text-neutral-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-700">Drop files here or <span className="text-primary-600">browse</span></p>
          <p className="text-xs text-neutral-400 mt-0.5">{hint ?? `Max ${maxSizeMb} MB per file`}</p>
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} disabled={disabled} className="sr-only" onChange={e => processFiles(e.target.files)} />
      </div>

      {value.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {value.map(f => (
            <li key={f.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2">
              {isImage(f.type) && f.url ? (
                <img src={f.url} alt={f.name} className="w-10 h-10 rounded object-cover shrink-0" />
              ) : isImage(f.type) ? (
                <Image size={20} className="text-neutral-400 shrink-0" />
              ) : (
                <File size={20} className="text-neutral-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{f.name}</p>
                <p className="text-xs text-neutral-400">{formatBytes(f.size)}</p>
              </div>
              <button type="button" onClick={() => remove(f.id)} className="p-1 rounded text-neutral-400 hover:text-error-600 hover:bg-error-50 transition-colors">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-error-600">{error}</p>}
    </div>
  )
}
