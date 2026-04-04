import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-neutral-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-neutral-500 mb-6">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/hr/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
