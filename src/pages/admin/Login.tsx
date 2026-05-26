import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark
      flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="font-head font-black text-2xl tracking-tight
            text-text-light dark:text-text-dark">
            C<span className="text-orange-500">.</span>MUEHOMBO
          </a>
          <p className="text-sm text-muted mt-2">Panneau d'administration</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark
          rounded-2xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10
              flex items-center justify-center">
              <Lock size={18} className="text-orange-500" />
            </div>
            <div>
              <h1 className="font-head font-bold text-lg
                text-text-light dark:text-text-dark">
                Connexion
              </h1>
              <p className="text-xs text-muted">Accès réservé</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10
              border border-red-500/20 text-sm text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-wider
                text-muted font-semibold block mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2
                  -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-sm text-text-light dark:text-text-dark
                    placeholder:text-muted
                    focus:outline-none focus:border-orange-500
                    transition-colors duration-200" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs uppercase tracking-wider
                text-muted font-semibold block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2
                  -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-sm text-text-light dark:text-text-dark
                    placeholder:text-muted
                    focus:outline-none focus:border-orange-500
                    transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-muted hover:text-text-light dark:hover:text-text-dark
                    transition-colors duration-200">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500
                hover:bg-orange-600 text-white font-medium text-sm
                transition-all duration-200 disabled:opacity-50
                disabled:cursor-not-allowed
                shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                hover:-translate-y-0.5 mt-2">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          <a href="/" className="hover:text-orange-500 transition-colors duration-200">
            ← Retour au portfolio
          </a>
        </p>
      </div>
    </div>
  )
}