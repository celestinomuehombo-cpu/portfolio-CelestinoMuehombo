import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Legal() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link to="/"
          className="inline-flex items-center gap-2 text-sm text-muted
            hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft size={16} /> Retour au portfolio
        </Link>

        <h1 className="font-head font-black text-3xl md:text-4xl text-text-light dark:text-text-dark mb-10">
          Mentions légales &amp; politique de confidentialité
        </h1>

        <div className="space-y-10 text-sm font-light leading-relaxed text-muted">

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Éditeur du site
            </h2>
            <p>
              Ce site est édité par Celestino Muehombo, basé à Béthune, France.<br />
              Contact : <a href="mailto:celestinomuehombo@gmail.com" className="text-orange-500 hover:underline">celestinomuehombo@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Hébergement
            </h2>
            <p>
              Ce site est hébergé et sa base de données gérée par des prestataires tiers
              (hébergeur du site et Supabase pour le stockage des données).
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Données collectées
            </h2>
            <p className="mb-3">
              À chaque visite, la page consultée, l'adresse du site référent et les
              informations de votre navigateur (user-agent) sont enregistrées à des fins
              statistiques (mesure d'audience). Aucun cookie de suivi n'est utilisé.
            </p>
            <p>
              Si vous utilisez le formulaire de contact, votre nom, votre adresse email et
              le contenu de votre message sont transmis afin de pouvoir vous répondre. Ces
              informations ne sont ni revendues ni partagées avec des tiers à des fins
              commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
              suppression des données vous concernant. Pour l'exercer, contactez-moi à
              l'adresse ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus de ce site (textes, images, code) est la propriété de
              Celestino Muehombo, sauf mention contraire, et ne peut être reproduit sans
              autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
              Développement
            </h2>
            <p>
              Ce site a été développé par Celestino Muehombo avec l'assistance de l'IA
              Claude (Anthropic) pour la génération et la révision du code.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
