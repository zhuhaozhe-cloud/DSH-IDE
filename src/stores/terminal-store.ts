import { create } from 'zustand'
import type { TerminalInstance } from '../types'

interface TerminalStoreState {
  terminals: TerminalInstance[]
  activeTerminalId: string | null
  isVisible: boolean
  height: number

  createTerminal: (name?: string) => string
  closeTerminal: (id: string) => void
  setActiveTerminal: (id: string) => void
  setVisible: (visible: boolean) => void
  toggleTerminal: () => void
  setHeight: (height: number) => void
}

let termCounter = 0

export const useTerminalStore = create<TerminalStoreState>((set, get) => ({
  terminals: [],
  activeTerminalId: null,
  isVisible: true,
  height: 200,

  createTerminal: (name) => {
    const id = `term-${++termCounter}`
    const terminal: TerminalInstance = {
      id,
      name: name ?? `终端 ${termCounter}`,
    }
    set((state) => ({
      terminals: [...state.terminals, terminal],
      activeTerminalId: id,
    }))
    return id
  },

  closeTerminal: (id) => {
    set((state) => {
      const newTerminals = state.terminals.filter((t) => t.id !== id)
      let newActive = state.activeTerminalId
      if (newActive === id) {
        newActive = newTerminals.length > 0 ? newTerminals[newTerminals.length - 1].id : null
      }
      return {
        terminals: newTerminals,
        activeTerminalId: newActive,
        isVisible: newTerminals.length > 0 ? state.isVisible : false,
      }
    })
  },

  setActiveTerminal: (id) => set({ activeTerminalId: id }),
  setVisible: (visible) => set({ isVisible: visible }),
  toggleTerminal: () => set((state) => ({ isVisible: !state.isVisible })),
  setHeight: (height) => set({ height: Math.max(100, Math.min(800, height)) }),
}))
