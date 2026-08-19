import { create } from 'zustand'
import type { SidebarPanel, BottomPanel } from '../types'

interface UIStoreState {
  // Sidebar
  sidebarVisible: boolean
  sidebarWidth: number
  sidebarPanel: SidebarPanel

  // Bottom panel
  bottomPanelVisible: boolean
  bottomPanelHeight: number
  bottomPanel: BottomPanel

  // Command palette
  commandPaletteVisible: boolean
  quickOpenVisible: boolean

  // Notifications
  notifications: Notification[]

  // Actions
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setSidebarPanel: (panel: SidebarPanel) => void
  toggleBottomPanel: () => void
  setBottomPanelHeight: (height: number) => void
  setBottomPanel: (panel: BottomPanel) => void
  toggleCommandPalette: () => void
  toggleQuickOpen: () => void
  showNotification: (message: string, type?: 'info' | 'warning' | 'error') => void
  dismissNotification: (id: string) => void
}

export interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error'
  timestamp: number
}

let notifCounter = 0

export const useUIStore = create<UIStoreState>((set, get) => ({
  sidebarVisible: true,
  sidebarWidth: 250,
  sidebarPanel: 'explorer',

  bottomPanelVisible: true,
  bottomPanelHeight: 200,
  bottomPanel: 'terminal',

  commandPaletteVisible: false,
  quickOpenVisible: false,

  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  setSidebarWidth: (width) => set({ sidebarWidth: Math.max(150, Math.min(500, width)) }),
  setSidebarPanel: (panel) => {
    const state = get()
    if (state.sidebarPanel === panel && state.sidebarVisible) {
      set({ sidebarVisible: false })
    } else {
      set({ sidebarPanel: panel, sidebarVisible: true })
    }
  },

  toggleBottomPanel: () => set((state) => ({ bottomPanelVisible: !state.bottomPanelVisible })),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: Math.max(100, Math.min(800, height)) }),
  setBottomPanel: (panel) => {
    const state = get()
    if (state.bottomPanel === panel && state.bottomPanelVisible) {
      set({ bottomPanelVisible: false })
    } else {
      set({ bottomPanel: panel, bottomPanelVisible: true })
    }
  },

  toggleCommandPalette: () => set((state) => ({
    commandPaletteVisible: !state.commandPaletteVisible,
    quickOpenVisible: false,
  })),
  toggleQuickOpen: () => set((state) => ({
    quickOpenVisible: !state.quickOpenVisible,
    commandPaletteVisible: false,
  })),

  showNotification: (message, type = 'info') => {
    const id = `notif-${++notifCounter}`
    set((state) => ({
      notifications: [...state.notifications, { id, message, type, timestamp: Date.now() }],
    }))
    // Auto dismiss after 5s
    setTimeout(() => get().dismissNotification(id), 5000)
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
