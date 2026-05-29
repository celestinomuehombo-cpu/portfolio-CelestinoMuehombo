import { ExternalLink, GitBranch, ArrowUpRight } from 'lucide-react'
import { useProjects } from '../../hooks/useSupabase'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  github_url: string | null
  demo_url: string | null
  image_url: string | null
  images?: string[]
  video?: string[]
  documents?: string[]
  document_labels?: string[]
  status: string
  display_order: number
  category: string
  highlight: boolean
  skill_codes?: string[]
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Tangisa',
    description: 'Plateforme marketplace éducative pour le marché angolais connectant élèves et tuteurs vérifiés. Système de vérification en 4 étapes, dashboard parental en temps réel, 2 plans d\'abonnement.',
    tech: ['React', 'TypeScript', 'Supabase', 'Flutterwave', 'Netlify'],
    github_url: null,
    demo_url: null,
    image_url: null,
    images: [],
    documents: [],
    document_labels: [],
    status: 'wip',
    display_order: 0,
    category: 'Entrepreneuriat',
    highlight: true,
  },
  {
    id: '2',
    title: 'Portfolio Personnel',
    description: 'Ce portfolio — conçu et développé from scratch avec React, TypeScript et Tailwind. Système de gestion de contenu via Supabase avec panneau admin.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
    github_url: 'https://github.com/celestinomuehombo-cpu',
    demo_url: null,
    image_url: null,
    images: [],
    documents: [],
    document_labels: [],
    status: 'done',
    display_order: 1,
    category: 'Web',
    highlight: false,
  },
  {
    id: '3',
    title: 'Infrastructure GRE/IPsec Multi-sites',
    description: 'Architecture réseau complète interconnectant deux sites via tunnel GRE encapsulé dans IPsec. Segmentation VLAN, pare-feux ASA, routage OSPF.',
    tech: ['Cisco IOS', 'GRE', 'IPsec', 'OSPF', 'Packet Tracer'],
    github_url: null,
    demo_url: null,
    image_url: null,
    images: [],
    documents: [],
    document_labels: [],
    status: 'done',
    display_order: 2,
    category: 'Réseaux',
    highlight: false,
  },
  {
    id: '4',
    title: 'Chat TCP Client/Serveur',
    description: 'Application de messagerie en temps réel utilisant des sockets TCP. Serveur multi-clients avec threading, protocole applicatif JSON.',
    tech: ['Python 3', 'socket', 'threading', 'JSON'],
    github_url: 'https://github.com/celestinomuehombo-cpu',
    demo_url: null,
    image_url: null,
    images: [],
    documents: [],
    document_labels: [],
    status: 'done',
    display_order: 3,
    category: 'Programmation',
    highlight: false,
  },
  {
    id: '5',
    title: 'Scripts Admin Réseau',
    description: 'Suite de scripts d\'automatisation pour backup des configs Cisco via SSH, monitoring de disponibilité avec alertes email et génération de rapports HTML.',
    tech: ['Python 3', 'Bash', 'Paramiko', 'Netmiko', 'cron'],
    github_url: 'https://github.com/celestinomuehombo-cpu',
    demo_url: null,
    image_url: null,
    images: [],
    documents: [],
    document_labels: [],
    status: 'done',
    display_order: 4,
    category: 'Automatisation',
    highlight: false,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Entrepreneuriat': 'text-orange-500 bg-orange-500/10',
  'Web': 'text-blue-700 bg-blue-700/10 dark:text-blue-400',
  'Réseaux': 'text-blue-700 bg-blue-700/10 dark:text-blue-400',
  'Programmation': 'text-orange-500 bg-orange-500/10',
  'Automatisation': 'text-orange-500 bg-orange-500/10',
  'Cybersécurité': 'text-blue-700 bg-blue-700/10 dark:text-blue-400',
}

