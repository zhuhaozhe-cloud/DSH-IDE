import { create } from 'zustand'
import type { EditorGroup, Tab } from '../types'

interface EditorState {
  groups: EditorGroup[]
  activeGroupId: string

  // Tab operations
  openFile: (filePath: string, fileName: string, content: string, language?: string) => void
  closeTab: (groupId: string, tabId: string) => void
  setActiveTab: (groupId: string, tabId: string) => void
  setTabDirty: (tabId: string, dirty: boolean) => void
  updateTabContent: (tabId: string, content: string) => void

  // Group operations
  splitEditor: (direction: 'horizontal' | 'vertical') => void
  closeGroup: (groupId: string) => void
  setActiveGroup: (groupId: string) => void
}

let tabCounter = 0

const detectLanguage = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescriptreact',
    js: 'javascript',
    jsx: 'javascriptreact',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    md: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    ps1: 'powershell',
    dockerfile: 'dockerfile',
    toml: 'toml',
    ini: 'ini',
    env: 'plaintext',
    txt: 'plaintext',
    vue: 'vue',
    svelte: 'svelte',
  }
  return map[ext] ?? 'plaintext'
}

export const useEditorStore = create<EditorState>((set, get) => ({
  groups: [
    {
      id: 'main',
      tabs: [],
      activeTabId: null,
    },
  ],
  activeGroupId: 'main',

  openFile: (filePath, fileName, content, language) => {
    const lang = language ?? detectLanguage(filePath)
    const state = get()
    const group = state.groups.find((g) => g.id === state.activeGroupId)
    if (!group) return

    // Check if tab already exists
    const existing = group.tabs.find((t) => t.filePath === filePath)
    if (existing) {
      set({
        groups: state.groups.map((g) =>
          g.id === state.activeGroupId
            ? { ...g, activeTabId: existing.id }
            : g
        ),
      })
      return
    }

    const tab: Tab = {
      id: `tab-${++tabCounter}`,
      filePath,
      fileName,
      language: lang,
      isDirty: false,
      content,
    }

    set({
      groups: state.groups.map((g) =>
        g.id === state.activeGroupId
          ? { ...g, tabs: [...g.tabs, tab], activeTabId: tab.id }
          : g
      ),
    })
  },

  closeTab: (groupId, tabId) => {
    const state = get()
    set({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g
        const newTabs = g.tabs.filter((t) => t.id !== tabId)
        let newActive = g.activeTabId
        if (newActive === tabId) {
          newActive = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
        }
        return { ...g, tabs: newTabs, activeTabId: newActive }
      }),
    })
  },

  setActiveTab: (groupId, tabId) => {
    const state = get()
    set({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, activeTabId: tabId } : g
      ),
      activeGroupId: groupId,
    })
  },

  setTabDirty: (tabId, dirty) => {
    const state = get()
    set({
      groups: state.groups.map((g) => ({
        ...g,
        tabs: g.tabs.map((t) => (t.id === tabId ? { ...t, isDirty: dirty } : t)),
      })),
    })
  },

  updateTabContent: (tabId, content) => {
    const state = get()
    set({
      groups: state.groups.map((g) => ({
        ...g,
        tabs: g.tabs.map((t) => (t.id === tabId ? { ...t, content } : t)),
      })),
    })
  },

  splitEditor: (direction) => {
    const state = get()
    const newGroup: EditorGroup = {
      id: `group-${Date.now()}`,
      tabs: [],
      activeTabId: null,
    }
    set({
      groups: [...state.groups, newGroup],
      activeGroupId: newGroup.id,
    })
  },

  closeGroup: (groupId) => {
    const state = get()
    if (state.groups.length <= 1) return
    const newGroups = state.groups.filter((g) => g.id !== groupId)
    set({
      groups: newGroups,
      activeGroupId: newGroups[0].id,
    })
  },

  setActiveGroup: (groupId) => {
    set({ activeGroupId: groupId })
  },
}))
