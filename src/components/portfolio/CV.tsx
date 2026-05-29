import { useExperiences, useEducations, useCertifications } from '../../hooks/useSupabase'
import { useState } from 'react'
import { Briefcase, GraduationCap, Award } from 'lucide-react'

type TabType = 'experience' | 'education' | 'certifications'

const COLORS = ['#f97316', '#1d4ed8', '#16a34a', '#9333ea', '#0f172a', '#049fd9', '#e84040']

function toInitials(name: string) {
  return name.split(/[\s\-&]+/).slice(0, 3).map(w => w[0]).join('').toUpperCase().slice(0, 4)
}

const LogoBadge = ({ name, logoUrl, colorIndex = 0 }: {
  name: string
  logoUrl?: string | null
  colorIndex?: number
}) => (
  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0
    border border-border-light dark:border-border-dark">
    {logoUrl ? (
      <img src={logoUrl} alt={name}
        className="w-full h-full object-contain p-1 bg-white dark:bg-surface2" />
    ) : (
      <div className="w-full h-full flex items-center justify-center
        text-white text-xs font-black"
        style={{ backgroundColor: COLORS[colorIndex % COLORS.length], fontFamily: "'Poppins', sans-serif" }}>
        {toInitials(name)}
      </div>
    )}
  </div>
)

interface Experience {
  id: string; period: string; title: string; company: string
  description: string; display_order: number; logo_url: string | null
}
interface Education {
  id: string; period: string; title: string; institution: string
  description: string; display_order: number; logo_url: string | null
}
interface Certification {
  id: string; year: string; title: string; issuer: string
  description: string; display_order: number; logo_url: string | null
}

const DEFAULT_EXPERIENCES: Experience[] = [
  { id: '1', period: 'Avril — Mai 2026', title: 'Stagiaire Technicien Réseaux & Systèmes',
    company: 'Fédération ADMR du Pas-de-Calais',
    description: 'Déploiement automatisé de 22+ postes Windows 11 Pro via infrastructure MDT/WDS (PXE BIOS/UEFI) sur Windows Server 2022, avec scripts Batch de personnalisation par adresse MAC. Configuration et sécurisation d\'une infrastructure réseau multi-sites réelle : pare-feu pfSense Netgate 2100, VPN IPsec AES-256-GCM, switch HPE Aruba Instant On 1830, points d\'accès AP22, pfBlockerNG (16 992 IP + 83 328 domaines bloqués) et Suricata IDS/IPS (réduction de 1 428 989 alertes à 12 après calibration). Configuration de la téléphonie IP 3CX — terminaux Fanvil X4U-V2, SBC, groupe d\'appels et règles de traitement des appels.',
    display_order: 0, logo_url: null },
  { id: '2', period: '2019 — 2023', title: 'Tuteur particulier',
    company: 'À domicile — Angola',
    description: 'Tutorat d\'élèves en difficulté académique en Mathématiques, Physique, Chimie et Biologie.',
    display_order: 1, logo_url: null },
]

const DEFAULT_EDUCATIONS: Education[] = [
  { id: '1', period: '2023 — présent', title: 'BUT Réseaux & Télécommunications — Parcours Cybersécurité',
    institution: 'IUT de Béthune — Université d\'Artois',
    description: 'Formation approfondie en architecture réseau, sécurité informatique, administration systèmes et développement. Groupe A1.',
    display_order: 0, logo_url: null },
  { id: '2', period: 'Février — Août 2023', title: 'Formation Français Langue Étrangère',
    institution: 'IUT de Longwy — France',
    description: 'Formation intensive en français académique et professionnel pour étudiants étrangers.',
    display_order: 1, logo_url: null },
  { id: '3', period: '2019 — 2022', title: 'Baccalauréat — Sciences Physiques et Biologiques',
    institution: 'Lycée Eiffel d\'Ondjiva — Angola',
    description: 'Spécialité en sciences physiques et biologiques.',
    display_order: 2, logo_url: null },
]

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: '1', year: '2026', title: 'Ethical Hacker', issuer: 'Cisco',
    description: 'Certification validant les compétences en cybersécurité offensive et défensive.',
    display_order: 0, logo_url: null },
  { id: '2', year: '2023', title: 'Hygiène Informatique', issuer: 'ANSSI',
    description: 'Maîtrise des bonnes pratiques de sécurité informatique et de l\'hygiène numérique.',
    display_order: 1, logo_url: null },
]

