import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

function toArr(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string' && val.length > 0) {
    if (val.startsWith('[')) {
      try { const p = JSON.parse(val); if (Array.isArray(p)) return p } catch { /* */ }
    }
    if (val.startsWith('{')) {
      return val.slice(1, -1).split(',').map(s => s.replace(/^"|"$/g, '').trim()).filter(Boolean)
    }
  }
  return []
}

export function useHero() {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single()
      if (error) throw error
      return data
    },
  })
}

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single()
      if (error) throw error
      return data
    },
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order')
      if (error) throw error
      return (data ?? []).map(p => ({
        ...p,
        tech: toArr(p.tech),
        images: toArr(p.images),
        videos: toArr(p.videos),
        documents: toArr(p.documents),
        document_labels: toArr(p.document_labels),
        skill_codes: toArr(p.skill_codes),
      }))
    },
  })
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

export function useEducations() {
  return useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educations')
        .select('*')
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

export function useHobbies() {
  return useQuery({
    queryKey: ['hobbies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hobbies')
        .select('*')
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

export function useContact() {
  return useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single()
      if (error) throw error
      return data
    },
  })
}