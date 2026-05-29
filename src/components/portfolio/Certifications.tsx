import { Award, ExternalLink } from 'lucide-react'
import { useCertifications } from '../../hooks/useSupabase'

const COLORS = ['#f97316', '#049fd9', '#003189', '#16a34a', '#9333ea']

function toInitials(name: string) {
  return name.split(/[\s\-&]+/).slice(0, 3).map(w => w[0]).join('').toUpperCase().slice(0, 4)
}

interface Certification {
  id: string; year: string; title: string; issuer: string
  description: string; display_order: number; logo_url: string | null
  visible?: boolean; cert_url?: string | null
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: '1', year: '2026', title: 'Ethical Hacker', issuer: 'Cisco',
    description: 'Certification validant les compétences en cybersécurité offensive et défensive.',
    display_order: 0, logo_url: null, cert_url: null },
  { id: '2', year: '2023', title: 'Hygiène Informatique', issuer: 'ANSSI',
    description: 'Maîtrise des bonnes pratiques de sécurité informatique et de l\'hygiène numérique.',
    display_order: 1, logo_url: null, cert_url: null },
]

export default function Certifications() {
  const { data } = useCertifications()
  const certs = ((data && data.length > 0 ? data : DEFAULT_CERTIFICATIONS) as Certification[])
    .filter(c => c.visible !== false)

  if (certs.length === 0) return null

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              Certifications
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Reconnaissances<br />
            <span className="text-orange-500">officielles</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert, idx) => (
            <div key={cert.id}
              className="flex items-start gap-4 p-5 rounded-2xl
                bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark
                hover:border-orange-500/30 transition-all duration-200 group">

              {/* Logo ou badge */}
              <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden
                border border-border-light dark:border-border-dark">
                {cert.logo_url ? (
                  <img src={cert.logo_url} alt={cert.issuer}
                    className="w-full h-full object-contain p-1 bg-white dark:bg-surface2" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center
                    text-white text-xs font-black"
                    style={{ backgroundColor: COLORS[idx % COLORS.length],
                      fontFamily: "'Poppins', sans-serif" }}>
                    {toInitials(cert.issuer)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-head font-bold text-sm
                    text-text-light dark:text-text-dark
                    group-hover:text-orange-500 transition-colors leading-tight">
                    {cert.title}
                  </h3>
                  {cert.cert_url && (
                    <a href={cert.cert_url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-muted hover:text-orange-500 transition-colors flex-shrink-0">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="text-xs font-medium text-muted mb-1">{cert.issuer}</p>
                <div className="flex items-center gap-2">
                  <Award size={11} className="text-orange-500 flex-shrink-0" />
                  <span className="text-xs text-orange-500 font-semibold">{cert.year}</span>
                </div>
                {cert.description && (
                  <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
