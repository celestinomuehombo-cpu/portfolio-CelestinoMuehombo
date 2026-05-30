export function toArr(val: unknown): string[] {
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
