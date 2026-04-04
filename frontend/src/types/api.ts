export interface HrApiResponse<T> {
  timestamp: string
  status: number
  data: T
  message?: string
  error?: string
  errorCode?: string
  fieldErrors?: Record<string, string>
}

export interface HrPagedResponse<T> {
  timestamp: string
  status: number
  data: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}
