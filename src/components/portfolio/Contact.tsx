import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useContact } from '../../hooks/useSupabase'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? ''
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? ''
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? ''

export default function Contact() {
  const { data: contact } = useContact()
  const defaultContact = {
    email: 'celestinomuehombo@gmail.com',
    linkedin_url: 'https://www.linkedin.com/in/celestino-muehombo-536434292/',
    github_url: 'https://github.com/celestinomuehombo-cpu',
    whatsapp: null,
  }
  const data = contact ?? defaultContact

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const inputClass = `w-full px-4 py-3 rounded-xl
    bg-white dark:bg-surface-dark
    border border-border-light dark:border-border-dark
    text-sm text-text-light dark:text-text-dark
    placeholder:text-muted
    focus:outline-none focus:border-orange-500
    transition-colors duration-200`

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    if (!EMAILJS_SERVICE || !EMAILJS_TEMPLATE || !EMAILJS_KEY) {
      window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(form.subject || 'Contact portfolio')}&body=${encodeURIComponent(`${form.name}\n${form.email}\n\n${form.message}`)}`
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject || 'Contact depuis le portfolio',
        message: form.message,
        to_email: data.email,
      }, EMAILJS_KEY)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" className="py-32 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              Contact
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Travaillons<br />
            <span className="text-orange-500">ensemble</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Gauche */}
          <div className="space-y-8">
            <p className="text-lg font-light leading-relaxed text-muted">
              Vous avez une opportunité d'alternance ou un projet à partager ?
              Je suis disponible et prêt à en discuter.
            </p>

            <div className="space-y-4">
              <a href={`mailto:${data.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl
                  bg-surface-light dark:bg-surface2
                  border border-border-light dark:border-border-dark
                  hover:border-orange-500/40 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10
                  flex items-center justify-center flex-shrink-0
                  group-hover:bg-orange-500 transition-colors duration-200">
                  <Mail size={18} className="text-orange-500 group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-0.5">Email</p>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">{data.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl
                bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 rounded-xl bg-blue-700/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-0.5">Localisation</p>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">Béthune, France</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a href={data.linkedin_url ?? '#'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                  border border-border-light dark:border-border-dark
                  text-sm font-medium text-muted
                  hover:border-blue-700 hover:text-blue-700
                  dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200">
                <i className="fab fa-linkedin-in text-sm" /> LinkedIn
              </a>
              <a href={data.github_url ?? '#'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                  border border-border-light dark:border-border-dark
                  text-sm font-medium text-muted
                  hover:border-text-light hover:text-text-light
                  dark:hover:border-text-dark dark:hover:text-text-dark transition-all duration-200">
                <i className="fab fa-github text-sm" /> GitHub
              </a>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}
            className="bg-surface-light dark:bg-surface2
              border border-border-light dark:border-border-dark
              rounded-2xl p-8 space-y-4">
            <h3 className="font-head font-bold text-xl text-text-light dark:text-text-dark mb-2">
              Envoyer un message
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1">Nom *</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Votre nom" className={inputClass} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1">Email *</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1">Sujet</label>
              <input type="text" value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Opportunité d'alternance..." className={inputClass} />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1">Message *</label>
              <textarea rows={4} required value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Votre message..."
                className={`${inputClass} resize-none`} />
            </div>

            <button type="submit" disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-orange-500 hover:bg-orange-600 text-white font-medium
                transition-all duration-200 shadow-lg shadow-orange-500/25
                hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:opacity-60">
              {status === 'sending'
                ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Envoi...</>
                : <><Send size={16} /> Envoyer</>}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle size={16} /> Message envoyé avec succès !
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <AlertCircle size={16} /> Erreur — réessayez ou contactez par email.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
