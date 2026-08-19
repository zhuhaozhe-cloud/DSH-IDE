/**
 * IDE App — the full IDE view rendered inside DSH's center column.
 *
 * This is a self-contained React tree with its own state management,
 * Monaco Editor, terminal, file explorer, etc. It does NOT touch DSH's
 * React tree at all.
 */
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { MenuBar, type MenuDef, type MenuItemOrSeparator } from './MenuBar.tsx'
import { loadTree, readFile as fsReadFile, writeFile as fsWriteFile, newFile as fsNewFile, mkdir as fsMkdir, type FileNode } from './fs-api.ts'

// ─── Monaco Editor CDN loading ──────────────────────────────────────────

const MONACO_CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'

let monacoPromise: Promise<any> | null = null

function loadMonaco(): Promise<any> {
  if (monacoPromise) return monacoPromise
  monacoPromise = new Promise((resolve, reject) => {
    if ((window as any).monaco) { resolve((window as any).monaco); return }
    const script = document.createElement('script')
    script.src = `${MONACO_CDN}/loader.js`
    script.onload = () => {
      const _require = (window as any).require
      _require.config({ paths: { vs: MONACO_CDN } })
      _require(['vs/editor/editor.main'], (m: any) => resolve(m))
    }
    script.onerror = () => reject(new Error('Monaco CDN load failed'))
    document.head.appendChild(script)
  })
  return monacoPromise
}

let themeRegistered = false
function registerTheme(monaco: any) {
  if (themeRegistered) return
  themeRegistered = true
  monaco.editor.defineTheme('dsh-dark', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569cd6' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'type', foreground: '4ec9b0' },
      { token: 'function', foreground: 'dcdcaa' },
      { token: 'variable', foreground: '9cdcfe' },
      { token: 'delimiter.bracket', foreground: 'ffd700' },
    ],
    colors: {
      'editor.background': '#0f172a',
      'editor.foreground': '#f8fafc',
      'editor.lineHighlightBackground': '#1e293b40',
      'editor.selectionBackground': '#264f7899',
      'editorCursor.foreground': '#22c55e',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94a3b8',
      'editor.selectionHighlightBackground': '#22c55e20',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'editorWidget.background': '#1b2336',
      'editorWidget.border': '#334155',
      'input.background': '#1e293b',
      'input.border': '#334155',
      'input.foreground': '#f8fafc',
      'list.hoverBackground': '#1e293b',
      'list.activeSelectionBackground': '#22c55e20',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#33415580',
      'scrollbarSlider.hoverBackground': '#475569',
      'scrollbarSlider.activeBackground': '#64748b',
      'minimap.background': '#0f172a',
    },
  })
}

// ─── Language detection ─────────────────────────────────────────────────

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    json: 'json', md: 'markdown', css: 'css', scss: 'scss', less: 'less',
    html: 'html', py: 'python', rs: 'rust', go: 'go', java: 'java',
    c: 'c', cpp: 'cpp', h: 'c', cs: 'csharp', rb: 'ruby', php: 'php',
    yml: 'yaml', yaml: 'yaml', xml: 'xml', sh: 'shell', bash: 'shell',
    sql: 'sql', toml: 'toml', vue: 'vue', svelte: 'svelte',
  }
  return map[ext] ?? 'plaintext'
}

// ─── Types ──────────────────────────────────────────────────────────────

interface Tab {
  id: string
  path: string
  name: string
  language: string
  dirty: boolean
  content: string
}

// ─── Demo data (will be replaced with real FS API) ──────────────────────

