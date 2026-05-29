import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Plus, Trash2, Upload, X, Image, Film, FileText, Eye, EyeOff } from 'lucide-react'

function toArr(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string' && val.length > 0) {
    if (val.startsWith('[')) {
      try { const p = JSON.parse(val); if (Array.isArray(p)) return p } catch { /* */ }
    }
    if (val.startsWith('{')) {
      return val.slice(1, -1).split(',').map(s => s.replace(/^"|"$/g, '').trim()).filter(Boolean)
    }
  }
  return []
}

function normalizeProject(p: Record<string, unknown>): Project {
  return {
    ...(p as Project),
    tech: toArr(p.tech),
    images: toArr(p.images),
    videos: toArr(p.videos),
    documents: toArr(p.documents),
    document_labels: toArr(p.document_labels),
    skill_codes: toArr(p.skill_codes),
  }
}

interface Project {
  id?: string
  title: string
  description: string
  tech: string[]
  github_url: string | null
  demo_url: string | null
  image_url: string | null
  images?: string[]
  videos?: string[]
  documents?: string[]
  document_labels?: string[]
  status: 'done' | 'wip'
  display_order: number
  category?: string
  highlight?: boolean
  skill_codes?: string[]
  visible?: boolean
}

const AC_CODES: { domain: string; codes: { code: string; title: string }[] }[] = [
  { domain: 'Administrer', codes: [
    { code: 'AC21.01', title: 'Routage dynamique' },
    { code: 'AC21.02', title: 'QoS & Sécurité' },
    { code: 'AC21.03', title: 'Virtualisation' },
    { code: 'AC21.04', title: 'Services réseaux' },
    { code: 'AC21.05', title: 'Architecture Internet' },
    { code: 'AC21.06', title: 'Travail en équipe' },
  ]},
  { domain: 'Connecter', codes: [
    { code: 'AC22.01', title: 'Transmissions complexes' },
    { code: 'AC22.02', title: 'Accès distant sécurisé' },
    { code: 'AC22.03', title: 'Connexion multi-site' },
    { code: 'AC22.04', title: 'Réseaux opérateurs' },
    { code: 'AC22.05', title: 'Cahier des charges' },
  ]},
  { domain: 'Programmer', codes: [
    { code: 'AC23.01', title: 'Scripts automatisation' },
    { code: 'AC23.02', title: 'Développement web' },
    { code: 'AC23.03', title: 'Application client/serveur' },
    { code: 'AC23.04', title: 'Gestion de données' },
    { code: 'AC23.05', title: 'Accès aux données' },
  ]},
  { domain: 'Sécuriser', codes: [
    { code: 'AC24.01', title: 'Bonnes pratiques' },
    { code: 'AC24.02', title: 'Sécurisation infra' },
    { code: 'AC24.03', title: 'Sécurisation services' },
    { code: 'AC24.04', title: 'Cryptographie' },
    { code: 'AC24.05', title: 'Types d\'attaques' },
    { code: 'AC24.06', title: 'Anglais technique' },
  ]},
  { domain: 'Surveiller', codes: [
    { code: 'AC25.01', title: 'Protections anti-malware' },
    { code: 'AC25.02', title: 'Tests de pénétration' },
  ]},
]

