import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toArr } from '../lib/utils'
import { ArrowLeft, ExternalLink, GitBranch, Play, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

interface Project {
  id: string; title: string; description: string; tech: string[] | null
  github_url: string | null; demo_url: string | null; image_url: string | null
  images?: string[] | null; videos?: string[] | null
  documents?: string[] | null; document_labels?: string[] | null
  status: string; category: string; skill_codes?: string[] | null
}

const STATUS: Record<string, { label: string; cls: string }> = {
  wip:  { label: 'En cours', cls: 'text-orange-500 bg-orange-500/10' },
  done: { label: 'Réalisé',  cls: 'text-green-600 bg-green-500/10' },
}

function ytId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)?.[1] ?? null
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase.from('projects').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setProject({
            ...data,
            tech: toArr(data.tech),
            images: toArr(data.images),
            videos: toArr(data.videos),
            documents: toArr(data.documents),
            document_labels: toArr(data.document_labels),
            skill_codes: toArr(data.skill_codes),
          })
        } else {
          setProject(null)
        }
        setLoading(false)
      }, () => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center gap-4">
      <p className="text-muted">Projet introuvable.</p>
      <Link to="/" className="text-orange-500 hover:underline text-sm">← Retour au portfolio</Link>
    </div>
  )

  const tech      = project.tech ?? []
  const images    = project.images ?? []
  const videos    = project.videos ?? []
  const documents = project.documents ?? []
  const labels    = project.document_labels ?? []
  const codes     = project.skill_codes ?? []
  const status    = STATUS[project.status] ?? STATUS.done
  const cover     = images.length > 0 ? images[imgIndex] : project.image_url

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link to="/"
          className="inline-flex items-center gap-2 text-sm text-muted
            hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft size={16} /> Retour au portfolio
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-orange-500 bg-orange-500/10">
              {project.category}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.cls}`}>
              {status.label}
            </span>
          </div>
          <h1 className="font-head font-black text-3xl md:text-5xl text-text-light dark:text-text-dark mb-4">
            {project.title}
          </h1>
          <p className="text-lg font-light leading-relaxed text-muted max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Galerie */}
        {cover && (
          <div className="mb-8">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border-light dark:border-border-dark mb-3">
              <img src={cover} alt={project.title} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setImgIndex(i => Math.max(0, i - 1))} disabled={imgIndex === 0}
                  className="p-2 rounded-xl border border-border-light dark:border-border-dark text-muted hover:text-orange-500 disabled:opacity-30 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-2 flex-1 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all
                        ${i === imgIndex ? 'border-orange-500' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))} disabled={imgIndex === images.length - 1}
                  className="p-2 rounded-xl border border-border-light dark:border-border-dark text-muted hover:text-orange-500 disabled:opacity-30 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        {tech.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-muted font-semibold mb-3 flex items-center gap-2">
              Technologies <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            </h2>
            <div className="flex flex-wrap gap-2">
              {tech.map((t, i) => (
                <span key={i} className="text-sm px-3 py-1.5 rounded-xl
                  bg-surface-light dark:bg-surface2
                  border border-border-light dark:border-border-dark
                  text-text-light dark:text-text-dark font-medium">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Vidéos */}
        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-muted font-semibold mb-3 flex items-center gap-2">
              Vidéos <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            </h2>
            <div className="space-y-4">
              {videos.map((v, i) => {
                const id = ytId(v)
                return id ? (
                  <div key={i} className="w-full aspect-video rounded-2xl overflow-hidden border border-border-light dark:border-border-dark">
                    <iframe src={`https://www.youtube.com/embed/${id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="w-full h-full" />
                  </div>
                ) : (
                  <a key={i} href={v} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border-light dark:border-border-dark text-sm text-text-light dark:text-text-dark hover:border-orange-500/40 transition-colors">
                    <Play size={14} className="text-orange-500" /> Voir la vidéo
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-muted font-semibold mb-3 flex items-center gap-2">
              Documents <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            </h2>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc, i) => (
                <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700/10 text-blue-700 dark:text-blue-400 border border-blue-700/20 hover:bg-blue-700/20 transition-colors text-sm">
                  <FileText size={14} />
                  {labels[i] || `Document ${i + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ACs */}
        {codes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-muted font-semibold mb-3 flex items-center gap-2">
              Compétences démontrées <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            </h2>
            <div className="flex flex-wrap gap-2">
              {codes.map((code, i) => (
                <span key={i} className="text-sm px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 font-semibold border border-orange-500/20">
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Liens */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light dark:border-border-dark">
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5">
              <ExternalLink size={16} /> Voir le projet
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-light dark:border-border-dark text-muted hover:text-text-light dark:hover:text-text-dark font-medium transition-all duration-200">
              <GitBranch size={16} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
