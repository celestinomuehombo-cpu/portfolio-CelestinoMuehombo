import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Mail, Phone } from 'lucide-react'

interface ContactData {
  id?: string
  email: string
  linkedin_url: string | null
  github_url: string | null
  whatsapp: string | null
}

const DEFAULT: ContactData = {
  email: 'celestinomuehombo@gmail.com',
  linkedin_url: 'https://www.linkedin.com/in/celestino-muehombo-536434292/',
  github_url: 'https://github.com/celestinomuehombo-cpu',
  whatsapp: null,
}

export default function ContactPanel() {
  const [data, setData] = useState<ContactData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data: d }) => {
        if (d) setData(d)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    if (data.id) {
      await supabase.from('contact').update(data).eq('id', data.id)
    } else {
      const { data: inserted } = await supabase
        .from('contact').insert(data).select().single()
      if (inserted) setData(inserted)
    }
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputClass = `w-full px-4 py-3 rounded-xl
    bg-surface-light dark:bg-surface-dark
    border border-border-light dark:border-border-dark
    text-sm text-text-light dark:text-text-dark
    placeholder:text-muted
    focus:outline-none focus:border-orange-500
    transition-colors duration-200`

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500
        border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl
          text-text-light dark:text-text-dark mb-1">
          Contact
        </h2>
        <p className="text-sm text-muted">
          Gérez vos coordonnées et réseaux sociaux
        </p>
      </div>

      <div className="space-y-4">

        {/* Email */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="flex items-center gap-2 text-xs uppercase
            tracking-wider text-muted font-semibold mb-2">
            <Mail size={14} className="text-orange-500" />
            Email
          </label>
          <input type="email"
            value={data.email}
            onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="votre@email.com"
            className={inputClass} />
        </div>

        {/* LinkedIn */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="flex items-center gap-2 text-xs uppercase
            tracking-wider text-muted font-semibold mb-2">
            <i className="fab fa-linkedin-in text-blue-700 dark:text-blue-400" />
            LinkedIn
          </label>
          <input type="url"
            value={data.linkedin_url ?? ''}
            onChange={e => setData(prev => ({
              ...prev, linkedin_url: e.target.value || null
            }))}
            placeholder="https://linkedin.com/in/..."
            className={inputClass} />
        </div>

        {/* GitHub */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="flex items-center gap-2 text-xs uppercase
            tracking-wider text-muted font-semibold mb-2">
            <i className="fab fa-github text-text-light dark:text-text-dark" />
            GitHub
          </label>
          <input type="url"
            value={data.github_url ?? ''}
            onChange={e => setData(prev => ({
              ...prev, github_url: e.target.value || null
            }))}
            placeholder="https://github.com/..."
            className={inputClass} />
        </div>

        {/* WhatsApp */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="flex items-center gap-2 text-xs uppercase
            tracking-wider text-muted font-semibold mb-2">
            <Phone size={14} className="text-green-500" />
            WhatsApp
          </label>
          <input type="tel"
            value={data.whatsapp ?? ''}
            onChange={e => setData(prev => ({
              ...prev, whatsapp: e.target.value || null
            }))}
            placeholder="+33 6 XX XX XX XX"
            className={inputClass} />
          <p className="text-xs text-muted mt-2">
            Optionnel — apparaît dans la section contact
          </p>
        </div>

        {/* Preview */}
        <div className="bg-surface-light dark:bg-surface-dark
          border border-border-light dark:border-border-dark
          rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted
            font-semibold mb-3">
            Aperçu
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-orange-500" />
              <span className="text-text-light dark:text-text-dark">
                {data.email}
              </span>
            </div>
            {data.linkedin_url && (
              <div className="flex items-center gap-2 text-sm">
                <i className="fab fa-linkedin-in text-blue-700 dark:text-blue-400" />
                <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline truncate">
                  {data.linkedin_url}
                </a>
              </div>
            )}
            {data.github_url && (
              <div className="flex items-center gap-2 text-sm">
                <i className="fab fa-github text-text-light dark:text-text-dark" />
                <a href={data.github_url} target="_blank" rel="noopener noreferrer"
                  className="text-text-light dark:text-text-dark hover:underline truncate">
                  {data.github_url}
                </a>
              </div>
            )}
            {data.whatsapp && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-green-500" />
                <span className="text-text-light dark:text-text-dark">
                  {data.whatsapp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
              bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm
              transition-all duration-200 disabled:opacity-50
              shadow-lg shadow-orange-500/25 hover:-translate-y-0.5">
            <Save size={16} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {success && (
            <span className="text-sm text-green-500 font-medium">
              ✓ Enregistré avec succès
            </span>
          )}
        </div>
      </div>
    </div>
  )
}