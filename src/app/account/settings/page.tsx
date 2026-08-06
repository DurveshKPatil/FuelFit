'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/Toaster'
import { User } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [name, setName] = useState(session?.user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await update({ name })
      toast('Profile updated successfully', 'success')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <User className="h-5 w-5 text-primary-600" />
          Profile
        </h2>
        <form onSubmit={handleSubmit} className="card max-w-lg space-y-4 p-6">
          <div>
            <label className="label">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              value={session?.user?.email || ''}
              disabled
              className="input cursor-not-allowed bg-dark-50"
            />
            <p className="mt-1 text-xs text-dark-400">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">Security</h2>
        <div className="card max-w-lg p-6">
          <p className="text-sm text-dark-500">
            Password management is handled securely. Contact support if you need help
            with your account security.
          </p>
        </div>
      </section>
    </div>
  )
}