export interface HeroContent {
  id: string
  badge: string
  name: string
  tagline: string
  availability: string
  cv_url: string | null
  updated_at: string
}

export interface About {
  id: string
  description_1: string
  description_2: string
  location: string
  availability: string
  specialty: string
  languages: string[]
  photo_url: string | null
  updated_at: string
}

export interface Skill {
  id: string
  domain: string
  domain_icon: string
  code: string
  title: string
  description: string
  project_title: string | null
  project_description: string | null
  project_status: 'done' | 'wip' | 'pending' | null
  project_achievements: string[] | null
  project_tech: string[] | null
  project_link: string | null
  display_order: number
  updated_at: string
}

export interface Project {
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
  skill_codes?: string[]
  status: 'done' | 'wip' | 'pending'
  category: string
  highlight: boolean
  visible?: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  period: string
  title: string
  company: string
  description: string
  display_order: number
  updated_at: string
}

export interface Education {
  id: string
  period: string
  title: string
  institution: string
  description: string
  display_order: number
  updated_at: string
}

export interface Certification {
  id: string
  year: string
  title: string
  issuer: string
  description: string
  display_order: number
  updated_at: string
}

export interface Hobby {
  id: string
  title: string
  description: string
  image_url: string | null
  display_order: number
  updated_at: string
}

export interface Contact {
  id: string
  email: string
  linkedin_url: string | null
  github_url: string | null
  whatsapp: string | null
  updated_at: string
}