import { useNavigate } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <ShieldX size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-sm text-neutral-500 mb-6">You don't have permission to access this page.</p>
        <button onClick={() => navigate('/hr/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
