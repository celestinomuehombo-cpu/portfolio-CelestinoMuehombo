import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Upload, X, ChevronDown, ChevronUp } from 'lucide-react'

type Domain = 'administrer' | 'connecter' | 'programmer' | 'securiser' | 'surveiller'

const DOMAINS: { id: Domain; label: string; icon: string }[] = [
  { id: 'administrer', label: 'Administrer', icon: '⚙️' },
  { id: 'connecter', label: 'Connecter', icon: '🔗' },
  { id: 'programmer', label: 'Programmer', icon: '💻' },
  { id: 'securiser', label: 'Sécuriser', icon: '🛡️' },
  { id: 'surveiller', label: 'Surveiller', icon: '📡' },
]

interface Skill {
  id: string
  domain: string
  code: string
  title: string
  description: string
  project_title: string | null
  project_description: string | null
  project_status: 'done' | 'wip' | 'pending'
  project_achievements: string[]
  project_tech: string[]
  personal_note: string | null
  difficulties: string | null
  why_i_did_it: string | null
  how_i_did_it: string | null
  what_i_learned: string | null
  what_i_would_change: string | null
  images: string[]
  display_order: number
}

export default function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeDomain, setActiveDomain] = useState<Domain>('administrer')
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('skills').select('*').order('display_order')
      .then(({ data }) => {
        if (data) setSkills(data)
        setLoading(false)
      })
  }, [])

  const domainSkills = skills.filter(s => s.domain === activeDomain)

  const updateSkill = (id: string, field: keyof Skill, value: unknown) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveSkill = async (skill: Skill) => {
    setSaving(skill.id)
    await supabase.from('skills').update({
      personal_note: skill.personal_note,
      difficulties: skill.difficulties,
      why_i_did_it: skill.why_i_did_it,
      how_i_did_it: skill.how_i_did_it,
      what_i_learned: skill.what_i_learned,
      what_i_would_change: skill.what_i_would_change,
      project_title: skill.project_title,
      project_description: skill.project_description,
      project_status: skill.project_status,
      images: skill.images,
    }).eq('id', skill.id)
    setSaving(null)
    setSuccess(skill.id)
    setTimeout(() => setSuccess(null), 3000)
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `skills/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('projects')
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('projects').getPublicUrl(path)
    return data.publicUrl
  }

  const textareaClass = `w-full px-4 py-3 rounded-xl resize-none
    bg-surface-light dark:bg-surface-dark
    border border-border-light dark:border-border-dark
    text-sm text-text-light dark:text-text-dark
    placeholder:text-muted
    focus:outline-none focus:border-orange-500
    transition-colors duration-200`

  const inputClass = `w-full px-4 py-2.5 rounded-xl
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
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl
          text-text-light dark:text-text-dark mb-1">
          Compétences
        </h2>
        <p className="text-sm text-muted">
          Ajoutez votre démarche réflexive et vos screenshots par AC
        </p>
      </div>

      {/* Domain tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DOMAINS.map(domain => (
          <button key={domain.id}
            onClick={() => setActiveDomain(domain.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full
              text-sm font-medium transition-all duration-200
              ${activeDomain === domain.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white dark:bg-surface2 border border-border-light dark:border-border-dark text-muted hover:text-text-light dark:hover:text-text-dark'
              }`}>
            <span>{domain.icon}</span>
            {domain.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${activeDomain === domain.id
                ? 'bg-white/20 text-white'
                : 'bg-surface-light dark:bg-surface-dark text-muted'
              }`}>
              {skills.filter(s => s.domain === domain.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Skills list */}
      <div className="space-y-3">
        {domainSkills.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            Aucune compétence trouvée pour ce domaine.
            Les compétences sont créées via la base de données.
          </div>
        )}

        {domainSkills.map(skill => (
          <div key={skill.id}
            className="bg-white dark:bg-surface2
              border border-border-light dark:border-border-dark
              rounded-2xl overflow-hidden">

            {/* Header */}
            <button
              onClick={() => setExpandedSkill(
                expandedSkill === skill.id ? null : skill.id
              )}
              className="w-full flex items-center justify-between p-5
                hover:bg-surface-light dark:hover:bg-surface-dark
                transition-colors duration-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg
                  bg-orange-500/10 text-orange-500">
                  {skill.code}
                </span>
                <span className="font-head font-bold text-base
                  text-text-light dark:text-text-dark">
                  {skill.title}
                </span>
                {(skill.personal_note || skill.difficulties) && (
                  <span className="w-2 h-2 rounded-full bg-green-500"
                    title="Contenu réflexif présent" />
                )}
                {(skill.images ?? []).length > 0 && (
                  <span className="text-xs text-muted">
                    {skill.images.length} photo(s)
                  </span>
                )}
              </div>
              {expandedSkill === skill.id
                ? <ChevronUp size={16} className="text-muted" />
                : <ChevronDown size={16} className="text-muted" />
              }
            </button>

            {/* Expanded content */}
            {expandedSkill === skill.id && (
              <div className="px-5 pb-5 border-t
                border-border-light dark:border-border-dark space-y-4 pt-4">

                {/* Projet info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1">
                      Titre du projet
                    </label>
                    <input type="text"
                      value={skill.project_title ?? ''}
                      onChange={e => updateSkill(skill.id, 'project_title', e.target.value)}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Statut</label>
                    <select value={skill.project_status}
                      onChange={e => updateSkill(skill.id, 'project_status', e.target.value)}
                      className={inputClass}>
                      <option value="done">Réalisé</option>
                      <option value="wip">En cours</option>
                      <option value="pending">À venir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">
                    Description du projet
                  </label>
                  <textarea rows={2}
                    value={skill.project_description ?? ''}
                    onChange={e => updateSkill(skill.id, 'project_description', e.target.value)}
                    className={textareaClass} />
                </div>

                {/* Démarche réflexive */}
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-widest text-orange-500
                    font-semibold mb-3 flex items-center gap-2">
                    Démarche réflexive
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'personal_note', label: 'Ce que j\'ai fait' },
                      { key: 'why_i_did_it', label: 'Pourquoi je l\'ai fait' },
                      { key: 'how_i_did_it', label: 'Comment je l\'ai fait' },
                      { key: 'difficulties', label: 'Mes difficultés' },
                      { key: 'what_i_learned', label: 'Ce que j\'en ai appris' },
                      { key: 'what_i_would_change', label: 'Ce que je ferais autrement' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-xs text-muted block mb-1">
                          {field.label}
                        </label>
                        <textarea rows={3}
                          value={(skill[field.key as keyof Skill] as string) ?? ''}
                          onChange={e => updateSkill(skill.id, field.key as keyof Skill, e.target.value)}
                          placeholder={`${field.label}...`}
                          className={textareaClass} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshots */}
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-widest text-orange-500
                    font-semibold mb-3 flex items-center gap-2">
                    Screenshots & traces
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>

                  {/* Images existantes */}
                  {(skill.images ?? []).length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {skill.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt={`screenshot ${i + 1}`}
                            className="w-full aspect-video object-cover rounded-xl
                              border border-border-light dark:border-border-dark" />
                          <button
                            onClick={() => updateSkill(skill.id, 'images',
                              skill.images.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 p-1 rounded-full
                              bg-red-500 text-white opacity-0 group-hover:opacity-100
                              transition-opacity duration-200">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload */}
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" multiple
                      onChange={async e => {
                        const files = Array.from(e.target.files ?? [])
                        const urls = await Promise.all(files.map(uploadImage))
                        const validUrls = urls.filter(Boolean) as string[]
                        updateSkill(skill.id, 'images',
                          [...(skill.images ?? []), ...validUrls])
                      }}
                      className="flex-1 text-xs text-muted
                        file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                        file:border-0 file:text-xs file:font-medium
                        file:bg-orange-500/10 file:text-orange-500
                        hover:file:bg-orange-500/20 cursor-pointer" />
                    <Upload size={14} className="text-muted flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted mt-1">
                    JPG, PNG — captures d'écran, schémas, configurations
                  </p>
                </div>

                {/* Save */}
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => saveSkill(skill)}
                    disabled={saving === skill.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                      bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                      transition-all duration-200 disabled:opacity-50">
                    <Save size={14} />
                    {saving === skill.id ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  {success === skill.id && (
                    <span className="text-xs text-green-500 font-medium">
                      ✓ Enregistré
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}