import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard, User, Code2, FolderOpen,
  GraduationCap, Mail, LogOut, ChevronRight,
  Moon, Sun, Menu, X, ExternalLink
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

import HeroPanel from '../../components/admin/panels/HeroPanel'
import AboutPanel from '../../components/admin/panels/AboutPanel'
import SkillsPanel from '../../components/admin/panels/SkillsPanel'
import ProjectsPanel from '../../components/admin/panels/ProjectsPanel'
import CVPanel from '../../components/admin/panels/CVPanel'
import ContactPanel from '../../components/admin/panels/ContactPanel'

type Section = 'overview' | 'hero' | 'about' | 'skills' | 'projects' | 'cv' | 'contact'

const NAV_ITEMS = [
  { id: 'overview' as Section, label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'hero' as Section, label: 'Hero', icon: User },
  { id: 'about' as Section, label: 'À propos', icon: User },
  { id: 'skills' as Section, label: 'Compétences', icon: Code2 },
  { id: 'projects' as Section, label: 'Projets', icon: FolderOpen },
  { id: 'cv' as Section, label: 'Parcours', icon: GraduationCap },
  { id: 'contact' as Section, label: 'Contact', icon: Mail },
]

const OVERVIEW_CARDS = [
  { id: 'hero', label: 'Hero', icon: User, desc: 'Badge, nom, tagline, CV' },
  { id: 'about', label: 'À propos', icon: User, desc: 'Photo, description, infos' },
  { id: 'skills', label: 'Compétences', icon: Code2, desc: 'ACs, projets, réflexions' },
  { id: 'projects', label: 'Projets', icon: FolderOpen, desc: 'Tangisa et projets académiques' },
  { id: 'cv', label: 'Parcours', icon: GraduationCap, desc: 'Expériences, formations, certifs' },
  { id: 'contact', label: 'Contact', icon: Mail, desc: 'Email, réseaux sociaux' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const renderPanel = () => {
    switch (activeSection) {
      case 'hero': return <HeroPanel />
      case 'about': return <AboutPanel />
      case 'skills': return <SkillsPanel />
      case 'projects': return <ProjectsPanel />
      case 'cv': return <CVPanel />
      case 'contact': return <ContactPanel />
      default: return (
        <div>
          <div className="mb-8">
            <h2 className="font-head font-bold text-2xl
              text-text-light dark:text-text-dark mb-1">
              Vue d'ensemble
            </h2>
            <p className="text-sm text-muted">
              Sélectionnez une section à modifier
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Portfolio', value: 'En ligne', sub: 'Voir le site' },
              { label: 'Sections', value: '6', sub: 'À gérer' },
              { label: 'Disponibilité', value: 'Sept. 26', sub: 'Alternance' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wider text-muted
                  font-semibold mb-2">{stat.label}</p>
                <p className="text-xl font-black text-text-light dark:text-text-dark
                  mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {stat.value}
                </p>
                {i === 0 ? (
                  <a href="https://celestinomuehombo-cpu.github.io/portfolio-celestino/"
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-orange-500 hover:underline
                      flex items-center gap-1">
                    {stat.sub} <ExternalLink size={10} />
                  </a>
                ) : (
                  <p className="text-xs text-muted">{stat.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OVERVIEW_CARDS.map(card => {
              const Icon = card.icon
              return (
                <button key={card.id}
                  onClick={() => setActiveSection(card.id as Section)}
                  className="text-left bg-white dark:bg-surface2
                    border border-border-light dark:border-border-dark
                    rounded-2xl p-5 group
                    hover:border-orange-500/30
                    hover:-translate-y-0.5
                    transition-all duration-200">
                  <div className="w-9 h-9 rounded-xl mb-4
                    bg-surface-light dark:bg-surface-dark
                    flex items-center justify-center">
                    <Icon size={16} className="text-muted
                      group-hover:text-orange-500 transition-colors duration-200" />
                  </div>
                  <h3 className="font-head font-bold text-sm
                    text-text-light dark:text-text-dark mb-1
                    group-hover:text-orange-500 transition-colors duration-200">
                    {card.label}
                  </h3>
                  <p className="text-xs text-muted font-light mb-3">
                    {card.desc}
                  </p>
                  <div className="flex items-center text-xs text-muted
                    group-hover:text-orange-500 transition-colors duration-200">
                    Modifier
                    <ChevronRight size={12} className="ml-1
                      group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60
        bg-white dark:bg-surface2
        border-r border-border-light dark:border-border-dark
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex`}>

        {/* Header */}
        <div className="px-5 py-5 border-b
          border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <span className="font-head font-black text-base tracking-tight
              text-text-light dark:text-text-dark">
              C<span className="text-orange-500">.</span>MUEHOMBO
            </span>
            <button onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted
                hover:text-text-light dark:hover:text-text-dark
                transition-colors duration-200">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-muted mt-0.5">Administration</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5
                  rounded-xl text-sm font-medium transition-all duration-200
                  ${activeSection === item.id
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-muted hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                  }`}>
                <Icon size={15} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-light dark:border-border-dark
          space-y-0.5">
          <a href="https://celestinomuehombo-cpu.github.io/portfolio-celestino/"
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5
              rounded-xl text-sm font-medium text-muted
              hover:text-text-light dark:hover:text-text-dark
              hover:bg-surface-light dark:hover:bg-surface-dark
              transition-all duration-200">
            <ExternalLink size={15} />
            Voir le portfolio
          </a>
          <button onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5
              rounded-xl text-sm font-medium text-muted
              hover:text-red-500 hover:bg-red-500/5
              transition-all duration-200">
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-30
          bg-white/80 dark:bg-surface2/80 backdrop-blur-md
          border-b border-border-light dark:border-border-dark
          px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted
                hover:text-text-light dark:hover:text-text-dark
                hover:bg-surface-light dark:hover:bg-surface-dark
                transition-all duration-200">
              <Menu size={16} />
            </button>
            <div>
              <h1 className="font-head font-bold text-sm
                text-text-light dark:text-text-dark">
                {NAV_ITEMS.find(i => i.id === activeSection)?.label ?? 'Dashboard'}
              </h1>
              <p className="text-xs text-muted hidden sm:block">
                Gérez le contenu de votre portfolio
              </p>
            </div>
          </div>
          <button onClick={toggleTheme}
            className="p-2 rounded-full border
              border-border-light dark:border-border-dark text-muted
              hover:text-text-light dark:hover:text-text-dark
              transition-all duration-200">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderPanel()}
        </div>
      </main>

      {/* Modal logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white dark:bg-surface2
            border border-border-light dark:border-border-dark
            rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-head font-bold text-lg
              text-text-light dark:text-text-dark mb-2">
              Déconnexion
            </h3>
            <p className="text-sm text-muted mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border
                  border-border-light dark:border-border-dark
                  text-sm font-medium text-muted
                  hover:text-text-light dark:hover:text-text-dark
                  transition-all duration-200">
                Annuler
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500
                  hover:bg-red-600 text-white text-sm font-medium
                  transition-all duration-200">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}