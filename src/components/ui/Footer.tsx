import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border-light dark:border-border-dark
      bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16 py-8
        flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <a href="#hero" className="font-head font-black text-lg tracking-tight
          text-text-light dark:text-text-dark">
          C<span className="text-orange-500">.</span>MUEHOMBO
        </a>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-muted text-center">
            © {year} Celestino MUEHOMBO — Tous droits réservés
          </p>
          <Link to="/mentions-legales" className="text-xs text-muted hover:text-orange-500 transition-colors">
            Mentions légales
          </Link>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/in/celestino-muehombo-536434292/"
            target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-full border border-border-light dark:border-border-dark
              text-muted hover:text-blue-700 dark:hover:text-blue-400
              hover:border-blue-700 dark:hover:border-blue-400
              transition-all duration-200">
            <i className="fab fa-linkedin-in text-sm" />
          </a>
          <a href="https://github.com/celestinomuehombo-cpu"
            target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-full border border-border-light dark:border-border-dark
              text-muted hover:text-text-light dark:hover:text-text-dark
              hover:border-text-light dark:hover:border-text-dark
              transition-all duration-200">
            <i className="fab fa-github text-sm" />
          </a>
        </div>
      </div>
    </footer>
  )
}