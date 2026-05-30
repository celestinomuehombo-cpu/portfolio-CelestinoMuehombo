import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Save, Plus, Trash2, Upload, Eye, EyeOff, ExternalLink } from 'lucide-react'

interface Certification {
  id?: string
  year: string
  title: string
  issuer: string
  description: string
  display_order: number
  logo_url: string | null
  cert_url?: string | null
  visible?: boolean
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { year: '2026', title: 'Ethical Hacker', issuer: 'Cisco',
    description: 'Certificação que valida competências em cibersegurança ofensiva e defensiva.',
    display_order: 0, logo_url: null, cert_url: null },
  { year: '2023', title: 'Higiene Informática', issuer: 'ANSSI',
    description: 'Domínio das boas práticas de segurança informática e higiene digital.',
    display_order: 1, logo_url: null, cert_url: null },
]

export default function CertificationsPanel() {
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usingDefaults, setUsingDefaults] = useState(false)

  useEffect(() => {
    supabase.from('certifications').select('*').order('display_order')
      .then(({ data, error: err }) => {
        if (err) { setError(`Erro ao carregar: ${err.message}`); setLoading(false); return }
        if (data && data.length > 0) {
          setCerts(data)
        } else {
          setCerts(DEFAULT_CERTIFICATIONS)
          setUsingDefaults(true)
        }
        setLoading(false)
      })
  }, [])

  const update = (index: number, field: keyof Certification, value: unknown) =>
    setCerts(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))

  const uploadLogo = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `logos/certifications/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
    if (error) return null
    return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
  }

  const showSuccess = (idx: number) => {
    setSuccess(idx)
    setTimeout(() => setSuccess(null), 3000)
  }

  const save = async (cert: Certification, index: number) => {
    setSaving(index)
    setError(null)
    const payload = { ...cert }
    if (cert.id) {
      const { error: err } = await supabase.from('certifications').update(payload).eq('id', cert.id)
      if (err) { setError(err.message); setSaving(null); return }
    } else {
      const { data, error: err } = await supabase.from('certifications').insert(payload).select().single()
      if (err) { setError(err.message); setSaving(null); return }
      if (data) {
        setCerts(prev => prev.map((c, i) => i === index ? data : c))
        setUsingDefaults(false)
      }
    }
    setSaving(null)
    showSuccess(index)
  }

  const remove = async (cert: Certification, index: number) => {
    if (cert.id) {
      await supabase.from('certifications').delete().eq('id', cert.id)
      setCerts(prev => prev.filter(c => c.id !== cert.id))
    } else {
      setCerts(prev => prev.filter((_, i) => i !== index))
    }
  }

  const inputClass = `w-full px-4 py-2.5 rounded-xl
    bg-surface-light dark:bg-surface-dark
    border border-border-light dark:border-border-dark
    text-sm text-text-light dark:text-text-dark placeholder:text-muted
    focus:outline-none focus:border-orange-500 transition-colors duration-200`

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl text-text-light dark:text-text-dark mb-1">
          Certificações
        </h2>
        <p className="text-sm text-muted">
          Gere as suas certificações — exibidas na secção dedicada do portfolio
        </p>
      </div>

      {usingDefaults && (
        <div className="mb-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-orange-500">
          Nenhuma certificação na base de dados — estes dados são exemplos. Guarde-os para os ativar no portfolio.
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {certs.map((cert, index) => (
          <div key={cert.id ?? index}
            className={`rounded-2xl p-5 border transition-all
              ${cert.visible === false
                ? 'border-dashed border-border-light dark:border-border-dark opacity-60 bg-white dark:bg-surface2'
                : 'bg-white dark:bg-surface2 border-border-light dark:border-border-dark'}`}>

            {/* Título + visibilidade */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-light dark:text-text-dark truncate flex-1">
                {cert.title || 'Nova certificação'}
              </span>
              <button onClick={() => update(index, 'visible', cert.visible === false ? true : false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ml-3
                  ${cert.visible === false
                    ? 'bg-surface-light dark:bg-surface-dark text-muted hover:text-orange-500'
                    : 'bg-green-500/10 text-green-600 hover:bg-red-500/10 hover:text-red-500'}`}>
                {cert.visible === false ? <><EyeOff size={13} /> Oculto</> : <><Eye size={13} /> Visível</>}
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark flex items-center justify-center">
                {cert.logo_url
                  ? <img src={cert.logo_url} alt="logo" className="w-full h-full object-contain p-1" />
                  : <Upload size={16} className="text-muted" />}
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer
                  px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500
                  text-xs font-medium hover:bg-orange-500/20 transition-colors">
                  <Upload size={12} /> {cert.logo_url ? 'Alterar logo' : 'Carregar logo'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const url = await uploadLogo(file)
                      if (url) update(index, 'logo_url', url)
                    }} />
                </label>
                {cert.logo_url && (
                  <button onClick={() => update(index, 'logo_url', null)}
                    className="ml-2 text-xs text-muted hover:text-red-500 transition-colors">
                    Remover
                  </button>
                )}
              </div>
            </div>

            {/* Campos */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted block mb-1">Ano</label>
                <input type="text" value={cert.year}
                  onChange={e => update(index, 'year', e.target.value)}
                  placeholder="2026" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Entidade emissora</label>
                <input type="text" value={cert.issuer}
                  onChange={e => update(index, 'issuer', e.target.value)}
                  placeholder="Cisco, ANSSI..." className={inputClass} />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted block mb-1">Título da certificação</label>
              <input type="text" value={cert.title}
                onChange={e => update(index, 'title', e.target.value)}
                placeholder="Ethical Hacker" className={inputClass} />
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted block mb-1">Descrição</label>
              <textarea rows={2} value={cert.description}
                onChange={e => update(index, 'description', e.target.value)}
                placeholder="Descreva a certificação..."
                className={`${inputClass} resize-none`} />
            </div>

            <div className="mb-3">
              <label className="text-xs text-muted block mb-1">Ordem de exibição</label>
              <input type="number" value={cert.display_order}
                onChange={e => update(index, 'display_order', Number(e.target.value))}
                className={inputClass} />
            </div>

            <div className="mb-4">
              <label className="text-xs text-muted block mb-1 flex items-center gap-1">
                <ExternalLink size={11} /> Link para o certificado (opcional)
              </label>
              <input type="url" value={cert.cert_url ?? ''}
                onChange={e => update(index, 'cert_url', e.target.value || null)}
                placeholder="https://..." className={inputClass} />
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between">
              <button onClick={() => save(cert, index)}
                disabled={saving === index}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                  transition-all duration-200 disabled:opacity-50">
                <Save size={14} />
                {saving === index ? 'A guardar...' : 'Guardar'}
              </button>
              <div className="flex items-center gap-3">
                {success === index && (
                  <span className="text-xs text-green-500 font-medium">✓ Guardado</span>
                )}
                <button onClick={() => remove(cert, index)}
                  className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => setCerts(prev => [...prev, {
          year: new Date().getFullYear().toString(),
          title: '', issuer: '', description: '',
          display_order: prev.length, logo_url: null, cert_url: null, visible: true
        }])}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
            border-2 border-dashed border-border-light dark:border-border-dark
            text-muted hover:text-orange-500 hover:border-orange-500/40
            text-sm font-medium transition-all duration-200">
          <Plus size={16} /> Adicionar certificação
        </button>
      </div>
    </div>
  )
}
