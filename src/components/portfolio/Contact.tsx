import { Mail, MapPin, Send } from 'lucide-react'
import { useContact } from '../../hooks/useSupabase'

export default function Contact() {
  const { data: contact } = useContact()

  const defaultContact = {
    email: 'celestinomuehombo@gmail.com',
    linkedin_url: 'https://www.linkedin.com/in/celestino-muehombo-536434292/',
    github_url: 'https://github.com/celestinomuehombo-cpu',
    whatsapp: null,
  }

  const data = contact ?? defaultContact

  return (
    <section id="contact" className="py-32 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        {/* Header */}
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

          {/* Coluna esquerda */}
          <div className="space-y-8">
            <p className="text-lg font-light leading-relaxed text-muted">
              Vous avez une opportunité d'alternance ou un projet à partager ?
              Je suis disponible et prêt à en discuter.
            </p>

            {/* Info contact */}
            <div className="space-y-4">
              <a href={`mailto:${data.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl
                  bg-surface-light dark:bg-surface2
                  border border-border-light dark:border-border-dark
                  hover:border-orange-500/40 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10
                  flex items-center justify-center flex-shrink-0
                  group-hover:bg-orange-500 transition-colors duration-200">
                  <Mail size={18} className="text-orange-500 group-hover:text-white
                    transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">
                    {data.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl
                bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 rounded-xl bg-blue-700/10
                  flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-0.5">
                    Localisation
                  </p>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">
                    Béthune, France
                  </p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              <a href={data.linkedin_url ?? '#'}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                  border border-border-light dark:border-border-dark
                  text-sm font-medium text-muted
                  hover:border-blue-700 hover:text-blue-700
                  dark:hover:border-blue-400 dark:hover:text-blue-400
                  transition-all duration-200">
                <i className="fab fa-linkedin-in text-sm" />
                LinkedIn
              </a>
              <a href={data.github_url ?? '#'}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                  border border-border-light dark:border-border-dark
                  text-sm font-medium text-muted
                  hover:border-text-light hover:text-text-light
                  dark:hover:border-text-dark dark:hover:text-text-dark
                  transition-all duration-200">
                <i className="fab fa-github text-sm" />
                GitHub
              </a>
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <div className="bg-surface-light dark:bg-surface2
            border border-border-light dark:border-border-dark
            rounded-2xl p-8">
            <h3 className="font-head font-bold text-xl
              text-text-light dark:text-text-dark mb-6">
              Envoyer un message
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted
                  font-semibold block mb-2">
                  Nom
                </label>
                <input type="text" placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl
                    bg-white dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-sm text-text-light dark:text-text-dark
                    placeholder:text-muted
                    focus:outline-none focus:border-orange-500
                    transition-colors duration-200" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted
                  font-semibold block mb-2">
                  Email
                </label>
                <input type="email" placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-xl
                    bg-white dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-sm text-text-light dark:text-text-dark
                    placeholder:text-muted
                    focus:outline-none focus:border-orange-500
                    transition-colors duration-200" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted
                  font-semibold block mb-2">
                  Message
                </label>
                <textarea rows={4} placeholder="Votre message..."
                  className="w-full px-4 py-3 rounded-xl
                    bg-white dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-sm text-text-light dark:text-text-dark
                    placeholder:text-muted resize-none
                    focus:outline-none focus:border-orange-500
                    transition-colors duration-200" />
              </div>
              <a href={`mailto:${data.email}`}
                className="w-full flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl
                  bg-orange-500 hover:bg-orange-600 text-white font-medium
                  transition-all duration-200 shadow-lg shadow-orange-500/25
                  hover:shadow-orange-500/40 hover:-translate-y-0.5">
                <Send size={16} />
                Envoyer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}