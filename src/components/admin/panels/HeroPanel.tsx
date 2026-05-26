import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, ExternalLink } from 'lucide-react'

interface HeroData {
  id?: string
  badge: string
  name: string
  tagline: string
  availability: string
  cv_url: string | null
}

const DEFAULT: HeroData = {
  badge: 'Disponible — Alternance Septembre 2026',
  name: 'Celestino MUEHOMBO',
  tagline: 'Soyez bien venu sur mon portfolio. Découvrez mon parcours, mes projets et ce que je peux apporter à votre équipe.',
  availability: 'Septembre 2026',
  cv_url: null,
}

export default function HeroPanel() {
  const [data, setData] = useState<HeroData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)

  useEffect(() => {
    supabase.from('hero_content').select('*').single()
      .then(({ data: d }) => {
        if (d) setData(d)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    let cv_url = data.cv_url

    if (cvFile) {
      const ext = cvFile.name.split('.').pop()
      const path = `cv/CV-Celestino.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, cvFile, { upsert: true })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(path)
        cv_url = urlData.publicUrl
      }
    }

    const payload = { ...data, cv_url }

    if (data.id) {
      await supabase.from('hero_content').update(payload).eq('id', data.id)
    } else {
      const { data: inserted } = await supabase
        .from('hero_content').insert(payload).select().single()
      if (inserted) setData(inserted)
    }

    setData(prev => ({ ...prev, cv_url }))
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

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
          Hero
        </h2>
        <p className="text-sm text-muted">
          Modifiez le contenu principal de votre page d'accueil
        </p>
      </div>

      <div className="space-y-5">

        {/* Badge */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            Badge de disponibilité
          </label>
          <input
            type="text"
            value={data.badge}
            onChange={e => setData(prev => ({ ...prev, badge: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              text-sm text-text-light dark:text-text-dark
              focus:outline-none focus:border-orange-500
              transition-colors duration-200" />
          <p className="text-xs text-muted mt-2">
            Aparece no topo do Hero com o ponto laranja pulsante
          </p>
        </div>

        {/* Nom */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              text-sm text-text-light dark:text-text-dark
              focus:outline-none focus:border-orange-500
              transition-colors duration-200" />
        </div>

        {/* Tagline */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            Tagline
          </label>
          <textarea
            rows={3}
            value={data.tagline}
            onChange={e => setData(prev => ({ ...prev, tagline: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl resize-none
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              text-sm text-text-light dark:text-text-dark
              focus:outline-none focus:border-orange-500
              transition-colors duration-200" />
          <p className="text-xs text-muted mt-2">
            Texte affiché sous votre nom dans le Hero
          </p>
        </div>

        {/* CV Upload */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            CV PDF
          </label>
          {data.cv_url && (
            <a href={data.cv_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-orange-500
                hover:text-orange-600 transition-colors duration-200 mb-3 block">
              <ExternalLink size={14} />
              CV actuel — voir le fichier
            </a>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={e => setCvFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted
              file:mr-4 file:py-2 file:px-4 file:rounded-xl
              file:border-0 file:text-sm file:font-medium
              file:bg-orange-500/10 file:text-orange-500
              hover:file:bg-orange-500/20 cursor-pointer" />
          <p className="text-xs text-muted mt-2">
            Fichier PDF — remplace le CV existant
          </p>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
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