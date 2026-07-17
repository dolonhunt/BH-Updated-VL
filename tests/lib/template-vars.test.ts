import { describe, it, expect } from 'vitest'
import { extractTemplateVars } from '@/lib/template-vars'

describe('extractTemplateVars', () => {
  it('returns an empty array when there are no template vars', () => {
    expect(extractTemplateVars('<p>no vars here</p>')).toEqual([])
  })

  it('extracts a single variable', () => {
    expect(extractTemplateVars('Hello ${data.name}')).toEqual([
      { name: 'name', count: 1 },
    ])
  })

  it('counts repeated occurrences of the same variable', () => {
    const html = '${data.name} and again ${data.name}'
    expect(extractTemplateVars(html)).toEqual([{ name: 'name', count: 2 }])
  })

  it('sorts variables by descending count', () => {
    const html = '${data.a} ${data.b} ${data.b} ${data.c} ${data.c} ${data.c}'
    expect(extractTemplateVars(html)).toEqual([
      { name: 'c', count: 3 },
      { name: 'b', count: 2 },
      { name: 'a', count: 1 },
    ])
  })

  it('captures dotted/nested variable paths', () => {
    expect(extractTemplateVars('${data.company.name}')).toEqual([
      { name: 'company.name', count: 1 },
    ])
  })
})
