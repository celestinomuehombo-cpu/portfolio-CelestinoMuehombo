import { useState } from 'react'
import { ExternalLink, GitBranch, ArrowUpRight, X, Play, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/useSupabase'
import SectionSkeleton from '../ui/SectionSkeleton'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  github_url: string | null
  demo_url: string | null
  image_url: string | null
  images?: string[]
  videos?: string[]
  documents?: string[]
  document_labels?: string[]
  status: string
  display_order: number
  category: string
  highlight: boolean
  skill_codes?: string[]
  visible?: boolean
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1', title: 'Tangisa',
    description: 'Plateforme marketplace éducative pour le marché angolais connectant élèves et tuteurs vérifiés. Système de vérification en 4 étapes, dashboard parental en temps réel, 2 plans d\'abonnement.',
    tech: ['React', 'TypeScript', 'Supabase', 'Flutterwave', 'Netlify'],
    github_url: null, demo_url: null, image_url: null, images: [], videos: [], documents: [], document_labels: [],
    status: 'wip', display_order: 0, category: 'Entrepreneuriat', highlight: true,
  },
  {
    id: '2', title: 'Portfolio Personnel',
    description: 'Ce portfolio — conçu et développé from scratch avec React, TypeScript et Tailwind. Système de gestion de contenu via Supabase avec panneau admin.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null, images: [], videos: [], documents: [], document_labels: [],
    status: 'done', display_order: 1, category: 'Web', highlight: false,
  },
  {
    id: '3', title: 'Infrastructure GRE/IPsec Multi-sites',
    description: 'Architecture réseau complète interconnectant deux sites via tunnel GRE encapsulé dans IPsec. Segmentation VLAN, pare-feux ASA, routage OSPF.',
    tech: ['Cisco IOS', 'GRE', 'IPsec', 'OSPF', 'Packet Tracer'],
    github_url: null, demo_url: null, image_url: null, images: [], videos: [], documents: [], document_labels: [],
    status: 'done', display_order: 2, category: 'Réseaux', highlight: false,
  },
  {
    id: '4', title: 'Chat TCP Client/Serveur',
    description: 'Application de messagerie en temps réel utilisant des sockets TCP. Serveur multi-clients avec threading, protocole applicatif JSON.',
    tech: ['Python 3', 'socket', 'threading', 'JSON'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null, images: [], videos: [], documents: [], document_labels: [],
    status: 'done', display_order: 3, category: 'Programmation', highlight: false,
  },
  {
    id: '5', title: 'Scripts Admin Réseau',
    description: 'Suite de scripts d\'automatisation pour backup des configs Cisco via SSH, monitoring de disponibilité avec alertes email et génération de rapports HTML.',
    tech: ['Python 3', 'Bash', 'Paramiko', 'Netmiko', 'cron'],
    github_url: 'https://github.com/celestinomuehombo-cpu', demo_url: null, image_url: null, images: [], videos: [], documents: [], document_labels: [],
    status: 'done', display_order: 4, category: 'Automatisation', highlight: false,
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

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  wip:     { label: 'En cours',  cls: 'text-orange-500 bg-orange-500/10' },
  done:    { label: 'Réalisé',   cls: 'text-green-600 bg-green-500/10' },
  pending: { label: 'À venir',   cls: 'text-muted bg-surface-light dark:bg-surface2' },
}

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return m ? m[1] : null
}