export default function Projects() {
  const { data: projectsData } = useProjects()
  const projects = (projectsData && projectsData.length > 0
    ? projectsData
    : DEFAULT_PROJECTS) as Project[]

  const highlighted = projects.find(p => p.highlight)
  const others = projects.filter(p => !p.highlight)

  return (
    <section id="projects" className="py-32 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              Mes projets
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Ce que je<br />
            <span className="text-orange-500">construis</span>
          </h2>
        </div>

        {/* Projet mis en avant */}
        {highlighted && (
          <div className="mb-8 rounded-2xl overflow-hidden border
            border-border-light dark:border-border-dark
            bg-gradient-to-br from-orange-500/5 to-blue-700/5
            hover:border-orange-500/30 transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Image */}
              <div className="aspect-video lg:aspect-auto min-h-[280px]
                bg-gradient-to-br from-orange-500/15 to-blue-700/15
                flex items-center justify-center relative overflow-hidden">
                {highlighted.image_url ? (
                  <img src={highlighted.image_url} alt={highlighted.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-orange-500
                      flex items-center justify-center mx-auto mb-4
                      shadow-lg shadow-orange-500/30">
                      <span className="text-white font-black text-2xl"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>T</span>
                    </div>
                    <p className="text-sm text-muted font-medium">{highlighted.title}</p>
                  </div>
                )}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full
                  bg-orange-500/10" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full
                  bg-blue-700/10" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                      ${CATEGORY_COLORS[highlighted.category ?? ''] ?? 'text-muted bg-surface-light'}`}>
                      {highlighted.category}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full
                      text-orange-500 bg-orange-500/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      En cours
                    </span>
                  </div>
                  <h3 className="font-head font-black text-2xl
                    text-text-light dark:text-text-dark mb-3">
                    {highlighted.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-muted mb-6">
                    {highlighted.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {highlighted.tech.map((t, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                        bg-surface-light dark:bg-surface2
                        border border-border-light dark:border-border-dark
                        text-text-light dark:text-text-dark font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Documents */}
                  {(highlighted.documents?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(highlighted.documents?? []).map((doc, i) => (
                        <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs
                            px-3 py-1.5 rounded-lg
                            bg-blue-700/10 text-blue-700 dark:text-blue-400
                            hover:bg-blue-700/20 transition-colors duration-200">
                          <ExternalLink size={12} />
                          {(highlighted.document_labels ?? [])[i] || `Document ${i + 1}`}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {highlighted.demo_url && (
                    <a href={highlighted.demo_url}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5
                        rounded-full bg-orange-500 hover:bg-orange-600
                        text-white text-sm font-medium
                        transition-all duration-200 hover:-translate-y-0.5
                        shadow-lg shadow-orange-500/25">
                      <ExternalLink size={14} />
                      Voir le projet
                    </a>
                  )}
                  {highlighted.github_url && (
                    <a href={highlighted.github_url}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5
                        rounded-full border border-border-light dark:border-border-dark
                        text-muted hover:text-text-light dark:hover:text-text-dark
                        text-sm font-medium transition-all duration-200">
                      <GitBranch size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille autres projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map(project => (
            <div key={project.id}
              className="rounded-2xl border border-border-light dark:border-border-dark
                bg-surface-light dark:bg-surface2 p-6
                hover:border-orange-500/30
                transition-all duration-300 group hover:-translate-y-1
                hover:shadow-lg hover:shadow-orange-500/5">

              {/* Image si disponible */}
              {(project.images ?? []).length > 0 && (
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4
                  border border-border-light dark:border-border-dark">
                  <img src={(project.images ?? [])[0]} alt={project.title}
                    className="w-full h-full object-cover" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${CATEGORY_COLORS[project.category ?? ''] ?? 'text-muted bg-surface-light'}`}>
                  {project.category}
                </span>
                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url}
                      target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted
                        hover:text-text-light dark:hover:text-text-dark
                        transition-colors duration-200">
                      <GitBranch size={16} />
                    </a>
                  )}
                  {project.demo_url && (
                    <a href={project.demo_url}
                      target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted
                        hover:text-orange-500 transition-colors duration-200">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-head font-bold text-lg
                text-text-light dark:text-text-dark mb-2
                group-hover:text-orange-500 transition-colors duration-200
                flex items-center gap-2">
                {project.title}
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 -translate-y-0.5" />
              </h3>

              {/* Description */}
              <p className="text-sm font-light leading-relaxed text-muted mb-4">
                {project.description}
              </p>

              {/* Documents */}
              {(project.documents?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.documents?? []).map((doc, i) => (
                    <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs
                        px-2.5 py-1 rounded-lg
                        bg-blue-700/10 text-blue-700 dark:text-blue-400
                        hover:bg-blue-700/20 transition-colors duration-200">
                      <ExternalLink size={11} />
                      {(project.document_labels ?? [])[i] || `Document ${i + 1}`}
                    </a>
                  ))}
                </div>
              )}

              {/* Tech */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                    bg-white dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-text-light dark:text-text-dark font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* AC codes */}
              {(project.skill_codes ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3
                  border-t border-border-light dark:border-border-dark">
                  {(project.skill_codes ?? []).map((code, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md
                      bg-orange-500/10 text-orange-500 font-semibold
                      border border-orange-500/20">
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}