const DEMO_TREE: FileNode[] = [
  { name: 'src', path: '/workspace/src', type: 'folder', children: [
    { name: 'components', path: '/workspace/src/components', type: 'folder', children: [
      { name: 'Header.tsx', path: '/workspace/src/components/Header.tsx', type: 'file' },
      { name: 'Footer.tsx', path: '/workspace/src/components/Footer.tsx', type: 'file' },
    ]},
    { name: 'App.tsx', path: '/workspace/src/App.tsx', type: 'file' },
    { name: 'main.tsx', path: '/workspace/src/main.tsx', type: 'file' },
    { name: 'index.css', path: '/workspace/src/index.css', type: 'file' },
  ]},
  { name: 'package.json', path: '/workspace/package.json', type: 'file' },
  { name: 'tsconfig.json', path: '/workspace/tsconfig.json', type: 'file' },
  { name: 'README.md', path: '/workspace/README.md', type: 'file' },
]

const DEMO_CONTENTS: Record<string, string> = {
  '/workspace/src/App.tsx': `import React from 'react'\n\nexport function App() {\n  return (\n    <div>\n      <h1>Hello DSH IDE</h1>\n    </div>\n  )\n}`,
  '/workspace/src/main.tsx': `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport { App } from './App'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)`,
  '/workspace/src/components/Header.tsx': `export function Header() {\n  return <header>Header</header>\n}`,
  '/workspace/src/components/Footer.tsx': `export function Footer() {\n  return <footer>Footer</footer>\n}`,
  '/workspace/src/index.css': `body { margin: 0; font-family: sans-serif; }`,
  '/workspace/package.json': `{\n  "name": "my-app",\n  "version": "0.1.0"\n}`,
  '/workspace/tsconfig.json': `{\n  "compilerOptions": {\n    "target": "ES2020"\n  }\n}`,
  '/workspace/README.md': `# My App\n\nA DSH IDE demo project.`,
}

// ─── Styles ─────────────────────────────────────────────────────────────

const S = {
  root: { display: 'flex', flexDirection: 'column' as const, width: '100%', height: '100%', minWidth: 0, minHeight: 0, boxSizing: 'border-box' as const, background: 'var(--dsw-alias-bg-base)', color: 'var(--dsw-alias-label-primary)', fontFamily: 'var(--dsw-font-family)', fontSize: '13px' },
  sidebar: { width: 260, background: 'var(--dsw-alias-bg-layer-2)', borderRight: '1px solid var(--dsw-alias-border-l1)', display: 'flex', flexDirection: 'column' as const, flexShrink: 0 },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid var(--dsw-alias-border-l1)', color: 'var(--dsw-alias-label-secondary)' },
  sidebarInput: { width: '100%', padding: '4px 8px', background: 'var(--dsw-specific-input-major)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: '4px', color: 'var(--dsw-alias-label-primary)', fontSize: '12px', outline: 'none', boxSizing: 'border-box' as const },
  main: { flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' },
  tabBar: { display: 'flex', alignItems: 'center', height: '35px', background: 'var(--dsw-alias-bg-layer-2)', borderBottom: '1px solid var(--dsw-alias-border-l1)', overflow: 'hidden' },
  editor: { flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden' },
  bottomBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '22px', background: 'var(--dsw-alias-state-business-primary)', color: 'var(--dsw-alias-label-primary-foreground)', fontSize: '12px', padding: '0 12px', flexShrink: 0 },
  terminal: { background: 'var(--dsw-alias-bg-base)', borderTop: '1px solid var(--dsw-alias-border-l1)' },
  resizeHandle: { height: '4px', cursor: 'row-resize', background: 'var(--dsw-alias-border-l2)', flexShrink: 0 },
  cmdPalette: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '80px' },
  cmdBackdrop: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'var(--dsw-alias-bg-mask-1)' },
  cmdPanel: { position: 'relative' as const, width: 560, maxHeight: 400, background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 6, boxShadow: 'var(--dsw-shadow-lv3)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' },
} as const

// ─── Main IDE App ───────────────────────────────────────────────────────

let tabIdCounter = 0

