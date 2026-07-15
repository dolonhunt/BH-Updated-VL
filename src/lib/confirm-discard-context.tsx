'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { ConfirmDiscardDialog } from '@/components/forms/ConfirmDiscardDialog'

interface ConfirmDiscardState {
  message: string
  onConfirm: () => void
}

interface ConfirmDiscardContextValue {
  confirmDiscard: ConfirmDiscardState | null
  setConfirmDiscard: (state: ConfirmDiscardState | null) => void
  clearConfirmDiscard: () => void
}

const ConfirmDiscardContext = createContext<ConfirmDiscardContextValue>({
  confirmDiscard: null,
  setConfirmDiscard: () => {},
  clearConfirmDiscard: () => {},
})

export function useConfirmDiscard() {
  return useContext(ConfirmDiscardContext)
}

export function ConfirmDiscardProvider({ children }: { children: ReactNode }) {
  const [confirmDiscard, setConfirmDiscard] = useState<ConfirmDiscardState | null>(null)
  const clearConfirmDiscard = useCallback(() => setConfirmDiscard(null), [])

  return (
    <ConfirmDiscardContext.Provider value={{ confirmDiscard, setConfirmDiscard, clearConfirmDiscard }}>
      {children}
      <ConfirmDiscardDialog
        open={!!confirmDiscard}
        onConfirm={() => {
          confirmDiscard?.onConfirm()
          clearConfirmDiscard()
        }}
        onCancel={clearConfirmDiscard}
        message={confirmDiscard?.message}
      />
    </ConfirmDiscardContext.Provider>
  )
}