function VideoEmbed({ url }: { url: string }) {
  const ytId = getYoutubeId(url)
  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-3 rounded-xl
        border border-border-light dark:border-border-dark
        bg-surface-light dark:bg-surface-dark
        text-sm text-text-light dark:text-text-dark
        hover:border-orange-500/40 transition-colors">
      <Play size={14} className="text-orange-500" />
      Voir la vidéo
    </a>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.images ?? []
  const videos = project.videos ?? []
  const documents = project.documents ?? []
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.done

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto
        bg-white dark:bg-surface2 rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-surface2
          border-b border-border-light dark:border-border-dark px-6 py-4
          flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                ${CATEGORY_COLORS[project.category] ?? 'text-muted bg-surface-light'}`}>
                {project.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
                {status.label}
              </span>
            </div>
            <h3 className="font-head font-bold text-xl text-text-light dark:text-text-dark truncate">
              {project.title}
            </h3>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-full text-muted hover:text-text-light dark:hover:text-text-dark
              hover:bg-surface-light dark:hover:bg-surface-dark transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Cover / galerie */}
          {(project.image_url || images.length > 0) && (
            <div>
              {/* Image principale */}
              <div className="w-full aspect-video rounded-xl overflow-hidden
                border border-border-light dark:border-border-dark mb-2 bg-surface-light dark:bg-surface-dark">
                <img
                  src={images.length > 0 ? images[imgIndex] : project.image_url!}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                    disabled={imgIndex === 0}
                    className="p-1.5 rounded-lg border border-border-light dark:border-border-dark
                      text-muted hover:text-orange-500 disabled:opacity-30 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-2 flex-1 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all
                          ${i === imgIndex
                            ? 'border-orange-500'
                            : 'border-border-light dark:border-border-dark opacity-60 hover:opacity-100'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))}
                    disabled={imgIndex === images.length - 1}
                    className="p-1.5 rounded-lg border border-border-light dark:border-border-dark
                      text-muted hover:text-orange-500 disabled:opacity-30 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm font-light leading-relaxed text-muted">
            {project.description}
          </p>

          {/* Technologies */}
          {(project.tech ?? []).length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-semibold mb-2
                flex items-center gap-2">
                Technologies
                <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </p>
              <div className="flex flex-wrap gap-2">
                {(project.tech ?? []).map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    text-text-light dark:text-text-dark font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vidéos */}
          {videos.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-semibold mb-3
                flex items-center gap-2">
                Vidéos
                <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </p>
              <div className="space-y-3">
                {videos.map((v, i) => <VideoEmbed key={i} url={v} />)}
              </div>
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-semibold mb-2
                flex items-center gap-2">
                Documents
                <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </p>
              <div className="flex flex-wrap gap-2">
                {documents.map((doc, i) => (
                  <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                      bg-blue-700/10 text-blue-700 dark:text-blue-400
                      border border-blue-700/20 hover:bg-blue-700/20 transition-colors">
                    <FileText size={12} />
                    {(project.document_labels ?? [])[i] || `Document ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Compétences AC */}
          {(project.skill_codes ?? []).length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-semibold mb-2
                flex items-center gap-2">
                Compétences démontrées
                <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(project.skill_codes ?? []).map((code, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                    bg-orange-500/10 text-orange-500 font-semibold
                    border border-orange-500/20">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Liens */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium
                  transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/25">
                <ExternalLink size={14} /> Voir le projet
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                  border border-border-light dark:border-border-dark
                  text-muted hover:text-text-light dark:hover:text-text-dark
                  text-sm font-medium transition-all duration-200">
                <GitBranch size={14} /> GitHub
              </a>
            )}
            <Link to={`/projects/${project.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                border border-orange-500/40 text-orange-500
                hover:bg-orange-500/10 text-sm font-medium transition-all duration-200">
              <ArrowUpRight size={14} /> Page dédiée
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { data: projectsData, isLoading, isError } = useProjects()

  if (isLoading) return (
    <section id="projects" className="py-32 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">
        <SectionSkeleton lines={3} />
      </div>
    </section>
  )

  const projects = (projectsData && projectsData.length > 0
    ? projectsData
    : (isError || projectsData !== undefined) ? DEFAULT_PROJECTS : []
  ) as Project[]

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const visible = projects.filter(p => p.visible !== false)
  const highlighted = visible.find(p => p.highlight)
  const others = visible.filter(p => !p.highlight)

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
          <button onClick={() => setSelectedProject(highlighted)}
            className="w-full mb-8 rounded-2xl overflow-hidden border text-left
              border-border-light dark:border-border-dark
              bg-gradient-to-br from-orange-500/5 to-blue-700/5
              hover:border-orange-500/30 transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Image / logo */}
              <div className="aspect-video lg:aspect-auto min-h-[280px]
                bg-gradient-to-br from-orange-500/15 to-blue-700/15
                flex items-center justify-center relative overflow-hidden">
                {(highlighted.image_url || (highlighted.images ?? []).length > 0) ? (
                  <img
                    src={highlighted.image_url ?? (highlighted.images ?? [])[0]}
                    alt={highlighted.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-orange-500
                      flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                      <span className="text-white font-black text-2xl"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {highlighted.title[0]}
                      </span>
                    </div>
                    <p className="text-sm text-muted font-medium">{highlighted.title}</p>
                  </div>
                )}
                {/* badge galerie */}
                {(highlighted.images ?? []).length > 1 && (
                  <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white
                    px-2 py-1 rounded-lg backdrop-blur-sm">
                    +{(highlighted.images ?? []).length - 1} photos
                  </span>
                )}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-orange-500/10" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-700/10" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                      ${CATEGORY_COLORS[highlighted.category] ?? 'text-muted bg-surface-light'}`}>
                      {highlighted.category}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                      flex items-center gap-1.5
                      ${STATUS_CONFIG[highlighted.status]?.cls ?? 'text-muted bg-surface-light'}`}>
                      {highlighted.status === 'wip' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      )}
                      {STATUS_CONFIG[highlighted.status]?.label ?? highlighted.status}
                    </span>
                  </div>
                  <h3 className="font-head font-black text-2xl text-text-light dark:text-text-dark mb-3">
                    {highlighted.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-muted mb-4 line-clamp-3">
                    {highlighted.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(highlighted.tech ?? []).map((t, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                        bg-surface-light dark:bg-surface2
                        border border-border-light dark:border-border-dark
                        text-text-light dark:text-text-dark font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* Médias disponibles */}
                  <div className="flex items-center gap-3 text-xs text-muted">
                    {(highlighted.images ?? []).length > 0 && (
                      <span>{(highlighted.images ?? []).length} photo(s)</span>
                    )}
                    {(highlighted.videos ?? []).length > 0 && (
                      <span>{(highlighted.videos ?? []).length} vidéo(s)</span>
                    )}
                    {(highlighted.documents ?? []).length > 0 && (
                      <span>{(highlighted.documents ?? []).length} document(s)</span>
                    )}
                    {(highlighted.skill_codes ?? []).length > 0 && (
                      <span className="text-orange-500">
                        {(highlighted.skill_codes ?? []).length} AC liée(s)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-orange-500 font-medium
                    group-hover:underline transition-all">
                    Voir le projet →
                  </span>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Grille autres projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map(project => {
            const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.done
            const thumb = project.image_url ?? (project.images ?? [])[0]
            return (
              <button key={project.id}
                onClick={() => setSelectedProject(project)}
                className="text-left rounded-2xl border border-border-light dark:border-border-dark
                  bg-surface-light dark:bg-surface2 p-6
                  hover:border-orange-500/30 transition-all duration-300 group
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5">

                {/* Thumbnail */}
                {thumb && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-4
                    border border-border-light dark:border-border-dark">
                    <img src={thumb} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                    ${CATEGORY_COLORS[project.category] ?? 'text-muted bg-surface-light'}`}>
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {(project.videos ?? []).length > 0 && (
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Play size={10} /> {(project.videos ?? []).length}
                      </span>
                    )}
                    {(project.images ?? []).length > 1 && (
                      <span className="text-xs text-muted">
                        +{(project.images ?? []).length - 1} imgs
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <h3 className="font-head font-bold text-base
                  text-text-light dark:text-text-dark mb-2
                  group-hover:text-orange-500 transition-colors duration-200
                  flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100
                    transition-opacity duration-200 flex-shrink-0" />
                </h3>

                <p className="text-xs font-light leading-relaxed text-muted mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(project.tech ?? []).slice(0, 4).map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg
                      bg-white dark:bg-surface-dark
                      border border-border-light dark:border-border-dark
                      text-text-light dark:text-text-dark font-medium">
                      {t}
                    </span>
                  ))}
                  {(project.tech ?? []).length > 4 && (
                    <span className="text-xs text-muted px-1">+{(project.tech ?? []).length - 4}</span>
                  )}
                </div>

                {/* AC codes */}
                {(project.skill_codes ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3
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
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal de détail */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}
