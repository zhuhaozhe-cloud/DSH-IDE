export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  expanded?: boolean
  gitStatus?: GitStatus
  size?: number
  lastModified?: number
}

export type GitStatus = 'M' | 'A' | 'D' | 'R' | 'U' | 'C' | '?' | '!' | null

export interface Tab {
  id: string
  filePath: string
  fileName: string
  language: string
  isDirty: boolean
  content: string
  viewState?: unknown
}

export interface EditorGroup {
  id: string
  tabs: Tab[]
  activeTabId: string | null
}

export interface TerminalInstance {
  id: string
  name: string
  pid?: number
}

export interface OpenOptions {
  preserveFocus?: boolean
  preview?: boolean
  language?: string
}

export type SidebarPanel = 'explorer' | 'search' | 'git' | 'ai' | null

export type BottomPanel = 'terminal' | 'output' | 'problems' | null

export interface LayoutState {
  sidebarVisible: boolean
  sidebarWidth: number
  sidebarPanel: SidebarPanel
  bottomPanelVisible: boolean
  bottomPanelHeight: number
  bottomPanel: BottomPanel
}

export interface KeyBinding {
  key: string
  command: string
  label: string
  when?: string
}

export interface ThemeColors {
  'editor.background': string
  'editor.foreground': string
  'editor.lineHighlightBackground': string
  'editor.selectionBackground': string
  'sidebar.background': string
  'sidebar.foreground': string
  'sidebar.activeBackground': string
  'sidebar.activeForeground': string
  'sidebar.border': string
  'tab.activeBackground': string
  'tab.activeForeground': string
  'tab.inactiveBackground': string
  'tab.inactiveForeground': string
  'tab.activeBorder': string
  'tab.border': string
  'statusBar.background': string
  'statusBar.foreground': string
  'statusBar.debuggingBackground': string
  'panel.background': string
  'panel.border': string
  'panel.activeBackground': string
  'panel.activeForeground': string
  'panel.inactiveForeground': string
  'terminal.background': string
  'terminal.foreground': string
  'terminal.ansiBlack': string
  'terminal.ansiRed': string
  'terminal.ansiGreen': string
  'terminal.ansiYellow': string
  'terminal.ansiBlue': string
  'terminal.ansiMagenta': string
  'terminal.ansiCyan': string
  'terminal.ansiWhite': string
  'titleBar.background': string
  'titleBar.foreground': string
  'breadcrumb.foreground': string
  'breadcrumb.focusForeground': string
  'commandPalette.background': string
  'commandPalette.foreground': string
  'commandPalette.selectedBackground': string
  'scrollbarSlider.background': string
  'scrollbarSlider.hoverBackground': string
  'scrollbarSlider.activeBackground': string
  'border': string
  'focusBorder': string
  'input.background': string
  'input.border': string
  'input.foreground': string
  'list.activeSelectionBackground': string
  'list.activeSelectionForeground': string
  'list.hoverBackground': string
  'list.hoverForeground': string
  'badge.background': string
  'badge.foreground': string
}

export interface ThemeDefinition {
  name: string
  type: 'dark' | 'light'
  colors: ThemeColors
}
