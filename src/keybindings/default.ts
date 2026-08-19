import type { KeyBinding } from '../types'

export const defaultKeybindings: KeyBinding[] = [
  // File operations
  { key: 'ctrl+n', command: 'file.new', label: '新建文件' },
  { key: 'ctrl+o', command: 'file.open', label: '打开文件' },
  { key: 'ctrl+s', command: 'file.save', label: '保存' },
  { key: 'ctrl+shift+s', command: 'file.saveAll', label: '全部保存' },

  // Editor
  { key: 'ctrl+z', command: 'editor.undo', label: '撤销' },
  { key: 'ctrl+shift+z', command: 'editor.redo', label: '重做' },
  { key: 'ctrl+d', command: 'editor.selectNextOccurrence', label: '选择下一个匹配' },
  { key: 'ctrl+shift+l', command: 'editor.selectAllOccurrences', label: '选择所有匹配' },

  // View
  { key: 'ctrl+b', command: 'view.toggleSidebar', label: '切换侧边栏' },
  { key: 'ctrl+`', command: 'view.toggleTerminal', label: '切换终端' },
  { key: 'ctrl+shift+p', command: 'view.commandPalette', label: '命令面板' },
  { key: 'ctrl+p', command: 'view.quickOpen', label: '快速打开' },

  // Terminal
  { key: 'ctrl+shift+`', command: 'terminal.new', label: '新建终端' },

  // Tab management
  { key: 'ctrl+w', command: 'tab.close', label: '关闭标签页' },
  { key: 'ctrl+tab', command: 'tab.next', label: '下一个标签页' },
  { key: 'ctrl+shift+tab', command: 'tab.previous', label: '上一个标签页' },
  { key: 'ctrl+1', command: 'tab.goto1', label: '切换到标签页 1' },
  { key: 'ctrl+2', command: 'tab.goto2', label: '切换到标签页 2' },
  { key: 'ctrl+3', command: 'tab.goto3', label: '切换到标签页 3' },
  { key: 'ctrl+4', command: 'tab.goto4', label: '切换到标签页 4' },
  { key: 'ctrl+5', command: 'tab.goto5', label: '切换到标签页 5' },
  { key: 'ctrl+6', command: 'tab.goto6', label: '切换到标签页 6' },
  { key: 'ctrl+7', command: 'tab.goto7', label: '切换到标签页 7' },
  { key: 'ctrl+8', command: 'tab.goto8', label: '切换到标签页 8' },
  { key: 'ctrl+9', command: 'tab.gotoLast', label: '切换到最后一个标签页' },

  // AI features
  { key: 'ctrl+shift+a', command: 'ai.inlineChat', label: 'AI 内联聊天' },
  { key: 'ctrl+k ctrl+i', command: 'ai.hover', label: 'AI 信息' },
]

// Language detection utility
export const getLanguageFromPath = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescriptreact',
    js: 'javascript', jsx: 'javascriptreact',
    py: 'python', java: 'java', c: 'c', cpp: 'cpp',
    h: 'c', cs: 'csharp', go: 'go', rs: 'rust',
    rb: 'ruby', php: 'php', swift: 'swift', kt: 'kotlin',
    json: 'json', yaml: 'yaml', yml: 'yaml', xml: 'xml',
    html: 'html', css: 'css', scss: 'scss', less: 'less',
    md: 'markdown', sql: 'sql', sh: 'shell', bash: 'shell',
    ps1: 'powershell', dockerfile: 'dockerfile',
    toml: 'toml', ini: 'ini', txt: 'plaintext',
    vue: 'vue', svelte: 'svelte',
  }
  return map[ext] ?? 'plaintext'
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
