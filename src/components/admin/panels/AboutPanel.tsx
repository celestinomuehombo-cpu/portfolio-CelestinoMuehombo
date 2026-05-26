import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Upload, X } from 'lucide-react'

interface AboutData {
  id?: string
  description_1: string
  description_2: string
  location: string
  availability: string
  specialty: string
  languages: string[]
  photo_url: string | null
}

const DEFAULT: AboutData = {
  description_1: "Étudiant angolais en BUT Réseaux & Télécommunications à l'IUT de Béthune, je me distingue par un profil éclectique : passionné de philosophie, de musique et d'écriture, je crois que la curiosité intellectuelle est le moteur de toute excellence technique.",
  description_2: "En parallèle de mes études, je fonde Tangisa — une plateforme éducative pour le marché angolais connectant élèves et tuteurs vérifiés.",
  location: 'France',
  availability: 'Alternance — Septembre 2026',
  specialty: 'Réseaux & Télécommunications — Cybersécurité',
  languages: ['Français (courant)', 'Portugais (courant)', 'Anglais (intermédiaire)'],
  photo_url: null,
}

export default function AboutPanel() {
  const [data, setData] = useState<AboutData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [newLanguage, setNewLanguage] = useState('')

  useEffect(() => {
    supabase.from('about').select('*').single()
      .then(({ data: d }) => {
        if (d) setData(d)
        setLoading(false)
      })
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return
    setData(prev => ({ ...prev, languages: [...prev.languages, newLanguage.trim()] }))
    setNewLanguage('')
  }

  const handleRemoveLanguage = (index: number) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    let photo_url = data.photo_url

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `profile/photo.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, photoFile, { upsert: true })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)
        photo_url = urlData.publicUrl
      }
    }

    const payload = { ...data, photo_url }

    if (data.id) {
      await supabase.from('about').update(payload).eq('id', data.id)
    } else {
      const { data: inserted } = await supabase
        .from('about').insert(payload).select().single()
      if (inserted) setData(inserted)
    }

    setData(prev => ({ ...prev, photo_url }))
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
          À propos
        </h2>
        <p className="text-sm text-muted">
          Modifiez votre présentation personnelle
        </p>
      </div>

      <div className="space-y-5">

        {/* Photo */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-3">
            Photo de profil
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark flex-shrink-0">
              {(photoPreview || data.photo_url) ? (
                <img src={photoPreview ?? data.photo_url ?? ''}
                  alt="Photo de profil"
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-black text-orange-500"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>CM</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm text-muted
                  file:mr-4 file:py-2 file:px-4 file:rounded-xl
                  file:border-0 file:text-sm file:font-medium
                  file:bg-orange-500/10 file:text-orange-500
                  hover:file:bg-orange-500/20 cursor-pointer" />
              <p className="text-xs text-muted mt-1">
                JPG, PNG — recommandé 400×500px
              </p>
            </div>
          </div>
        </div>

        {/* Description 1 */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            Description — Paragraphe 1
          </label>
          <textarea rows={4}
            value={data.description_1}
            onChange={e => setData(prev => ({ ...prev, description_1: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl resize-none
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              text-sm text-text-light dark:text-text-dark
              focus:outline-none focus:border-orange-500
              transition-colors duration-200" />
        </div>

        {/* Description 2 */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-2">
            Description — Paragraphe 2 (Tangisa)
          </label>
          <textarea rows={4}
            value={data.description_2}
            onChange={e => setData(prev => ({ ...prev, description_2: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl resize-none
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              text-sm text-text-light dark:text-text-dark
              focus:outline-none focus:border-orange-500
              transition-colors duration-200" />
        </div>

        {/* Infos grid */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-4">
            Informations
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Localisation</label>
              <input type="text"
                value={data.location}
                onChange={e => setData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark
                  text-sm text-text-light dark:text-text-dark
                  focus:outline-none focus:border-orange-500
                  transition-colors duration-200" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Disponibilité</label>
              <input type="text"
                value={data.availability}
                onChange={e => setData(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark
                  text-sm text-text-light dark:text-text-dark
                  focus:outline-none focus:border-orange-500
                  transition-colors duration-200" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted block mb-1">Spécialité</label>
              <input type="text"
                value={data.specialty}
                onChange={e => setData(prev => ({ ...prev, specialty: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl
                  bg-surface-light dark:bg-surface-dark
                  border border-border-light dark:border-border-dark
                  text-sm text-text-light dark:text-text-dark
                  focus:outline-none focus:border-orange-500
                  transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Langues */}
        <div className="bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark rounded-2xl p-5">
          <label className="text-xs uppercase tracking-wider text-muted
            font-semibold block mb-3">
            Langues
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.languages.map((lang, i) => (
              <span key={i} className="flex items-center gap-2
                px-3 py-1.5 rounded-full text-sm font-medium
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
                text-text-light dark:text-text-dark">
                {lang}
                <button onClick={() => handleRemoveLanguage(i)}
                  className="text-muted hover:text-red-500
                    transition-colors duration-200">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text"
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLanguage()}
              placeholder="Ex: Espagnol (débutant)"
              className="flex-1 px-4 py-2.5 rounded-xl
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
                text-sm text-text-light dark:text-text-dark
                placeholder:text-muted
                focus:outline-none focus:border-orange-500
                transition-colors duration-200" />
            <button onClick={handleAddLanguage}
              className="px-4 py-2.5 rounded-xl bg-orange-500/10
                text-orange-500 hover:bg-orange-500/20
                text-sm font-medium transition-colors duration-200">
              <Upload size={16} />
            </button>
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