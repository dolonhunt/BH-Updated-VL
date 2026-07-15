export function extractTemplateVars(html: string): { name: string; count: number }[] {
  const regex = /\$\{data\.([^}]+)\}/g
  const counts = new Map<string, number>()
  let match: RegExpExecArray | null
  while ((match = regex.exec(html)) !== null) {
    const name = match[1]
    counts.set(name, (counts.get(name) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
