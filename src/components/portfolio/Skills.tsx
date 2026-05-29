import { useState } from 'react'
import { useSkills } from '../../hooks/useSupabase'
import { CheckCircle, Clock, Circle, X, ChevronRight, Server, GitBranch, Code2, Shield, Eye } from 'lucide-react'

type Domain = 'administrer' | 'connecter' | 'programmer' | 'securiser' | 'surveiller'

const DOMAINS = [
  { id: 'administrer' as Domain, Icon: Server, label: 'Administrer', color: 'orange' },
  { id: 'connecter' as Domain, Icon: GitBranch, label: 'Connecter', color: 'blue' },
  { id: 'programmer' as Domain, Icon: Code2, label: 'Programmer', color: 'orange' },
  { id: 'securiser' as Domain, Icon: Shield, label: 'Sécuriser', color: 'blue' },
  { id: 'surveiller' as Domain, Icon: Eye, label: 'Surveiller', color: 'orange' },
]

const DEFAULT_SKILLS = [
  { id: '1', domain: 'administrer', code: 'AC21.01', title: 'Routage dynamique', description: 'Configuration OSPF multi-area sur routeurs Cisco en zones distinctes avec redistribution de routes.', project_title: 'Configuration OSPF multi-area', project_description: 'Mise en place d\'un routage OSPF sur une infrastructure multi-sites avec redistribution de routes statiques.', project_status: 'done', project_achievements: ['Configuration OSPF sur 4 routeurs Cisco', 'Redistribution des routes statiques', 'Dépannage de voisinage OSPF', 'Documentation complète'], project_tech: ['Cisco IOS', 'OSPF', 'Packet Tracer', 'GNS3'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 0 },
  { id: '2', domain: 'administrer', code: 'AC21.02', title: 'QoS & Sécurité', description: 'Configuration d\'une politique QoS différenciant trafic voix, vidéo et données.', project_title: 'Politique QoS pour flux voix/données', project_description: 'Déploiement d\'une politique QoS avec classification et marquage du trafic via MQC.', project_status: 'done', project_achievements: ['Classification MQC', 'Queuing prioritaire LLQ', 'Port-security switches', 'Tests sous charge'], project_tech: ['Cisco IOS', 'MQC', 'DSCP', 'LLQ'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 1 },
  { id: '3', domain: 'administrer', code: 'AC21.03', title: 'Virtualisation', description: 'Déploiement de machines virtuelles et environnement client/serveur avec Active Directory.', project_title: 'Infrastructure virtualisée', project_description: 'Création et configuration de VMs sous VirtualBox pour simuler un environnement client/serveur.', project_status: 'wip', project_achievements: ['Windows Server 2022', 'Active Directory + GPO', 'DHCP/DNS', 'Gestion des VMs'], project_tech: ['VirtualBox', 'Windows Server', 'Active Directory'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 2 },
  { id: '4', domain: 'administrer', code: 'AC21.04', title: 'Services réseaux', description: 'Déploiement DNS, DHCP et proxy avec zones primaires/secondaires et réservations.', project_title: 'Déploiement DNS, DHCP et proxy', project_description: 'Configuration complète des services réseau essentiels avec proxy Squid.', project_status: 'done', project_achievements: ['DNS primaire/secondaire', 'DHCP avec réservations', 'Proxy Squid', 'Tests de redondance'], project_tech: ['BIND9', 'ISC DHCP', 'Squid', 'Linux Debian'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 3 },
  { id: '5', domain: 'administrer', code: 'AC21.05', title: 'Architecture Internet', description: 'Étude des architectures opérateurs, routage BGP inter-AS et organisation des AS.', project_title: 'Analyse topologie Internet & BGP', project_description: 'Étude comparative des architectures d\'opérateurs télécoms et simulation BGP.', project_status: 'done', project_achievements: ['Cartographie AS France', 'Analyse BGP Looking Glass', 'Simulation BGP GNS3', 'Rapport backbone'], project_tech: ['BGP', 'GNS3', 'Looking Glass', 'traceroute'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 4 },
  { id: '6', domain: 'administrer', code: 'AC21.06', title: 'Travail en équipe', description: 'Projet collaboratif de conception et déploiement d\'une infrastructure réseau pour PME.', project_title: 'Projet tutoré — Infrastructure PME', project_description: 'Projet en groupe de 4 : conception et déploiement d\'infrastructure réseau complète.', project_status: 'done', project_achievements: ['Gestion de projet Agile', 'Cahier des charges', 'Présentation jury', 'Git documentaire'], project_tech: ['Git', 'Packet Tracer', 'Notion'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 5 },
  { id: '7', domain: 'connecter', code: 'AC22.01', title: 'Transmissions complexes', description: 'Architecture GRE/IPsec multi-sites avec segmentation VLAN.', project_title: 'Infrastructure GRE/IPsec multi-sites', project_description: 'Architecture complète interconnectant deux sites via tunnel GRE encapsulé dans IPsec.', project_status: 'done', project_achievements: ['Topologie 2 sites', 'Routeurs de bordure', 'VLAN 802.1Q', 'Documentation flux'], project_tech: ['Cisco IOS', 'GRE', 'IPsec', 'VLAN 802.1Q'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 0 },
  { id: '8', domain: 'connecter', code: 'AC22.02', title: 'Accès distant sécurisé', description: 'Tunnel VPN IPsec IKEv1 avec AES et SHA entre deux sites distants.', project_title: 'Tunnel VPN IPsec site-à-site', project_description: 'Mise en place d\'un tunnel IPsec IKEv1 avec authentification par clé pré-partagée.', project_status: 'done', project_achievements: ['ISAKMP policy AES/SHA', 'Transform-sets et crypto maps', 'ACL trafic intéressant', 'Vérification IKE/IPsec'], project_tech: ['IPsec', 'IKEv1', 'AES-128', 'SHA-HMAC'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 1 },
  { id: '9', domain: 'connecter', code: 'AC22.03', title: 'Connexion multi-site', description: 'Tunnel GRE LAN-to-LAN transportant le trafic entre VLANs locaux et distants.', project_title: 'Tunnel GRE LAN-to-LAN', project_description: 'Déploiement d\'un tunnel GRE via ISP public avec analyse Wireshark.', project_status: 'done', project_achievements: ['Interface tunnel0', 'Routes statiques', 'Tests ping inter-sites', 'Analyse Wireshark'], project_tech: ['GRE', 'Cisco IOS', 'Wireshark'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 2 },
  { id: '10', domain: 'connecter', code: 'AC22.04', title: 'Réseaux opérateurs', description: 'Simulation réseau opérateur MPLS avec VRF et PE/CE.', project_title: 'Simulation réseau MPLS', project_description: 'Étude et simulation d\'un réseau d\'accès opérateur avec MPLS et VRF.', project_status: 'wip', project_achievements: ['MPLS LDP backbone', 'VRF par client', 'Routage BGP PE/CE'], project_tech: ['MPLS', 'VRF', 'BGP', 'GNS3'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 3 },
  { id: '11', domain: 'connecter', code: 'AC22.05', title: 'Cahier des charges', description: 'Analyse critique d\'un CDC réseau et proposition d\'architectures adaptées.', project_title: 'Analyse et réponse à un CDC réseau', project_description: 'Lecture critique d\'un CDC réseau avec proposition de 3 architectures comparées.', project_status: 'done', project_achievements: ['Exigences fonctionnelles', 'SLA et redondance', '3 architectures comparées', 'Présentation client'], project_tech: ['Packet Tracer', 'Draw.io'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 4 },
  { id: '12', domain: 'programmer', code: 'AC23.01', title: 'Scripts automatisation', description: 'Scripts Bash & Python pour backup automatique des configs Cisco et monitoring.', project_title: 'Scripts admin réseau', project_description: 'Développement de scripts d\'automatisation pour sauvegarde et surveillance.', project_status: 'done', project_achievements: ['Backup configs Cisco via SSH', 'Monitoring ping + alertes', 'Rapports HTML', 'Planification cron'], project_tech: ['Python 3', 'Bash', 'Paramiko', 'Netmiko'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 0 },
  { id: '13', domain: 'programmer', code: 'AC23.02', title: 'Développement web', description: 'Conception et développement de ce portfolio en React + TypeScript + Supabase.', project_title: 'Portfolio web — Ce site', project_description: 'Portfolio personnel avec système de gestion de contenu via Supabase.', project_status: 'done', project_achievements: ['Design system Tailwind', 'Supabase CMS', 'Animations CSS', 'Responsive mobile'], project_tech: ['React', 'TypeScript', 'Supabase', 'Tailwind'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 1 },
  { id: '14', domain: 'programmer', code: 'AC23.03', title: 'Application client/serveur', description: 'Chat TCP multi-clients en Python avec sockets et threading.', project_title: 'Chat TCP client/serveur', project_description: 'Application de messagerie en temps réel avec serveur multi-clients.', project_status: 'done', project_achievements: ['Serveur TCP multi-clients', 'Protocole JSON', 'Commandes /list /msg', 'Tests 20 clients'], project_tech: ['Python 3', 'socket', 'threading', 'JSON'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 2 },
  { id: '15', domain: 'programmer', code: 'AC23.04', title: 'Gestion de données', description: 'Base MySQL pour inventaire réseau avec interface web PHP.', project_title: 'Base de données réseau', project_description: 'Installation et administration d\'une base MySQL pour inventaire réseau.', project_status: 'done', project_achievements: ['Schéma 3NF', 'Import configs Cisco', 'Requêtes SQL complexes', 'Interface PHP'], project_tech: ['MySQL', 'PHP', 'SQL', 'PhpMyAdmin'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 3 },
  { id: '16', domain: 'programmer', code: 'AC23.05', title: 'Accès aux données', description: 'Dashboard réseau consommant une API REST NetBox en temps réel.', project_title: 'Dashboard réseau API REST', project_description: 'Application web consommant l\'API NetBox pour afficher l\'état de l\'infrastructure.', project_status: 'wip', project_achievements: ['Requêtes fetch() NetBox', 'Affichage dynamique', 'Filtres côté client'], project_tech: ['JavaScript', 'fetch API', 'REST', 'NetBox'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 4 },
  { id: '17', domain: 'securiser', code: 'AC24.01', title: 'Bonnes pratiques', description: 'Audit de sécurité avec recommandations ANSSI et CIS Benchmarks.', project_title: 'Audit de sécurité réseau', project_description: 'Audit complet sur infrastructure simulée avec recommandations ANSSI.', project_status: 'done', project_achievements: ['Inventaire services exposés', 'Guide ANSSI hardening', 'Rapport CVSS', 'Politique mots de passe'], project_tech: ['Nmap', 'ANSSI guides', 'CIS Benchmarks'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 0 },
  { id: '18', domain: 'securiser', code: 'AC24.02', title: 'Sécurisation infra', description: 'Configuration pare-feux Cisco ASA avec ACLs, NAT et inspection stateful.', project_title: 'Déploiement ASA + ACL + NAT', project_description: 'Configuration des pare-feux Cisco ASA avec niveaux de sécurité et ACLs étendues.', project_status: 'done', project_achievements: ['Interfaces outside/inside/DMZ', 'ACL OUTSIDE-IN', 'NAT exemption VPN', 'Policy-map inspection'], project_tech: ['Cisco ASA', 'ACL', 'NAT', 'IPsec'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 1 },
  { id: '19', domain: 'securiser', code: 'AC24.03', title: 'Sécurisation services', description: 'Hardening SSH, HTTPS avec Let\'s Encrypt, fail2ban et iptables.', project_title: 'Hardening SSH & services Linux', project_description: 'Sécurisation des services exposés sur serveur Linux.', project_status: 'done', project_achievements: ['SSH clés RSA 4096', 'HTTPS Let\'s Encrypt', 'fail2ban SSH/HTTP', 'iptables DROP default'], project_tech: ['Linux', 'OpenSSH', 'iptables', 'fail2ban', 'nginx'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 2 },
  { id: '20', domain: 'securiser', code: 'AC24.04', title: 'Cryptographie', description: 'Analyse comparative AES/RSA/ECDSA et PKI simplifiée avec OpenSSL.', project_title: 'Étude algorithmes crypto', project_description: 'Comparaison algorithmes chiffrement symétrique et asymétrique.', project_status: 'done', project_achievements: ['AES vs 3DES', 'OpenSSL génération clés', 'PKI CA racine', 'IPsec transform-sets'], project_tech: ['OpenSSL', 'AES', 'RSA', 'PKI'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 3 },
  { id: '21', domain: 'securiser', code: 'AC24.05', title: 'Types d\'attaques', description: 'Lab d\'attaques réseau : ARP spoofing, MitM, SYN flood, détection Snort.', project_title: 'Lab attaques réseau', project_description: 'Laboratoire d\'attaques en environnement isolé.', project_status: 'done', project_achievements: ['ARP Spoofing MitM', 'Scan Nmap', 'SYN Flood + contre-mesure', 'Détection Snort'], project_tech: ['Kali Linux', 'Ettercap', 'Nmap', 'Wireshark', 'Snort'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 4 },
  { id: '22', domain: 'securiser', code: 'AC24.06', title: 'Anglais technique', description: 'Lecture et application de RFC & datasheets en anglais.', project_title: 'RFC & documentation technique', project_description: 'Exploitation de documentation technique en anglais pour implémenter des protocoles.', project_status: 'done', project_achievements: ['RFC 2401 IPsec', 'RFC 2784 GRE', 'Release notes Cisco ASA', 'CR bilingues'], project_tech: ['RFC IETF', 'Cisco docs', 'ANSSI', 'CVE database'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 5 },
  { id: '23', domain: 'surveiller', code: 'AC25.01', title: 'Protections anti-malware', description: 'Administration des protections contre les logiciels malveillants.', project_title: 'En cours de réalisation', project_description: 'Compétence en cours de développement.', project_status: 'pending', project_achievements: [], project_tech: [], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 0 },
  { id: '24', domain: 'surveiller', code: 'AC25.02', title: 'Tests de pénétration', description: 'Pentest réseau complet : reconnaissance, scan, exploitation et rapport.', project_title: 'Pentest réseau — lab isolé', project_description: 'Test de pénétration complet sur réseau de laboratoire isolé.', project_status: 'done', project_achievements: ['Reconnaissance OSINT', 'Scan Nessus/OpenVAS', 'Exploitation CVE', 'Rapport CVSS'], project_tech: ['Kali Linux', 'Nmap', 'Nessus', 'Metasploit'], personal_note: null, difficulties: null, why_i_did_it: null, how_i_did_it: null, what_i_learned: null, what_i_would_change: null, images: null, display_order: 1 },
]

type Skill = typeof DEFAULT_SKILLS[0]

export default function Skills() {
  const { data: skillsData } = useSkills()
  const skills = (skillsData && skillsData.length > 0 ? skillsData : DEFAULT_SKILLS) as Skill[]

  const [activeDomain, setActiveDomain] = useState<Domain>('administrer')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const domainSkills = skills.filter(s => s.domain === activeDomain)
  const activeDomainData = DOMAINS.find(d => d.id === activeDomain)

  const statusConfig = (status: string | null) => {
    if (status === 'done') return { icon: <CheckCircle size={13} className="text-green-500" />, label: 'Réalisé', cls: 'text-green-600 bg-green-500/10' }
    if (status === 'wip') return { icon: <Clock size={13} className="text-orange-500" />, label: 'En cours', cls: 'text-orange-500 bg-orange-500/10' }
    return { icon: <Circle size={13} className="text-muted" />, label: 'À venir', cls: 'text-muted bg-surface-light dark:bg-surface2' }
  }

  const accentColor = activeDomainData?.color === 'orange' ? 'orange' : 'blue'

  const REFLECTIVE_FIELDS = [
    { key: 'personal_note', label: 'Ce que j\'ai fait' },
    { key: 'why_i_did_it', label: 'Pourquoi je l\'ai fait' },
    { key: 'how_i_did_it', label: 'Comment je l\'ai fait' },
    { key: 'difficulties', label: 'Mes difficultés' },
    { key: 'what_i_learned', label: 'Ce que j\'en ai appris' },
    { key: 'what_i_would_change', label: 'Ce que je ferais autrement' },
  ] as const

  return (
    <section id="skills" className="py-32 bg-surface-light dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-16">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
              Savoir-faire
            </span>
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight
            text-text-light dark:text-text-dark">
            Compétences<br />
            <span className="text-orange-500">Critiques</span>
          </h2>
        </div>

        {/* Domain tabs */}
        <div className="flex flex-wrap gap-1 mb-10 p-1
          bg-white dark:bg-surface2
          border border-border-light dark:border-border-dark
          rounded-2xl w-fit">
          {DOMAINS.map(domain => (
            <button key={domain.id}
              onClick={() => { setActiveDomain(domain.id); setSelectedSkill(null) }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${activeDomain === domain.id
                  ? domain.color === 'orange'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-blue-700 text-white shadow-lg shadow-blue-700/25'
                  : 'text-muted hover:text-text-light dark:hover:text-text-dark'
                }`}>
              <domain.Icon size={14} />
              {domain.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                ${activeDomain === domain.id
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-muted'
                }`}>
                {skills.filter(s => s.domain === domain.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainSkills.map(skill => {
            const status = statusConfig(skill.project_status)
            const hasReflective = skill.personal_note || skill.difficulties || skill.what_i_learned
            return (
              <button key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className="text-left bg-white dark:bg-surface2
                  border border-border-light dark:border-border-dark
                  rounded-2xl p-6 group
                  hover:border-orange-500/30 dark:hover:border-orange-500/30
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10
                  transition-all duration-200">

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg
                    ${accentColor === 'orange'
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'bg-blue-700/10 text-blue-700 dark:text-blue-400'
                    }`}>
                    {skill.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hasReflective && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"
                        title="Contenu réflexif disponible" />
                    )}
                    <span className={`flex items-center gap-1 text-xs font-medium
                      px-2 py-1 rounded-full ${status.cls}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Title & desc */}
                <h3 className="font-head font-bold text-base
                  text-text-light dark:text-text-dark mb-2
                  group-hover:text-orange-500 transition-colors duration-200">
                  {skill.title}
                </h3>
                <p className="text-xs font-light leading-relaxed text-muted mb-4 line-clamp-2">
                  {skill.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(skill.project_tech ?? []).slice(0, 3).map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg
                      bg-surface-light dark:bg-surface-dark
                      border border-border-light dark:border-border-dark
                      text-text-light dark:text-text-dark font-medium">
                      {t}
                    </span>
                  ))}
                  {(skill.project_tech ?? []).length > 3 && (
                    <span className="text-xs text-muted">
                      +{(skill.project_tech ?? []).length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3
                  border-t border-border-light dark:border-border-dark">
                  <span className="text-xs text-muted font-light line-clamp-1 flex-1 mr-2">
                    {skill.project_title}
                  </span>
                  <ChevronRight size={14} className="text-muted flex-shrink-0
                    group-hover:text-orange-500 group-hover:translate-x-0.5
                    transition-all duration-200" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSkill(null)}>

          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
            bg-white dark:bg-surface2 rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-surface2
              border-b border-border-light dark:border-border-dark
              px-6 py-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg
                    ${accentColor === 'orange'
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'bg-blue-700/10 text-blue-700 dark:text-blue-400'
                    }`}>
                    {selectedSkill.code}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold
                    px-3 py-1 rounded-full
                    ${statusConfig(selectedSkill.project_status).cls}`}>
                    {statusConfig(selectedSkill.project_status).icon}
                    {statusConfig(selectedSkill.project_status).label}
                  </span>
                </div>
                <h3 className="font-head font-bold text-xl
                  text-text-light dark:text-text-dark">
                  {selectedSkill.title}
                </h3>
                <p className="text-sm text-muted mt-1 font-light">
                  {selectedSkill.project_title}
                </p>
              </div>
              <button onClick={() => setSelectedSkill(null)}
                className="p-2 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark
                  text-muted hover:text-text-light dark:hover:text-text-dark
                  transition-colors duration-200 flex-shrink-0 ml-4">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Description projet */}
              <div>
                <p className="text-sm font-light leading-relaxed text-muted">
                  {selectedSkill.project_description}
                </p>
              </div>

              {/* Réalisations */}
              {(selectedSkill.project_achievements ?? []).length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold
                    mb-3 flex items-center gap-2">
                    Réalisations
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(selectedSkill.project_achievements ?? []).map((a, i) => (
                      <div key={i} className="flex items-start gap-2.5
                        text-sm text-muted font-light">
                        <CheckCircle size={14} className={`mt-0.5 flex-shrink-0
                          ${accentColor === 'orange'
                            ? 'text-orange-500' : 'text-blue-700 dark:text-blue-400'}`} />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {(selectedSkill.project_tech ?? []).length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold
                    mb-3 flex items-center gap-2">
                    Technologies
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedSkill.project_tech ?? []).map((t, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-lg
                        bg-surface-light dark:bg-surface-dark
                        border border-border-light dark:border-border-dark
                        text-text-light dark:text-text-dark font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Démarche réflexive */}
              {REFLECTIVE_FIELDS.some(f => selectedSkill[f.key]) && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold
                    mb-4 flex items-center gap-2">
                    Démarche réflexive
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REFLECTIVE_FIELDS.map(field => selectedSkill[field.key] ? (
                      <div key={field.key}
                        className="bg-surface-light dark:bg-surface-dark
                          rounded-xl p-4 border border-border-light dark:border-border-dark">
                        <p className="text-xs uppercase tracking-wider text-muted
                          font-semibold mb-2">
                          {field.label}
                        </p>
                        <p className="text-sm font-light leading-relaxed
                          text-text-light dark:text-text-dark">
                          {selectedSkill[field.key]}
                        </p>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {/* Images */}
              {(selectedSkill.images ?? []).length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold
                    mb-3 flex items-center gap-2">
                    Screenshots & traces
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(selectedSkill.images ?? []).map((img, i) => (
                      <img key={i} src={img} alt={`Screenshot ${i + 1}`}
                        className="w-full aspect-video object-cover rounded-xl
                          border border-border-light dark:border-border-dark" />
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder si pas de contenu réflexif */}
              {!REFLECTIVE_FIELDS.some(f => selectedSkill[f.key]) && (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6
                  border border-dashed border-border-light dark:border-border-dark
                  text-center">
                  <p className="text-sm text-muted font-light">
                    Contenu réflexif à compléter via le panneau d'administration
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}