export function IdeApp({ root }: { root?: string }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/workspace', '/workspace/src']))
  const [searchQuery, setSearchQuery] = useState('')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')
  const [terminals, setTerminals] = useState<{ id: string; name: string }[]>([{ id: 't1', name: '终端 1' }])
  const [activeTermId, setActiveTermId] = useState('t1')
  const [termHeight, setTermHeight] = useState(180)
  const [termVisible, setTermVisible] = useState(true)
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 })
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [realTree, setRealTree] = useState<FileNode[] | null>(null)
  const [newFileDialog, setNewFileDialog] = useState(false)
  const [newFileDir, setNewFileDir] = useState('')
  const [newFileName, setNewFileName] = useState('')

  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const termContainerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const termFitRef = useRef<any>(null)
  const tabsRef = useRef(tabs)
  tabsRef.current = tabs  // keep ref in sync for async callbacks

  const activeTab = tabs.find(t => t.id === activeTabId)

  // ── Load real file tree when root is available ──
  useEffect(() => {
    if (!root) return
    let disposed = false
    loadTree(root, '', 4).then((tree) => {
      if (!disposed && tree.length > 0) setRealTree(tree)
    }).catch(() => {})
    return () => { disposed = true }
  }, [root])

  const refreshTree = useCallback(() => {
    if (!root) return
    loadTree(root, '', 4).then(setRealTree).catch(() => {})
  }, [root])

  // ── Open file (async — reads from real FS when root available) ──
  const openFile = useCallback(async (path: string) => {
    const existing = tabsRef.current.find(t => t.path === path)
    if (existing) { setActiveTabId(existing.id); return }
    const name = path.split('/').pop() ?? path
    let content = DEMO_CONTENTS[path] ?? ''
    if (root) {
      try { content = await fsReadFile(root, path) } catch { content = DEMO_CONTENTS[path] ?? '// Cannot read file' }
    }
    const tab: Tab = { id: 'tab-' + (++tabIdCounter), path, name, language: detectLanguage(path), dirty: false, content }
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
  }, [root])

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id)
      if (activeTabId === id) {
        setActiveTabId(next.length > 0 ? next[next.length - 1].id : null)
      }
      return next
    })
  }, [activeTabId])

  // ── Toggle folder ──
  const toggleFolder = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path); else next.add(path)
      return next
    })
  }, [])

  // ── New file: open dialog when root available, else untitled tab ──
  const newFile = useCallback(() => {
    if (root) {
      setNewFileDir('')
      setNewFileName('untitled.txt')
      setNewFileDialog(true)
    } else {
      const name = 'untitled-' + (++tabIdCounter) + '.txt'
      const tab: Tab = { id: 'tab-' + (++tabIdCounter), path: 'untitled:/' + name, name, language: 'plaintext', dirty: false, content: '' }
      setTabs(prev => [...prev, tab])
      setActiveTabId(tab.id)
    }
  }, [root])

  // ── Create file on disk, refresh tree, and open it ──
  const handleCreateNewFile = useCallback(async () => {
    if (!root || !newFileName.trim()) return
    const relPath = newFileDir ? newFileDir + '/' + newFileName.trim() : newFileName.trim()
    try {
      await fsNewFile(root, relPath)
    } catch (err) {
      console.warn('[dsh-ide] new file failed:', err)
      return
    }
    setNewFileDialog(false)
    refreshTree()
    await openFile(relPath)
  }, [root, newFileDir, newFileName, refreshTree])

  // ── Save dirty tabs to disk ──
  const saveAll = useCallback(async () => {
    if (root) {
      for (const t of tabsRef.current) {
        if (t.dirty && !t.path.startsWith('untitled:')) {
          try { await fsWriteFile(root, t.path, t.content) } catch { /* keep dirty */ }
        }
      }
    }
    setTabs(prev => prev.map(t => ({ ...t, dirty: t.path.startsWith('untitled:') ? t.dirty : false })))
  }, [root])

  const newTerminal = useCallback(() => {
    setTerminals(prev => {
      const id = 't' + Date.now()
      setActiveTermId(id)
      return [...prev, { id, name: '终端 ' + (prev.length + 1) }]
    })
  }, [])

  const clearTerminal = useCallback(() => {
    termRef.current?.clear()
  }, [])

  const editorAction = useCallback((actionId: string) => {
    const editor = editorRef.current
    if (editor !== null && editor !== undefined) {
      editor.trigger('menu', actionId, null)
      editor.focus()
    }
  }, [])

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.shiftKey && e.key === 'P') { e.preventDefault(); setCmdOpen(v => !v) }
      else if (ctrl && e.key === 'p') { e.preventDefault(); setCmdOpen(v => !v) }
      else if (ctrl && e.key === '`') { e.preventDefault(); setTermVisible(v => !v) }
      else if (ctrl && e.key === 'w' && activeTabId) { e.preventDefault(); closeTab(activeTabId) }
      else if (ctrl && e.key === 'b') { e.preventDefault(); setSidebarVisible(v => !v) }
      else if (ctrl && e.key === 'n') { e.preventDefault(); newFile() }
      else if (ctrl && e.key === 's') { e.preventDefault(); saveAll() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeTabId, closeTab, newFile, saveAll])

  // ── Init terminal (xterm.js from CDN) ──
  useEffect(() => {
    if (!termVisible || !termContainerRef.current) return
    let disposed = false
    const load = async () => {
      const Terminal = (window as any).Terminal
      if (!Terminal) {
        // Load xterm from CDN
        await new Promise<void>((resolve) => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css'
          link.onload = () => resolve(); document.head.appendChild(link)
        })
        await new Promise<void>((resolve) => {
          const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js'
          s.onload = () => resolve(); document.head.appendChild(s)
        })
        await new Promise<void>((resolve) => {
          const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js'
          s.onload = () => resolve(); document.head.appendChild(s)
        })
      }
      if (disposed || !termContainerRef.current) return
      const XTerm = (window as any).Terminal
      const FitAddon = (window as any).FitAddon
      const term = new XTerm({
        theme: { background: '#0f172a', foreground: '#f8fafc', cursor: '#22c55e', cursorAccent: '#0f172a', selectionBackground: '#264f7899',
          black: '#1e293b', red: '#ef4444', green: '#22c55e', yellow: '#f59e0b', blue: '#3b82f6', magenta: '#a855f7', cyan: '#06b6d4', white: '#f8fafc' },
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace", fontSize: 13, cursorBlink: true, cursorStyle: 'bar',
        lineHeight: 1.4, letterSpacing: 0,
      })
      const fit = new FitAddon()
      term.loadAddon(fit)
      term.open(termContainerRef.current)
      setTimeout(() => fit.fit(), 50)
      term.writeln('\x1b[1;36mDSH IDE Terminal\x1b[0m')
      term.write('\x1b[32m$\x1b[0m ')
      let buf = ''
      term.onData((data: string) => {
        if (data === '\r') { term.writeln(''); term.write('\x1b[32m$\x1b[0m '); buf = '' }
        else if (data === '\x7f') { if (buf.length > 0) { buf = buf.slice(0, -1); term.write('\b \b') } }
        else if (data >= ' ') { buf += data; term.write(data) }
      })
      termRef.current = term; termFitRef.current = fit
    }
    load()
    return () => { disposed = true; termRef.current?.dispose(); termRef.current = null }
  }, [termVisible, activeTermId])

  // ── Fit terminal on resize ──
  useEffect(() => {
    if (termVisible && termFitRef.current) {
      setTimeout(() => termFitRef.current?.fit(), 50)
    }
  }, [termVisible, termHeight])

  // ── Re-layout editor & terminal when the window is resized ──
  // Monaco's automaticLayout tracks the editor container, but re-layout is
  // cheap insurance for the race where the container resizes before the
  // editor observes it; xterm has no auto-fit, so it must be re-fitted here.
  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(() => {
        editorRef.current?.layout()
        if (termVisible && termFitRef.current) {
          try { termFitRef.current.fit() } catch { /* terminal not ready yet */ }
        }
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [termVisible])

  // ── Monaco Editor ──
  useEffect(() => {
    if (!editorContainerRef.current || !activeTab) { editorRef.current?.dispose(); editorRef.current = null; return }
    let disposed = false
    loadMonaco().then((monaco) => {
      if (disposed || !editorContainerRef.current) return
      registerTheme(monaco)
      const uri = monaco.Uri.parse(activeTab.path)
      let model = monaco.editor.getModel(uri)
      if (!model) model = monaco.editor.createModel(activeTab.content, activeTab.language, uri)
      else { model.setValue(activeTab.content); monaco.editor.setModelLanguage(model, activeTab.language) }

      const editor = monaco.editor.create(editorContainerRef.current, {
        model, theme: 'dsh-dark', fontSize: 14,
        fontFamily: "'JetBrains Mono', Consolas, monospace",
        minimap: { enabled: true, scale: 1 },
        scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2,
        renderWhitespace: 'selection', bracketPairColorization: { enabled: true },
        smoothScrolling: true, cursorBlinking: 'smooth', cursorSmoothCaretAnimation: 'on',
        padding: { top: 8 }, folding: true,
      })
      editorRef.current = editor
      editor.onDidChangeCursorPosition((e: any) => setCursorPos({ line: e.position.lineNumber, column: e.position.column }))
      editor.onDidChangeModelContent(() => {
        const val = editor.getValue()
        setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, content: val, dirty: true } : t))
      })
      editor.focus()
    })
    return () => { disposed = true; editorRef.current?.dispose(); editorRef.current = null }
  }, [activeTab?.id])

  // ── Resize terminal ──
  const startTermResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY, startH = termHeight
    const onMove = (ev: MouseEvent) => setTermHeight(Math.max(80, Math.min(600, startH - (ev.clientY - startY))))
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [termHeight])

  // ── File tree rendering ──
  const renderTree = (nodes: FileNode[], depth: number): React.ReactNode => {
    const sorted = [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    return sorted.map(node => {
      const isFolder = node.type === 'folder'
      const expanded = expandedPaths.has(node.path)
      const isActive = activeTab?.path === node.path
      return (
        <React.Fragment key={node.path}>
          <div
            onClick={() => isFolder ? toggleFolder(node.path) : openFile(node.path)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', paddingLeft: depth * 16 + 8, cursor: 'pointer', fontSize: 13, color: isActive ? 'var(--dsw-alias-label-primary)' : 'var(--dsw-alias-label-secondary)', background: isActive ? 'var(--dsw-alias-state-business-primary)' : 'transparent', height: 22, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--dsw-specific-sidebar-nav-item-hover)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
          >
            {isFolder && <span style={{ width: 16, fontSize: 10, color: 'var(--dsw-alias-label-tertiary)' }}>{expanded ? '▾' : '▸'}</span>}
            {!isFolder && <span style={{ width: 16 }} />}
            <span>{isFolder ? null : getFileIcon(node.name) || null}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
          </div>
          {isFolder && expanded && node.children && renderTree(node.children, depth + 1)}
        </React.Fragment>
      )
    })
  }

  // ── Filtered tree ──
  const filteredTree = searchQuery
    ? ((realTree ?? DEMO_TREE) as FileNode[]).reduce<FileNode[]>((acc, n) => {
        const q = searchQuery.toLowerCase()
        if (n.type === 'folder' && n.children) {
          const fc = filterTree(n.children, q)
          if (fc.length > 0 || n.name.toLowerCase().includes(q)) acc.push({ ...n, children: fc })
        } else if (n.name.toLowerCase().includes(q)) {
          acc.push(n)
        }
        return acc
      }, [])
    : (realTree ?? DEMO_TREE)

  // ── Commands ──
  const commands = [
    { label: '新建文件', shortcut: 'Ctrl+N', action: newFile },
    { label: '切换终端', shortcut: 'Ctrl+`', action: () => setTermVisible(v => !v) },
    { label: '新建终端', action: newTerminal },
    { label: '保存文件', shortcut: 'Ctrl+S', action: () => void saveAll() },
    { label: '关闭标签页', shortcut: 'Ctrl+W', action: () => activeTabId && closeTab(activeTabId) },
  ]
  const filteredCmds = cmdQuery ? commands.filter(c => c.label.includes(cmdQuery)) : commands

  // ── Menu bar definition ──
  const menus: MenuDef[] = [
    {
      label: '文件',
      items: [
        { label: '新建文件', shortcut: 'Ctrl+N', action: newFile },
        { label: '保存', shortcut: 'Ctrl+S', action: saveAll },
        { label: '全部保存', shortcut: 'Ctrl+Shift+S', action: saveAll },
        { separator: true } as MenuItemOrSeparator,
        { label: '关闭标签页', shortcut: 'Ctrl+W', action: () => { if (activeTabId) closeTab(activeTabId) }, disabled: activeTabId === null },
      ],
    },
    {
      label: '编辑',
      items: [
        { label: '撤销', shortcut: 'Ctrl+Z', action: () => editorAction('undo') },
        { label: '重做', shortcut: 'Ctrl+Shift+Z', action: () => editorAction('redo') },
        { separator: true } as MenuItemOrSeparator,
        { label: '剪切', shortcut: 'Ctrl+X', action: () => editorAction('editor.action.clipboardCutAction') },
        { label: '复制', shortcut: 'Ctrl+C', action: () => editorAction('editor.action.clipboardCopyAction') },
        { label: '粘贴', shortcut: 'Ctrl+V', action: () => editorAction('editor.action.clipboardPasteAction') },
        { separator: true } as MenuItemOrSeparator,
        { label: '全选', shortcut: 'Ctrl+A', action: () => editorAction('editor.action.selectAll') },
        { label: '查找', shortcut: 'Ctrl+F', action: () => editorAction('actions.find') },
        { label: '替换', shortcut: 'Ctrl+H', action: () => editorAction('editor.action.startFindReplaceAction') },
      ],
    },
    {
      label: '视图',
      items: [
        { label: '命令面板', shortcut: 'Ctrl+Shift+P', action: () => setCmdOpen(v => !v) },
        { label: '快速打开', shortcut: 'Ctrl+P', action: () => setCmdOpen(v => !v) },
        { separator: true } as MenuItemOrSeparator,
        { label: '切换侧边栏', shortcut: 'Ctrl+B', action: () => setSidebarVisible(v => !v) },
        { label: '切换终端', shortcut: 'Ctrl+`', action: () => setTermVisible(v => !v) },
      ],
    },
    {
      label: '终端',
      items: [
        { label: '新建终端', shortcut: 'Ctrl+Shift+`', action: newTerminal },
        { label: '清空终端', action: clearTerminal },
        { separator: true } as MenuItemOrSeparator,
        { label: '切换终端面板', shortcut: 'Ctrl+`', action: () => setTermVisible(v => !v) },
      ],
    },
    {
      label: '运行',
      items: [
        { label: '启动调试', disabled: true, action: () => {} },
        { label: '运行代码', disabled: true, action: () => {} },
      ],
    },
    {
      label: '帮助',
      items: [
        { label: '关于 DSH IDE', action: () => { termRef.current?.writeln('\u001b[1;36mDSH IDE Mode v0.1.0\u001b[0m') } },
      ],
    },
  ]

  return (
    <div style={S.root}>
      <MenuBar menus={menus} />
      {/* Main area: sidebar + editor + terminal */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        {sidebarVisible && (
        <div style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <span>资源管理器</span>
          </div>
          <div style={{ padding: '4px 8px', borderBottom: '1px solid var(--dsw-alias-border-l1)' }}>
            <input type="text" placeholder="搜索文件..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={S.sidebarInput}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--dsw-alias-state-business-primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--dsw-alias-border-l2)'} />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
            {renderTree(filteredTree, 0)}
          </div>
        </div>
        )}

        {/* Right area: editor + terminal */}
        <div style={S.main}>
          {/* Tab bar */}
          {tabs.length > 0 && (
            <div style={S.tabBar}>
              {tabs.map(tab => (
                <div key={tab.id} onClick={() => setActiveTabId(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: '100%', cursor: 'pointer', background: tab.id === activeTabId ? 'var(--dsw-alias-bg-base)' : 'transparent', color: tab.id === activeTabId ? 'var(--dsw-alias-label-primary)' : 'var(--dsw-alias-label-tertiary)', borderBottom: tab.id === activeTabId ? '2px solid var(--dsw-alias-state-business-primary)' : '2px solid transparent', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {getFileIcon(tab.name) || null}
                  <span>{tab.name}</span>
                  {tab.dirty && <span style={{ fontSize: 10 }}>●</span>}
                  <button onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                    style={{ background: 'none', border: 'none', color: 'var(--dsw-alias-label-tertiary)', cursor: 'pointer', fontSize: 14, padding: 0, marginLeft: 4 }}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div ref={editorContainerRef} style={S.editor} />

          {/* Empty state */}
          {!activeTab && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--dsw-alias-label-tertiary)', gap: 16 }}> 
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="48" height="48" rx="8" stroke="var(--dsw-alias-label-tertiary)" strokeWidth="2" />
                <path d="M24 22L14 32l10 10M40 22l10 10-10 10" stroke="var(--dsw-alias-state-business-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontSize: 16, fontWeight: 500 }}>DSH IDE Mode</div>
              <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' }}>点击左侧文件打开 · Ctrl+P 快速搜索 · Ctrl+Shift+P 命令面板</div>
            </div>
          )}

          {/* Terminal resize handle */}
          {termVisible && (
            <div onMouseDown={startTermResize} style={S.resizeHandle}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--dsw-alias-border-l2)'} />
          )}

          {/* Terminal */}
          {termVisible && (
            <div style={{ height: termHeight, ...S.terminal, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', height: 28, background: 'var(--dsw-alias-bg-layer-2)', borderBottom: '1px solid var(--dsw-alias-border-l1)', padding: '0 4px', gap: 2 }}>
                {terminals.map(t => (
                  <div key={t.id} onClick={() => setActiveTermId(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', color: t.id === activeTermId ? 'var(--dsw-alias-label-primary)' : 'var(--dsw-alias-label-tertiary)', borderLeft: t.id === activeTermId ? '2px solid var(--dsw-alias-state-business-primary)' : '2px solid transparent' }}>
                    <span>{t.name}</span>
                    <span onClick={e => { e.stopPropagation(); setTerminals(p => p.filter(x => x.id !== t.id)) }} style={{ fontSize: 14, cursor: 'pointer' }}>×</span>
                  </div>
                ))}
                <button onClick={() => { const id = `t${Date.now()}`; setTerminals(p => [...p, { id, name: `终端 ${p.length + 1}` }]); setActiveTermId(id) }}
                  style={{ marginLeft: 4, background: 'none', border: 'none', color: 'var(--dsw-alias-label-tertiary)', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <div ref={termContainerRef} style={{ flex: 1, overflow: 'hidden' }} />
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={S.bottomBar}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>main</span>
          <span>0 错误</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {activeTab && <span>{activeTab.language}</span>}
          <span>UTF-8</span>
          <span>LF</span>
          {activeTab && <span>行 {cursorPos.line}, 列 {cursorPos.column}</span>}
        </div>
      </div>

      {/* Command palette */}
      {cmdOpen && (
        <div style={S.cmdPalette} onClick={() => setCmdOpen(false)}>
          <div style={S.cmdBackdrop} />
          <div style={S.cmdPanel} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--dsw-alias-border-l1)' }}>
              <input autoFocus type="text" value={cmdQuery} onChange={e => setCmdQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setCmdOpen(false); if (e.key === 'Enter' && filteredCmds[0]) { filteredCmds[0].action(); setCmdOpen(false) } }}
                placeholder="输入命令..." style={{ ...S.sidebarInput, fontSize: 14 }} />
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
              {filteredCmds.map((cmd, i) => (
                <div key={cmd.label} onClick={() => { cmd.action(); setCmdOpen(false) }}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', cursor: 'pointer', background: i === 0 ? 'var(--dsw-alias-state-business-primary)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'} onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'var(--dsw-alias-state-business-primary)' : 'transparent'}>
                  <span>{cmd.label}</span>
                  {cmd.shortcut && <span style={{ color: 'var(--dsw-alias-label-tertiary)', fontSize: 12 }}>{cmd.shortcut}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New File Dialog */}
      {newFileDialog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dsw-alias-bg-mask-1)' }} onClick={() => setNewFileDialog(false)}>
          <div style={{ background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 8, padding: 20, width: 400, color: 'var(--dsw-alias-label-primary)', fontFamily: 'var(--dsw-font-family)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>新建文件</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--dsw-alias-label-secondary)', marginBottom: 4 }}>目录（相对于项目根）</label>
              <input type="text" value={newFileDir} onChange={e => setNewFileDir(e.target.value)} placeholder="留空表示项目根目录" style={{ width: '100%', padding: '6px 10px', background: 'var(--dsw-specific-input-major)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 4, color: 'var(--dsw-alias-label-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--dsw-alias-label-secondary)', marginBottom: 4 }}>文件名</label>
              <input type="text" value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="example.ts" autoFocus style={{ width: '100%', padding: '6px 10px', background: 'var(--dsw-specific-input-major)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 4, color: 'var(--dsw-alias-label-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onKeyDown={e => { if (e.key === 'Enter') void handleCreateNewFile() }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setNewFileDialog(false)} style={{ padding: '6px 16px', background: 'transparent', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 6, color: 'var(--dsw-alias-label-primary)', cursor: 'pointer', fontSize: 13 }}>取消</button>
              <button onClick={() => void handleCreateNewFile()} disabled={!newFileName.trim()} style={{ padding: '6px 16px', background: newFileName.trim() ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-interactive-bg-hover)', border: 'none', borderRadius: 6, color: 'var(--dsw-alias-label-primary)', cursor: newFileName.trim() ? 'pointer' : 'default', fontSize: 13 }}>创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function filterTree(nodes: FileNode[], query: string): FileNode[] {
  const result: FileNode[] = []
  for (const n of nodes) {
    if (n.type === 'folder' && n.children) {
      const fc = filterTree(n.children, query)
      if (fc.length > 0 || n.name.toLowerCase().includes(query)) result.push({ ...n, children: fc })
    } else if (n.name.toLowerCase().includes(query)) {
      result.push(n)
    }
  }
  return result
}

// File type indicators — lightweight text badges instead of emoji
// (emoji icons violate the design system's no-emoji guideline).
const EXT_COLORS: Record<string, string> = {
  ts: '#3178c6', tsx: '#3178c6', js: '#f7df1e', jsx: '#f7df1e',
  json: '#e44d26', md: '#519aba', css: '#563d7c', scss: '#cf649a',
  html: '#e44d26', py: '#3572a5', rs: '#dea584', go: '#00add8',
  java: '#b07219', yml: '#cb171e', yaml: '#cb171e', toml: '#9c4221',
  sh: '#89e051', lock: '#6e7681', vue: '#41b883', svelte: '#ff3e00',
}
const EXT_LABELS: Record<string, string> = {
  ts: 'TS', tsx: 'TX', js: 'JS', jsx: 'JX', json: '{}',
  md: 'MD', css: 'CS', scss: 'SC', html: 'HT', py: 'PY',
  rs: 'RS', go: 'GO', java: 'JV', yml: 'YM', yaml: 'YM',
  toml: 'TL', sh: 'SH', lock: 'LK', vue: 'VU', svelte: 'SV',
}
function getFileIcon(name: string): React.ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const color = EXT_COLORS[ext]
  const label = EXT_LABELS[ext]
  if (!color || !label) return null
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 16, height: 16, fontSize: 9, fontWeight: 700,
      color: color, opacity: 0.85, flexShrink: 0,
      fontFamily: 'var(--dsw-font-family)', letterSpacing: '-0.5px',
    }
  }, label)
}
