import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Plus, Trash2, Upload, X } from 'lucide-react'

interface Project {
  id?: string
  title: string
  description: string
  tech: string[]
  github_url: string | null
  demo_url: string | null
  image_url: string | null
  status: 'done' | 'wip'
  display_order: number
  category?: string
  highlight?: boolean
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newTech, setNewTech] = useState<Record<number, string>>({})

  useEffect(() => {
    supabase.from('projects').select('*').order('display_order')
      .then(({ data }) => {
        if (data) setProjects(data)
        setLoading(false)
      })
  }, [])

  const showSuccess = (id: string) => {
    setSuccess(id)
    setTimeout(() => setSuccess(null), 3000)
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `projects/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('projects')
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('projects').getPublicUrl(path)
    return data.publicUrl
  }

  const updateProject = (index: number, field: keyof Project, value: unknown) => {
    setProjects(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  const saveProject = async (proj: Project, index: number) => {
    setSaving(proj.id ?? 'new')
    const payload = { ...proj }
    if (proj.id) {
      await supabase.from('projects').update(payload).eq('id', proj.id)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select().single()
      if (data) setProjects(prev => prev.map((p, i) => i === index ? data : p))
    }
    setSaving(null)
    showSuccess(proj.id ?? `new-${index}`)
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const addProject = () => {
    setProjects(prev => [...prev, {
      title: '', description: '', tech: [],
      github_url: null, demo_url: null, image_url: null,
      status: 'done', display_order: prev.length,
      category: 'Réseaux', highlight: false
    }])
  }

  const addTech = (index: number) => {
    const tech = newTech[index]?.trim()
    if (!tech) return
    updateProject(index, 'tech', [...(projects[index].tech ?? []), tech])
    setNewTech(prev => ({ ...prev, [index]: '' }))
  }

  const removeTech = (index: number, techIndex: number) => {
    updateProject(index, 'tech',
      projects[index].tech.filter((_, i) => i !== techIndex))
  }

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
          Projets
        </h2>
        <p className="text-sm text-muted">
          Gérez vos projets — Tangisa et projets académiques
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((proj, index) => (
          <div key={proj.id ?? index}
            className="bg-white dark:bg-surface2
              border border-border-light dark:border-border-dark
              rounded-2xl p-5">

            {/* Image upload */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark flex-shrink-0">
                {proj.image_url ? (
                  <img src={proj.image_url} alt="projet"
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload size={16} className="text-muted" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*"
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = await uploadImage(file)
                    if (url) updateProject(index, 'image_url', url)
                  }}
                  className="w-full text-xs text-muted
                    file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                    file:border-0 file:text-xs file:font-medium
                    file:bg-orange-500/10 file:text-orange-500
                    hover:file:bg-orange-500/20 cursor-pointer" />
                <p className="text-xs text-muted mt-1">Image du projet</p>
              </div>
            </div>

            {/* Titre + statut */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted block mb-1">Titre</label>
                <input type="text" value={proj.title}
                  onChange={e => updateProject(index, 'title', e.target.value)}
                  placeholder="Nom du projet"
                  className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Statut</label>
                <select value={proj.status}
                  onChange={e => updateProject(index, 'status', e.target.value)}
                  className={inputClass}>
                  <option value="done">Réalisé</option>
                  <option value="wip">En cours</option>
                </select>
              </div>
            </div>

            {/* Catégorie + highlight */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted block mb-1">Catégorie</label>
                <select value={proj.category ?? 'Réseaux'}
                  onChange={e => updateProject(index, 'category', e.target.value)}
                  className={inputClass}>
                  <option value="Entrepreneuriat">Entrepreneuriat</option>
                  <option value="Réseaux">Réseaux</option>
                  <option value="Web">Web</option>
                  <option value="Programmation">Programmation</option>
                  <option value="Automatisation">Automatisation</option>
                  <option value="Cybersécurité">Cybersécurité</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={proj.highlight ?? false}
                    onChange={e => updateProject(index, 'highlight', e.target.checked)}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-text-light dark:text-text-dark">
                    Projet mis en avant
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-xs text-muted block mb-1">Description</label>
              <textarea rows={3} value={proj.description}
                onChange={e => updateProject(index, 'description', e.target.value)}
                placeholder="Décrivez le projet..."
                className={`${inputClass} resize-none`} />
            </div>

            {/* Tech tags */}
            <div className="mb-3">
              <label className="text-xs text-muted block mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(proj.tech ?? []).map((t, ti) => (
                  <span key={ti} className="flex items-center gap-1.5
                    px-3 py-1 rounded-full text-xs font-medium
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-text-light dark:text-text-dark">
                    {t}
                    <button onClick={() => removeTech(index, ti)}
                      className="text-muted hover:text-red-500 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text"
                  value={newTech[index] ?? ''}
                  onChange={e => setNewTech(prev => ({ ...prev, [index]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addTech(index)}
                  placeholder="Ex: React, Python..."
                  className={`flex-1 ${inputClass}`} />
                <button onClick={() => addTech(index)}
                  className="px-3 py-2 rounded-xl bg-orange-500/10
                    text-orange-500 hover:bg-orange-500/20
                    transition-colors duration-200">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-muted block mb-1">GitHub URL</label>
                <input type="url"
                  value={proj.github_url ?? ''}
                  onChange={e => updateProject(index, 'github_url', e.target.value || null)}
                  placeholder="https://github.com/..."
                  className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Demo URL</label>
                <input type="url"
                  value={proj.demo_url ?? ''}
                  onChange={e => updateProject(index, 'demo_url', e.target.value || null)}
                  placeholder="https://..."
                  className={inputClass} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={() => saveProject(proj, index)}
                disabled={saving === (proj.id ?? `new-${index}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                  transition-all duration-200 disabled:opacity-50">
                <Save size={14} />
                {saving === (proj.id ?? `new-${index}`) ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <div className="flex items-center gap-3">
                {success === (proj.id ?? `new-${index}`) && (
                  <span className="text-xs text-green-500">✓ Enregistré</span>
                )}
                {proj.id && (
                  <button onClick={() => deleteProject(proj.id!)}
                    className="p-2 rounded-xl text-muted hover:text-red-500
                      hover:bg-red-500/10 transition-all duration-200">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button onClick={addProject}
          className="w-full flex items-center justify-center gap-2
            py-4 rounded-2xl border-2 border-dashed
            border-border-light dark:border-border-dark
            text-muted hover:text-orange-500 hover:border-orange-500/40
            text-sm font-medium transition-all duration-200">
          <Plus size={16} />
          Ajouter un projet
        </button>
      </div>
    </div>
  )
}