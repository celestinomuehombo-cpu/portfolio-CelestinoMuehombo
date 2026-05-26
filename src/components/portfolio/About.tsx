import { MapPin, Calendar, Code, Languages } from 'lucide-react'
import { useAbout } from '../../hooks/useSupabase'

export default function About() {
  const { data: about, isLoading } = useAbout()

  const defaultData = {
    description_1: "Étudiant angolais en BUT Réseaux & Télécommunications à l'IUT de Béthune, je me distingue par un profil éclectique : passionné de philosophie, de musique et d'écriture, je crois que la curiosité intellectuelle est le moteur de toute excellence technique.",
    description_2: "En parallèle de mes études, je fonde Tangisa — une plateforme éducative pour le marché angolais connectant élèves et tuteurs vérifiés. Ce projet entrepreneurial, que je mène depuis la France, traduit ma conviction qu'on peut construire des solutions concrètes pour l'Afrique avec les outils du numérique.",
    location: 'France',
    availability: 'Alternance — Septembre 2026',
    specialty: 'Réseaux & Télécommunications — Cybersécurité',
    languages: ['Français (courant)', 'Portugais (courant)', 'Anglais (intermédiaire)'],
    photo_url: null,
  }

  const data = isLoading ? defaultData : (about ?? defaultData)

  return (
    <section id="about" className="py-32 bg-white dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              À propos de moi
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Étudiant en Réseaux &<br />
            <span className="text-orange-500">Télécommunications</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Coluna esquerda — foto */}
          <div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden
                bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark">
                {data.photo_url ? (
                  <img
                    src={data.photo_url}
                    alt="Celestino MUEHOMBO"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center
                    bg-gradient-to-br from-orange-500/10 to-blue-700/10">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-orange-500/20
                        flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-black text-orange-500"
                          style={{ fontFamily: "'Poppins', sans-serif" }}>
                          CM
                        </span>
                      </div>
                      <p className="text-sm text-muted">Photo à ajouter</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Badge */}
              <div className="absolute -bottom-4 -right-4
                bg-orange-500 text-white rounded-2xl px-5 py-4
                shadow-lg shadow-orange-500/30">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Disponible
                </p>
                <p className="text-sm font-black">Sept. 2026</p>
              </div>
            </div>
          </div>

          {/* Coluna direita — texto + info cards */}
          <div className="space-y-8">

            {/* Textos */}
            <div className="space-y-6">
              <p className="text-lg font-light leading-relaxed text-muted">
                {data.description_1}
              </p>
              <p className="text-lg font-light leading-relaxed text-muted">
                {data.description_2}
              </p>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-orange-500" />
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Localisation
                  </span>
                </div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
                  {data.location}
                </p>
              </div>

              <div className="bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-orange-500" />
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Disponibilité
                  </span>
                </div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
                  {data.availability}
                </p>
              </div>

              <div className="bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={14} className="text-orange-500" />
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Spécialité
                  </span>
                </div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
                  {data.specialty}
                </p>
              </div>

              <div className="bg-surface-light dark:bg-surface2
                border border-border-light dark:border-border-dark
                rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Languages size={14} className="text-orange-500" />
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Langues
                  </span>
                </div>
                <div className="space-y-1">
                  {(data.languages ?? []).map((lang: string, i: number) => (
                    <p key={i} className="text-sm font-medium text-text-light dark:text-text-dark">
                      {lang}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}