const DEFAULT_PROJECTS: Project[] = [
  {
    title: 'Tangisa',
    description: 'Plateforme marketplace éducative pour le marché angolais connectant élèves et tuteurs vérifiés. Système de vérification en 4 étapes, dashboard parental en temps réel, 2 plans d\'abonnement.',
    tech: ['React', 'TypeScript', 'Supabase', 'Flutterwave', 'Netlify'],
    github_url: null, demo_url: null, image_url: null,
    status: 'wip', display_order: 0, category: 'Entrepreneuriat', highlight: true,
  },
  {
    title: 'Portfolio Personnel',
    description: 'Ce portfolio — conçu et développé from scratch avec React, TypeScript et Tailwind. Système de gestion de contenu via Supabase avec panneau admin.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null,
    status: 'done', display_order: 1, category: 'Web', highlight: false,
  },
  {
    title: 'Infrastructure GRE/IPsec Multi-sites',
    description: 'Architecture réseau complète interconnectant deux sites via tunnel GRE encapsulé dans IPsec. Segmentation VLAN, pare-feux ASA, routage OSPF.',
    tech: ['Cisco IOS', 'GRE', 'IPsec', 'OSPF', 'Packet Tracer'],
    github_url: null, demo_url: null, image_url: null,
    status: 'done', display_order: 2, category: 'Réseaux', highlight: false,
  },
  {
    title: 'Chat TCP Client/Serveur',
    description: 'Application de messagerie en temps réel utilisant des sockets TCP. Serveur multi-clients avec threading, protocole applicatif JSON.',
    tech: ['Python 3', 'socket', 'threading', 'JSON'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null,
    status: 'done', display_order: 3, category: 'Programmation', highlight: false,
  },
  {
    title: 'Scripts Admin Réseau',
    description: 'Suite de scripts d\'automatisation pour backup des configs Cisco via SSH, monitoring de disponibilité avec alertes email et génération de rapports HTML.',
    tech: ['Python 3', 'Bash', 'Paramiko', 'Netmiko', 'cron'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null,
    status: 'done', display_order: 4, category: 'Automatisation', highlight: false,
  },
]

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usingDefaults, setUsingDefaults] = useState(false)
  const [newTech, setNewTech] = useState<Record<number, string>>({})
  const [newVideoUrl, setNewVideoUrl] = useState<Record<number, string>>({})
  const [newDocLabel, setNewDocLabel] = useState<Record<number, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    supabase.from('projects').select('*').order('display_order')
      .then(({ data, error: err }) => {
        if (err) {
          setError(`Erreur de chargement: ${err.message}`)
          setLoading(false)
          return
        }
        if (data && data.length > 0) {
          setProjects(data.map(p => normalizeProject(p as Record<string, unknown>)))
        } else {
          setProjects(DEFAULT_PROJECTS)
          setUsingDefaults(true)
        }
        setLoading(false)
      })
  }, [])

  const showSuccess = (idx: number) => {
    setSuccess(idx)
    setTimeout(() => setSuccess(null), 3000)
  }

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
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
    setSaving(index)
    setError(null)
    const payload = { ...proj }
    if (proj.id) {
      const { error: err } = await supabase.from('projects').update(payload).eq('id', proj.id)
      if (err) { setError(`Erreur: ${err.message}`); setSaving(null); return }
    } else {
      const { data, error: err } = await supabase.from('projects').insert(payload).select().single()
      if (err) { setError(`Erreur: ${err.message}`); setSaving(null); return }
      if (data) {
        setProjects(prev => prev.map((p, i) => i === index ? normalizeProject(data as Record<string, unknown>) : p))
        setUsingDefaults(false)
      }
    }
    setSaving(null)
    showSuccess(index)
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const removeUnsaved = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index))
  }

  const addProject = () => {
    setProjects(prev => [...prev, {
      title: '', description: '', tech: [],
      github_url: null, demo_url: null, image_url: null,
      images: [], videos: [], documents: [], document_labels: [],
      status: 'done', display_order: prev.length,
      category: 'Réseaux', highlight: false, skill_codes: []
    }])
  }

  const addTech = (index: number) => {
    const tech = newTech[index]?.trim()
    if (!tech) return
    updateProject(index, 'tech', [...toArr(projects[index].tech), tech])
    setNewTech(prev => ({ ...prev, [index]: '' }))
  }

  const removeTech = (index: number, techIndex: number) => {
    updateProject(index, 'tech',
      toArr(projects[index].tech).filter((_, i) => i !== techIndex))
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

      {usingDefaults && (
        <div className="mb-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-orange-500">
          Aucun projet en base de données — ces données sont des exemples. Enregistrez-les pour les activer sur le portfolio.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {projects.map((proj, index) => (
          <div key={proj.id ?? index}
            className={`bg-white dark:bg-surface2 rounded-2xl p-5 border transition-all
              ${proj.visible === false
                ? 'border-dashed border-border-light dark:border-border-dark opacity-60'
                : 'border-border-light dark:border-border-dark'
              }`}>
            {/* Barre titre + visibilité */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-light dark:text-text-dark truncate flex-1">
                {proj.title || 'Nouveau projet'}
              </span>
              <button
                onClick={() => updateProject(index, 'visible', proj.visible === false ? true : false)}
                title={proj.visible === false ? 'Afficher sur le portfolio' : 'Masquer du portfolio'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200 flex-shrink-0 ml-3
                  ${proj.visible === false
                    ? 'bg-surface-light dark:bg-surface-dark text-muted hover:text-orange-500'
                    : 'bg-green-500/10 text-green-600 hover:bg-red-500/10 hover:text-red-500'
                  }`}>
                {proj.visible === false
                  ? <><EyeOff size={13} /> Masqué</>
                  : <><Eye size={13} /> Visible</>
                }
              </button>
            </div>

            {/* ── LOGO ── */}
            <div className="flex items-center gap-4 mb-4 p-4 rounded-xl
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0
                bg-white dark:bg-surface2
                border border-border-light dark:border-border-dark
                flex items-center justify-center">
                {proj.image_url
                  ? <img src={proj.image_url} alt="logo" className="w-full h-full object-cover" />
                  : <Image size={22} className="text-muted" />
                }
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-text-light dark:text-text-dark mb-1">
                  Logo du projet
                </p>
                <p className="text-xs text-muted mb-2">Image affichée sur la carte du projet</p>
                <label className="inline-flex items-center gap-1.5 cursor-pointer
                  px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500
                  text-xs font-medium hover:bg-orange-500/20 transition-colors">
                  {uploading[`logo-${index}`]
                    ? <span className="w-3 h-3 rounded-full border border-orange-500 border-t-transparent animate-spin" />
                    : <Upload size={12} />}
                  {proj.image_url ? 'Changer le logo' : 'Uploader le logo'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(prev => ({ ...prev, [`logo-${index}`]: true }))
                      const url = await uploadFile(file, 'logos')
                      if (url) updateProject(index, 'image_url', url)
                      setUploading(prev => ({ ...prev, [`logo-${index}`]: false }))
                    }} />
                </label>
                {proj.image_url && (
                  <button onClick={() => updateProject(index, 'image_url', null)}
                    className="ml-2 text-xs text-muted hover:text-red-500 transition-colors">
                    Supprimer
                  </button>
                )}
              </div>
            </div>

            {/* ── MÉDIAS DE DESCRIPTION ── */}
            <div className="mb-4 p-4 rounded-xl space-y-4
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark">
              <p className="text-xs font-semibold text-text-light dark:text-text-dark
                flex items-center gap-2">
                Médias de la description
                <span className="font-normal text-muted">— photos et vidéos affichées dans la fiche</span>
              </p>

              {/* Photos */}
              <div>
                <p className="text-xs text-muted flex items-center gap-1.5 mb-2">
                  <Image size={12} className="text-orange-500" /> Photos
                </p>
                {toArr(proj.images).length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {toArr(proj.images).map((img, ii) => (
                      <div key={ii} className="relative group">
                        <img src={img} alt={`photo ${ii + 1}`}
                          className="w-full aspect-video object-cover rounded-lg
                            border border-border-light dark:border-border-dark" />
                        <button
                          onClick={() => updateProject(index, 'images',
                            toArr(proj.images).filter((_, idx) => idx !== ii))}
                          className="absolute top-1 right-1 p-1 rounded-full
                            bg-red-500 text-white opacity-0 group-hover:opacity-100
                            transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center gap-1.5 cursor-pointer
                  px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500
                  text-xs font-medium hover:bg-orange-500/20 transition-colors">
                  {uploading[`img-${index}`]
                    ? <span className="w-3 h-3 rounded-full border border-orange-500 border-t-transparent animate-spin" />
                    : <Upload size={12} />}
                  Ajouter photos
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={async e => {
                      const files = Array.from(e.target.files ?? [])
                      if (!files.length) return
                      setUploading(prev => ({ ...prev, [`img-${index}`]: true }))
                      const urls = await Promise.all(files.map(f => uploadFile(f, 'images')))
                      const valid = urls.filter(Boolean) as string[]
                      updateProject(index, 'images', [...toArr(proj.images), ...valid])
                      setUploading(prev => ({ ...prev, [`img-${index}`]: false }))
                    }} />
                </label>
              </div>

              {/* Vidéos */}
              <div>
                <p className="text-xs text-muted flex items-center gap-1.5 mb-2">
                  <Film size={12} className="text-blue-600 dark:text-blue-400" /> Vidéos
                  <span>(YouTube, Vimeo ou lien direct)</span>
                </p>
                {toArr(proj.videos).map((vid, vi) => (
                  <div key={vi} className="flex items-center gap-2 mb-1.5">
                    <input type="url" value={vid}
                      onChange={e => {
                        const updated = [...toArr(proj.videos)]
                        updated[vi] = e.target.value
                        updateProject(index, 'videos', updated)
                      }}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`flex-1 ${inputClass}`} />
                    <button onClick={() => updateProject(index, 'videos',
                        toArr(proj.videos).filter((_, idx) => idx !== vi))}
                      className="p-2 text-muted hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input type="url"
                    value={newVideoUrl[index] ?? ''}
                    onChange={e => setNewVideoUrl(prev => ({ ...prev, [index]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newVideoUrl[index]?.trim()) {
                        updateProject(index, 'videos', [...toArr(proj.videos), newVideoUrl[index].trim()])
                        setNewVideoUrl(prev => ({ ...prev, [index]: '' }))
                      }
                    }}
                    placeholder="Coller un lien vidéo..."
                    className={`flex-1 ${inputClass}`} />
                  <button
                    onClick={() => {
                      if (!newVideoUrl[index]?.trim()) return
                      updateProject(index, 'videos', [...toArr(proj.videos), newVideoUrl[index].trim()])
                      setNewVideoUrl(prev => ({ ...prev, [index]: '' }))
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600/10
                      text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── DOCUMENTS PDF ── */}
            <div className="mb-4 p-4 rounded-xl
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark">
              <p className="text-xs font-semibold text-text-light dark:text-text-dark
                flex items-center gap-1.5 mb-3">
                <FileText size={13} className="text-orange-500" /> Documents PDF
              </p>
              {toArr(proj.documents).map((doc, di) => (
                <div key={di} className="flex items-center gap-2 mb-1.5">
                  <a href={doc} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-xs px-3 py-2 rounded-xl
                      bg-blue-600/10 text-blue-600 dark:text-blue-400
                      border border-blue-600/20 truncate hover:bg-blue-600/20 transition-colors">
                    {toArr(proj.document_labels)[di] || `Document ${di + 1}`}
                  </a>
                  <button
                    onClick={() => {
                      updateProject(index, 'documents', toArr(proj.documents).filter((_, idx) => idx !== di))
                      updateProject(index, 'document_labels', toArr(proj.document_labels).filter((_, idx) => idx !== di))
                    }}
                    className="p-2 text-muted hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text"
                  value={newDocLabel[index] ?? ''}
                  onChange={e => setNewDocLabel(prev => ({ ...prev, [index]: e.target.value }))}
                  placeholder="Nom du document (ex: Rapport PDF)"
                  className={`flex-1 ${inputClass}`} />
                <label className="px-3 py-2 rounded-xl bg-orange-500/10 text-orange-500
                  hover:bg-orange-500/20 cursor-pointer transition-colors
                  flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                  {uploading[`pdf-${index}`]
                    ? <span className="w-3 h-3 rounded-full border border-orange-500 border-t-transparent animate-spin" />
                    : <Upload size={12} />}
                  PDF
                  <input type="file" accept=".pdf,application/pdf" className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(prev => ({ ...prev, [`pdf-${index}`]: true }))
                      const url = await uploadFile(file, 'docs')
                      if (url) {
                        updateProject(index, 'documents', [...toArr(proj.documents), url])
                        updateProject(index, 'document_labels', [...toArr(proj.document_labels),
                          newDocLabel[index]?.trim() || file.name.replace('.pdf', '')])
                        setNewDocLabel(prev => ({ ...prev, [index]: '' }))
                      }
                      setUploading(prev => ({ ...prev, [`pdf-${index}`]: false }))
                    }} />
                </label>
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
                {toArr(proj.tech).map((t, ti) => (
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

            {/* Compétences liées */}
            <div className="mb-4">
              <label className="text-xs text-muted block mb-2">
                Compétences (AC) démontrées par ce projet
              </label>
              <div className="space-y-3">
                {AC_CODES.map(group => (
                  <div key={group.domain}>
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1.5">
                      {group.domain}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.codes.map(({ code, title }) => {
                        const skillCodes = toArr(proj.skill_codes)
                        const selected = skillCodes.includes(code)
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              updateProject(index, 'skill_codes',
                                selected
                                  ? skillCodes.filter(c => c !== code)
                                  : [...skillCodes, code]
                              )
                            }}
                            title={title}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-150
                              ${selected
                                ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                                : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-muted hover:border-orange-500/50 hover:text-orange-500'
                              }`}>
                            {code}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {toArr(proj.skill_codes).length > 0 && (
                <p className="text-xs text-muted mt-2">
                  {toArr(proj.skill_codes).length} compétence(s) liée(s) :&nbsp;
                  <span className="text-orange-500">{toArr(proj.skill_codes).join(', ')}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={() => saveProject(proj, index)}
                disabled={saving === index}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                  transition-all duration-200 disabled:opacity-50">
                <Save size={14} />
                {saving === index ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <div className="flex items-center gap-3">
                {success === index && (
                  <span className="text-xs text-green-500 font-medium">✓ Enregistré</span>
                )}
                <button
                  onClick={() => proj.id ? deleteProject(proj.id) : removeUnsaved(index)}
                  className="p-2 rounded-xl text-muted hover:text-red-500
                    hover:bg-red-500/10 transition-all duration-200">
                  <Trash2 size={14} />
                </button>
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