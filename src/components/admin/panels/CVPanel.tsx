import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Plus, Trash2, Upload } from 'lucide-react'

interface Experience {
  id?: string
  period: string
  title: string
  company: string
  description: string
  display_order: number
  logo_url: string | null
}

interface Education {
  id?: string
  period: string
  title: string
  institution: string
  description: string
  display_order: number
  logo_url: string | null
}

interface Certification {
  id?: string
  year: string
  title: string
  issuer: string
  description: string
  display_order: number
  logo_url: string | null
}

type TabType = 'experience' | 'education' | 'certifications'

export default function CVPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('experience')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('experiences').select('*').order('display_order'),
      supabase.from('educations').select('*').order('display_order'),
      supabase.from('certifications').select('*').order('display_order'),
    ]).then(([exp, edu, cert]) => {
      if (exp.data) setExperiences(exp.data)
      if (edu.data) setEducations(edu.data)
      if (cert.data) setCertifications(cert.data)
      setLoading(false)
    })
  }, [])

  const uploadLogo = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('documents')
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('documents').getPublicUrl(path)
    return data.publicUrl
  }

  const showSuccess = (id: string) => {
    setSuccess(id)
    setTimeout(() => setSuccess(null), 3000)
  }

  // ── EXPERIENCES ──
  const saveExperience = async (exp: Experience) => {
    setSaving(exp.id ?? 'new')
    const payload = { ...exp }
    if (exp.id) {
      await supabase.from('experiences').update(payload).eq('id', exp.id)
    } else {
      const { data } = await supabase.from('experiences').insert(payload).select().single()
      if (data) setExperiences(prev => prev.map(e => e.id ? e : data))
    }
    setSaving(null)
    showSuccess(exp.id ?? 'new')
  }

  const deleteExperience = async (id: string) => {
    await supabase.from('experiences').delete().eq('id', id)
    setExperiences(prev => prev.filter(e => e.id !== id))
  }

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      period: '', title: '', company: '',
      description: '', display_order: prev.length, logo_url: null
    }])
  }

  // ── EDUCATIONS ──
  const saveEducation = async (edu: Education) => {
    setSaving(edu.id ?? 'new')
    const payload = { ...edu }
    if (edu.id) {
      await supabase.from('educations').update(payload).eq('id', edu.id)
    } else {
      const { data } = await supabase.from('educations').insert(payload).select().single()
      if (data) setEducations(prev => prev.map(e => e.id ? e : data))
    }
    setSaving(null)
    showSuccess(edu.id ?? 'new')
  }

  const deleteEducation = async (id: string) => {
    await supabase.from('educations').delete().eq('id', id)
    setEducations(prev => prev.filter(e => e.id !== id))
  }

  const addEducation = () => {
    setEducations(prev => [...prev, {
      period: '', title: '', institution: '',
      description: '', display_order: prev.length, logo_url: null
    }])
  }

  // ── CERTIFICATIONS ──
  const saveCertification = async (cert: Certification) => {
    setSaving(cert.id ?? 'new')
    const payload = { ...cert }
    if (cert.id) {
      await supabase.from('certifications').update(payload).eq('id', cert.id)
    } else {
      const { data } = await supabase.from('certifications').insert(payload).select().single()
      if (data) setCertifications(prev => prev.map(c => c.id ? c : data))
    }
    setSaving(null)
    showSuccess(cert.id ?? 'new')
  }

  const deleteCertification = async (id: string) => {
    await supabase.from('certifications').delete().eq('id', id)
    setCertifications(prev => prev.filter(c => c.id !== id))
  }

  const addCertification = () => {
    setCertifications(prev => [...prev, {
      year: '', title: '', issuer: '',
      description: '', display_order: prev.length, logo_url: null
    }])
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
          Parcours
        </h2>
        <p className="text-sm text-muted">
          Gérez vos expériences, formations et certifications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white dark:bg-surface2
        border border-border-light dark:border-border-dark
        rounded-full w-fit">
        {(['experience', 'education', 'certifications'] as TabType[]).map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${activeTab === tab
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-muted hover:text-text-light dark:hover:text-text-dark'
              }`}>
            {tab === 'experience' ? 'Expériences'
              : tab === 'education' ? 'Formations'
              : 'Certifications'}
          </button>
        ))}
      </div>

      {/* Expériences */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={exp.id ?? index}
              className="bg-white dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-2xl p-5">

              {/* Logo upload */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark flex-shrink-0">
                  {exp.logo_url ? (
                    <img src={exp.logo_url} alt="logo"
                      className="w-full h-full object-contain p-1" />
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
                      const url = await uploadLogo(file, 'logos/experiences')
                      if (url) setExperiences(prev => prev.map((ex, i) =>
                        i === index ? { ...ex, logo_url: url } : ex))
                    }}
                    className="w-full text-xs text-muted
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                      file:border-0 file:text-xs file:font-medium
                      file:bg-orange-500/10 file:text-orange-500
                      hover:file:bg-orange-500/20 cursor-pointer" />
                  <p className="text-xs text-muted mt-1">Logo de l'entreprise</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted block mb-1">Période</label>
                  <input type="text" value={exp.period}
                    onChange={e => setExperiences(prev => prev.map((ex, i) =>
                      i === index ? { ...ex, period: e.target.value } : ex))}
                    placeholder="Avril — Mai 2026"
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Entreprise</label>
                  <input type="text" value={exp.company}
                    onChange={e => setExperiences(prev => prev.map((ex, i) =>
                      i === index ? { ...ex, company: e.target.value } : ex))}
                    placeholder="Nom de l'entreprise"
                    className={inputClass} />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted block mb-1">Titre du poste</label>
                <input type="text" value={exp.title}
                  onChange={e => setExperiences(prev => prev.map((ex, i) =>
                    i === index ? { ...ex, title: e.target.value } : ex))}
                  placeholder="Stagiaire Technicien Réseaux"
                  className={inputClass} />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted block mb-1">Description</label>
                <textarea rows={3} value={exp.description}
                  onChange={e => setExperiences(prev => prev.map((ex, i) =>
                    i === index ? { ...ex, description: e.target.value } : ex))}
                  placeholder="Décrivez vos missions..."
                  className={`${inputClass} resize-none`} />
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => saveExperience(exp)}
                  disabled={saving === (exp.id ?? 'new')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                    transition-all duration-200 disabled:opacity-50">
                  <Save size={14} />
                  {saving === (exp.id ?? 'new') ? 'Enregistrement...' : 'Enregistrer'}
                </button>

                <div className="flex items-center gap-3">
                  {success === (exp.id ?? 'new') && (
                    <span className="text-xs text-green-500">✓ Enregistré</span>
                  )}
                  {exp.id && (
                    <button onClick={() => deleteExperience(exp.id!)}
                      className="p-2 rounded-xl text-muted hover:text-red-500
                        hover:bg-red-500/10 transition-all duration-200">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addExperience}
            className="w-full flex items-center justify-center gap-2
              py-4 rounded-2xl border-2 border-dashed
              border-border-light dark:border-border-dark
              text-muted hover:text-orange-500 hover:border-orange-500/40
              text-sm font-medium transition-all duration-200">
            <Plus size={16} />
            Ajouter une expérience
          </button>
        </div>
      )}

      {/* Formations */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div key={edu.id ?? index}
              className="bg-white dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-2xl p-5">

              {/* Logo upload */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark flex-shrink-0">
                  {edu.logo_url ? (
                    <img src={edu.logo_url} alt="logo"
                      className="w-full h-full object-contain p-1" />
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
                      const url = await uploadLogo(file, 'logos/educations')
                      if (url) setEducations(prev => prev.map((ed, i) =>
                        i === index ? { ...ed, logo_url: url } : ed))
                    }}
                    className="w-full text-xs text-muted
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                      file:border-0 file:text-xs file:font-medium
                      file:bg-blue-700/10 file:text-blue-700
                      hover:file:bg-blue-700/20 cursor-pointer" />
                  <p className="text-xs text-muted mt-1">Logo de l'établissement</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted block mb-1">Période</label>
                  <input type="text" value={edu.period}
                    onChange={e => setEducations(prev => prev.map((ed, i) =>
                      i === index ? { ...ed, period: e.target.value } : ed))}
                    placeholder="2023 — présent"
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Établissement</label>
                  <input type="text" value={edu.institution}
                    onChange={e => setEducations(prev => prev.map((ed, i) =>
                      i === index ? { ...ed, institution: e.target.value } : ed))}
                    placeholder="IUT de Béthune"
                    className={inputClass} />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted block mb-1">Titre de la formation</label>
                <input type="text" value={edu.title}
                  onChange={e => setEducations(prev => prev.map((ed, i) =>
                    i === index ? { ...ed, title: e.target.value } : ed))}
                  placeholder="BUT Réseaux & Télécommunications"
                  className={inputClass} />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted block mb-1">Description</label>
                <textarea rows={3} value={edu.description}
                  onChange={e => setEducations(prev => prev.map((ed, i) =>
                    i === index ? { ...ed, description: e.target.value } : ed))}
                  placeholder="Décrivez la formation..."
                  className={`${inputClass} resize-none`} />
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => saveEducation(edu)}
                  disabled={saving === (edu.id ?? 'new')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium
                    transition-all duration-200 disabled:opacity-50">
                  <Save size={14} />
                  {saving === (edu.id ?? 'new') ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <div className="flex items-center gap-3">
                  {success === (edu.id ?? 'new') && (
                    <span className="text-xs text-green-500">✓ Enregistré</span>
                  )}
                  {edu.id && (
                    <button onClick={() => deleteEducation(edu.id!)}
                      className="p-2 rounded-xl text-muted hover:text-red-500
                        hover:bg-red-500/10 transition-all duration-200">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addEducation}
            className="w-full flex items-center justify-center gap-2
              py-4 rounded-2xl border-2 border-dashed
              border-border-light dark:border-border-dark
              text-muted hover:text-blue-700 hover:border-blue-700/40
              text-sm font-medium transition-all duration-200">
            <Plus size={16} />
            Ajouter une formation
          </button>
        </div>
      )}

      {/* Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={cert.id ?? index}
              className="bg-white dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-2xl p-5">

              {/* Logo upload */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark flex-shrink-0">
                  {cert.logo_url ? (
                    <img src={cert.logo_url} alt="logo"
                      className="w-full h-full object-contain p-1" />
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
                      const url = await uploadLogo(file, 'logos/certifications')
                      if (url) setCertifications(prev => prev.map((c, i) =>
                        i === index ? { ...c, logo_url: url } : c))
                    }}
                    className="w-full text-xs text-muted
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                      file:border-0 file:text-xs file:font-medium
                      file:bg-orange-500/10 file:text-orange-500
                      hover:file:bg-orange-500/20 cursor-pointer" />
                  <p className="text-xs text-muted mt-1">Logo de l'organisme</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted block mb-1">Année</label>
                  <input type="text" value={cert.year}
                    onChange={e => setCertifications(prev => prev.map((c, i) =>
                      i === index ? { ...c, year: e.target.value } : c))}
                    placeholder="2026"
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Organisme</label>
                  <input type="text" value={cert.issuer}
                    onChange={e => setCertifications(prev => prev.map((c, i) =>
                      i === index ? { ...c, issuer: e.target.value } : c))}
                    placeholder="Cisco"
                    className={inputClass} />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted block mb-1">Titre</label>
                <input type="text" value={cert.title}
                  onChange={e => setCertifications(prev => prev.map((c, i) =>
                    i === index ? { ...c, title: e.target.value } : c))}
                  placeholder="Ethical Hacker"
                  className={inputClass} />
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted block mb-1">Description</label>
                <textarea rows={2} value={cert.description}
                  onChange={e => setCertifications(prev => prev.map((c, i) =>
                    i === index ? { ...c, description: e.target.value } : c))}
                  placeholder="Description de la certification..."
                  className={`${inputClass} resize-none`} />
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => saveCertification(cert)}
                  disabled={saving === (cert.id ?? 'new')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                    transition-all duration-200 disabled:opacity-50">
                  <Save size={14} />
                  {saving === (cert.id ?? 'new') ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <div className="flex items-center gap-3">
                  {success === (cert.id ?? 'new') && (
                    <span className="text-xs text-green-500">✓ Enregistré</span>
                  )}
                  {cert.id && (
                    <button onClick={() => deleteCertification(cert.id!)}
                      className="p-2 rounded-xl text-muted hover:text-red-500
                        hover:bg-red-500/10 transition-all duration-200">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addCertification}
            className="w-full flex items-center justify-center gap-2
              py-4 rounded-2xl border-2 border-dashed
              border-border-light dark:border-border-dark
              text-muted hover:text-orange-500 hover:border-orange-500/40
              text-sm font-medium transition-all duration-200">
            <Plus size={16} />
            Ajouter une certification
          </button>
        </div>
      )}
    </div>
  )
}