export default function CV() {
  const [activeTab, setActiveTab] = useState<TabType>('experience')
  const { data: experiences, isLoading: loadExp } = useExperiences()
  const { data: educations, isLoading: loadEdu } = useEducations()
  const { data: certifications, isLoading: loadCert } = useCertifications()

  const tabs = [
    { id: 'experience' as TabType, label: 'Expériences', icon: Briefcase },
    { id: 'education' as TabType, label: 'Formations', icon: GraduationCap },
    { id: 'certifications' as TabType, label: 'Certifications', icon: Award },
  ]

  const expData: Experience[]  = (!loadExp  && experiences  && experiences.length  > 0 ? experiences  : loadExp  ? [] : DEFAULT_EXPERIENCES)  as Experience[]
  const eduData: Education[]   = (!loadEdu  && educations   && educations.length   > 0 ? educations   : loadEdu  ? [] : DEFAULT_EDUCATIONS)   as Education[]
  const certData: Certification[] = (!loadCert && certifications && certifications.length > 0 ? certifications : loadCert ? [] : DEFAULT_CERTIFICATIONS) as Certification[]

  return (
    <section id="cv" className="py-32 bg-surface-light dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              Mon parcours
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Expériences &<br />
            <span className="text-orange-500">Formations</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-12 p-1 bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark
          rounded-full w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full
                  text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-muted hover:text-text-light dark:hover:text-text-dark'
                  }`}>
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px
            bg-border-light dark:bg-border-dark" />

          {/* Expériences */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {expData.map((exp, idx) => (
                <div key={exp.id} className="relative pl-16">
                  <div className="absolute left-0 top-2">
                    <LogoBadge
                      name={exp.company}
                      logoUrl={exp.logo_url}
                      colorIndex={idx}
                    />
                  </div>
                  <div className="bg-white dark:bg-surface2
                    border border-border-light dark:border-border-dark
                    rounded-2xl p-6 hover:border-orange-500/30
                    transition-colors duration-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-head font-bold text-lg
                          text-text-light dark:text-text-dark mb-1">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-medium text-muted">{exp.company}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider
                        text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full
                        whitespace-nowrap flex-shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-muted">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formations */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {eduData.map((edu, idx) => (
                <div key={edu.id} className="relative pl-16">
                  <div className="absolute left-0 top-2">
                    <LogoBadge
                      name={edu.institution}
                      logoUrl={edu.logo_url}
                      colorIndex={idx + 2}
                    />
                  </div>
                  <div className="bg-white dark:bg-surface2
                    border border-border-light dark:border-border-dark
                    rounded-2xl p-6 hover:border-blue-700/30
                    transition-colors duration-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-head font-bold text-lg
                          text-text-light dark:text-text-dark mb-1">
                          {edu.title}
                        </h3>
                        <p className="text-sm font-medium text-muted">{edu.institution}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider
                        text-blue-700 dark:text-blue-400 bg-blue-700/10 px-3 py-1.5
                        rounded-full whitespace-nowrap flex-shrink-0">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-muted">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              {certData.map((cert, idx) => (
                <div key={cert.id} className="relative pl-16">
                  <div className="absolute left-0 top-2">
                    <LogoBadge
                      name={cert.issuer}
                      logoUrl={cert.logo_url}
                      colorIndex={idx + 1}
                    />
                  </div>
                  <div className="bg-white dark:bg-surface2
                    border border-border-light dark:border-border-dark
                    rounded-2xl p-6 hover:border-orange-500/30
                    transition-colors duration-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-head font-bold text-lg
                          text-text-light dark:text-text-dark mb-1">
                          {cert.title}
                        </h3>
                        <p className="text-sm font-medium text-muted">{cert.issuer}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider
                        text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full
                        whitespace-nowrap flex-shrink-0">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-muted">
                      {cert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}