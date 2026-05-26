import { useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Parcours', href: '#cv' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300
      bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md
      border-b border-border-light dark:border-border-dark">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="#hero" className="font-head font-black text-xl tracking-tight
          text-text-light dark:text-text-dark">
          C<span className="text-orange-500">.</span>MUEHOMBO
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link.href}>
              <a href={link.href}
                className="text-sm font-medium text-muted
                  hover:text-orange-500 dark:hover:text-orange-400
                  transition-colors duration-200">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botões direita */}
        <div className="flex items-center gap-3">
          {/* Toggle dark/light */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border-light dark:border-border-dark
              text-muted hover:text-orange-500 dark:hover:text-orange-400
              hover:border-orange-500 dark:hover:border-orange-400
              transition-all duration-200">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full border border-border-light
              dark:border-border-dark text-muted transition-all duration-200">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-light dark:border-border-dark
          bg-surface-light dark:bg-surface-dark px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map(link => (
              <li key={link.href}>
                <a href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-muted
                    hover:text-orange-500 dark:hover:text-orange-400
                    transition-colors duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}