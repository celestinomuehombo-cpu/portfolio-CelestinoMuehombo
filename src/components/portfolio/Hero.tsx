import { ArrowDown, Download, Mail } from 'lucide-react'
import { useHero } from '../../hooks/useSupabase'

export default function Hero() {
  const { data: hero, isLoading } = useHero()

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden
      bg-surface-light dark:bg-surface-dark pt-20">

      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px]
          bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl
          translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]
          bg-blue-700/10 dark:bg-blue-700/5 rounded-full blur-3xl
          -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px),
            linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)'
        }} />

      <div className="max-w-6xl mx-auto px-6  py-20 relative z-10 w-full">
        <div className="max-w-3xl">

          {/* Badge disponibilité */}
          <div className="inline-flex items-center gap-2 mb-8
            bg-orange-500/10 border border-orange-500/30
            rounded-full px-4 py-2 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse-slow" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              {isLoading ? 'Chargement...' : hero?.badge ?? 'Disponible — Alternance Septembre 2026'}
            </span>
          </div>


          {/* Nom */}
          <h1 className="animate-fade-up mb-6 leading-none tracking-tight"
            style={{ animationDelay: '0.1s' }}>
            <span className="block font-black text-5xl md:text-7xl lg:text-8xl
                text-text-light dark:text-text-dark"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                 Bonjour,
            </span>
            <span className="block font-black text-5xl md:text-7xl lg:text-8xl
                text-text-light dark:text-text-dark"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Je suis
            </span>
            <span
                className="block font-black text-5xl md:text-7xl lg:text-8xl"
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    backgroundImage: 'linear-gradient(90deg, #f97316 0%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    lineHeight : 1.1,
                    whiteSpace : 'nowrap'
                }}>
                    Celestino MUEHOMBO
            </span>
           
                {" "}
    
            {/*
            <span
                className="block font-black text-5xl md:text-7xl lg:text-8xl"
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    backgroundImage: 'linear-gradient(90deg, #f97316 0%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline',
                    lineHeight: 1.1,
                    marginBottom : 0,
                }}>
                    MUEHOMBO
            </span>
            */}
           
        </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl font-light text-muted max-w-xl
            leading-relaxed mb-10
            animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {hero?.tagline ?? (
              <>
                Passionné par les{' '}
                <strong className="text-text-light dark:text-text-dark font-medium">
                  réseaux
                </strong>
                , les{' '}
                <strong className="text-text-light dark:text-text-dark font-medium">
                  télécommunications
                </strong>
                {' '}et la{' '}
                <strong className="text-text-light dark:text-text-dark font-medium">
                  cybersécurité
                </strong>
              </>
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16
            animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                bg-orange-500 hover:bg-orange-600 text-white font-medium
                transition-all duration-200 shadow-lg shadow-orange-500/25
                hover:shadow-orange-500/40 hover:-translate-y-0.5">
              <Mail size={16} />
              Me contacter
            </a>
            <a href={hero?.cv_url ?? '#'}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                border border-border-light dark:border-border-dark
                text-text-light dark:text-text-dark font-medium
                hover:border-orange-500 dark:hover:border-orange-400
                hover:text-orange-500 dark:hover:text-orange-400
                transition-all duration-200 hover:-translate-y-0.5">
              <Download size={16} />
              Télécharger CV
            </a>
          </div>

          {/* Socials */}
          {/* Socials */}
          <div className="flex items-center gap-4
            animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-xs uppercase tracking-widest text-muted">Retrouvez-moi</span>
            <div className="h-px w-8 bg-border-light dark:bg-border-dark" />
            <a href="https://www.linkedin.com/in/celestino-muehombo-536434292/"
                target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full border border-border-light dark:border-border-dark
                    text-muted hover:text-blue-700 dark:hover:text-blue-400
                    hover:border-blue-700 dark:hover:border-blue-400
                    transition-all duration-200">
                 <i className="fab fa-linkedin-in text-base" />
            </a>
            <a href="https://github.com/celestinomuehombo-cpu"
                target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full border border-border-light dark:border-border-dark
                    text-muted hover:text-text-light dark:hover:text-text-dark
                    hover:border-text-light dark:hover:border-text-dark
                    transition-all duration-200">
                 <i className="fab fa-github text-base" />
             </a>
            </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-2 text-muted animate-fade-up"
        style={{ animationDelay: '0.6s' }}>
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}