import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAnalytics() {
  useEffect(() => {
    void (async () => {
      try {
        await supabase.from('page_views').insert({
          path: window.location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })
      } catch {
        // ignore analytics failures
      }
    })()
  }, [])
}
