'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error'
}

export function Toast({ toast }: { toast: ToastMessage }) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg animate-slide-up',
        toast.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      )}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="text-sm font-medium text-dark-900">{toast.message}</p>
    </div>
  )
}