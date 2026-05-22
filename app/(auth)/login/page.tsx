'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#D85A30] flex items-center justify-center text-white font-bold text-lg">S</div>
          <span className="text-xl font-bold"><span className="text-[#2C2C2A]">Spice</span> <span className="text-[#D85A30]">Garden</span></span>
        </div>

        <h1 className="text-2xl font-bold text-[#2C2C2A] mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@spicegarden.pk"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/40 focus:border-[#D85A30]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D85A30] text-white font-semibold py-2.5 rounded-lg hover:bg-[#c24e27] transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-600 mb-2">Demo credentials:</p>
          <p>Admin: <span className="font-mono">admin@spicegarden.pk</span></p>
          <p>Staff: <span className="font-mono">staff@spicegarden.pk</span></p>
          <p>Password: <span className="font-mono">SpiceGarden2024!</span></p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/" className="text-[#D85A30] hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
