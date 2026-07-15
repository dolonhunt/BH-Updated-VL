export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  rules: Record<string, { required?: boolean; min?: number; label?: string }>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [field, rule] of Object.entries(rules)) {
    const val = data[field]
    if (rule.required) {
      if (typeof val === 'string' && !val.trim()) {
        errors[field] = `${rule.label || field} is required`
      } else if (typeof val === 'number' && (isNaN(val) || val <= 0)) {
        errors[field] = `${rule.label || field} must be > 0`
      }
    }
    if (rule.min !== undefined && typeof val === 'number' && val < rule.min) {
      errors[field] = `${rule.label || field} must be at least ${rule.min}`
    }
  }
  return errors
}
