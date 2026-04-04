import axios, { type AxiosInstance, type AxiosError } from 'axios'

class HrApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/app/hr/api/v1',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('hr_access_token')
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('hr_refresh_token')
          if (refreshToken && error.config?.url !== '/auth/refresh') {
            try {
              const res = await this.client.post('/auth/refresh', null, {
                headers: { 'X-Refresh-Token': refreshToken },
              }) as any
              const newToken = res.data?.token
              if (newToken) {
                localStorage.setItem('hr_access_token', newToken)
                error.config!.headers!['Authorization'] = `Bearer ${newToken}`
                return this.client.request(error.config!)
              }
            } catch {
              localStorage.removeItem('hr_access_token')
              localStorage.removeItem('hr_refresh_token')
              window.location.href = '/hr/login'
            }
          } else {
            localStorage.removeItem('hr_access_token')
            localStorage.removeItem('hr_refresh_token')
            window.location.href = '/hr/login'
          }
        }
        const data = (error.response?.data as any)
        throw {
          status: error.response?.status,
          message: data?.error || data?.message || 'An error occurred',
          errorCode: data?.errorCode,
          fieldErrors: data?.fieldErrors,
        }
      }
    )
  }

  get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.client.get(url, { params }) as Promise<T>
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data) as Promise<T>
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data) as Promise<T>
  }

  patch<T>(url: string, data?: any): Promise<T> {
    return this.client.patch(url, data) as Promise<T>
  }

  delete<T>(url: string): Promise<T> {
    return this.client.delete(url) as Promise<T>
  }
}

export const hrApi = new HrApiClient()
