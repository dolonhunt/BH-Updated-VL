import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, log } from '@/shared/lib/logger'

describe('logger', () => {
  beforeEach(() => {
    logger.setLevel('info')
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits info logs as JSON with message and context', () => {
    logger.info('hello', { event: 'test' })
    expect(console.log).toHaveBeenCalledTimes(1)
    const arg = (console.log as unknown as vi.Mock).mock.calls[0][0] as string
    expect(arg.startsWith('[INFO] ')).toBe(true)
    const payload = JSON.parse(arg.replace('[INFO] ', ''))
    expect(payload.message).toBe('hello')
    expect(payload.level).toBe('info')
    expect(payload.event).toBe('test')
    expect(typeof payload.timestamp).toBe('string')
  })

  it('does not emit debug logs at the default info level', () => {
    logger.debug('quiet')
    expect(console.debug).not.toHaveBeenCalled()
  })

  it('respects the configured level threshold', () => {
    logger.setLevel('error')
    logger.info('skipped')
    logger.warn('also skipped')
    logger.error('kept')
    expect(console.log).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it('logs the stack when an Error is passed in context', () => {
    logger.error('boom', { error: new Error('failure') })
    // one call for the message, one for the stack
    expect((console.error as unknown as vi.Mock).mock.calls.length).toBe(2)
    expect((console.error as unknown as vi.Mock).mock.calls[1][0]).toBe('Stack:')
  })
})

describe('log namespaces', () => {
  beforeEach(() => {
    logger.setLevel('debug')
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('document.generated logs with a document category', () => {
    log.document.generated('payslip', 'EMP1')
    const arg = (console.log as unknown as vi.Mock).mock.calls[0][0] as string
    const payload = JSON.parse(arg.replace('[INFO] ', ''))
    expect(payload.category).toBe('document')
    expect(payload.docType).toBe('payslip')
    expect(payload.empId).toBe('EMP1')
  })

  it('employee.deleted logs a warning', () => {
    log.employee.deleted('EMP9')
    const arg = (console.warn as unknown as vi.Mock).mock.calls[0][0] as string
    const payload = JSON.parse(arg.replace('[WARN] ', ''))
    expect(payload.category).toBe('employee')
    expect(payload.empId).toBe('EMP9')
  })
})
