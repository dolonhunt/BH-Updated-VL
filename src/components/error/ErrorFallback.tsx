import { AlertTriangle } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  title?: string
}

export function ErrorFallback({ error, resetError, title }: ErrorFallbackProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-bg-slate p-6">
      <div className="max-w-md w-full bg-dark-navy rounded-xl p-8 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">
          {title || 'Something went wrong'}
        </h2>
        <p className="text-sm text-gray-400 mb-6 break-words">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetError}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
