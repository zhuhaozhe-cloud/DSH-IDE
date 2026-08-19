import React, { useState, useCallback, useMemo } from 'react'
import { useFileStore } from '../../stores/file-store'
import { useEditorStore } from '../../stores/editor-store'
import { getFileIcon, FolderChevron } from '../../utils/file-icons'
import type { FileNode } from '../../types'

// Demo file tree for first version
const DEMO_TREE: FileNode[] = [
  {
    name: 'src',
    path: '/workspace/src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'components',
        path: '/workspace/src/components',
        type: 'folder',
        children: [
          {
            name: 'Header.tsx',
            path: '/workspace/src/components/Header.tsx',
            type: 'file',
          },
          {
            name: 'Footer.tsx',
            path: '/workspace/src/components/Footer.tsx',
            type: 'file',
          },
        ],
      },
      {
        name: 'App.tsx',
        path: '/workspace/src/App.tsx',
        type: 'file',
      },
      {
        name: 'main.tsx',
        path: '/workspace/src/main.tsx',
        type: 'file',
      },
      {
        name: 'index.css',
        path: '/workspace/src/index.css',
        type: 'file',
      },
    ],
  },
  {
    name: 'public',
    path: '/workspace/public',
    type: 'folder',
    children: [
      {
        name: 'favicon.ico',
        path: '/workspace/public/favicon.ico',
        type: 'file',
      },
    ],
  },
  {
    name: 'package.json',
    path: '/workspace/package.json',
    type: 'file',
  },
  {
    name: 'tsconfig.json',
    path: '/workspace/tsconfig.json',
    type: 'file',
  },
  {
    name: 'vite.config.ts',
    path: '/workspace/vite.config.ts',
    type: 'file',
  },
  {
    name: 'README.md',
    path: '/workspace/README.md',
    type: 'file',
  },
  {
    name: '.gitignore',
    path: '/workspace/.gitignore',
    type: 'file',
  },
]

// Demo file contents
const DEMO_CONTENTS: Record<string, string> = {
  '/workspace/src/App.tsx': `import React from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <h1>Welcome to DSH IDE</h1>
        <p>A modern IDE built with React + Monaco Editor</p>
      </main>
      <Footer />
    </div>
  )
}`,
  '/workspace/src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
  '/workspace/src/components/Header.tsx': `import React from 'react'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'DSH IDE' }: HeaderProps) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav>
        <a href="/home">Home</a>
        <a href="/docs">Docs</a>
        <a href="/settings">Settings</a>
      </nav>
    </header>
  )
}`,
  '/workspace/src/components/Footer.tsx': `import React from 'react'

export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 DSH IDE. Built with ❤️</p>
    </footer>
  )
}`,
  '/workspace/src/index.css': `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #d4d4d4;
  background-color: #1e1e1e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}`,
  '/workspace/package.json': `{
  "name": "dsh-ide-demo",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0"
  }
}`,
  '/workspace/tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}`,
  '/workspace/vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})`,
  '/workspace/README.md': `# DSH IDE Demo

A modern IDE built with React and Monaco Editor.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Monaco Editor integration
- File explorer
- Terminal panel
- Tab management
- Keyboard shortcuts`,
  '/workspace/.gitignore': `node_modules/
dist/
.env
.env.local
*.log`,
}

interface FileTreeItemProps {
  node: FileNode
  depth: number
  expandedPaths: Set<string>
  selectedPath: string | null
  onToggle: (path: string) => void
  onSelect: (node: FileNode) => void
}

function FileTreeItem({
  node,
  depth,
  expandedPaths,
  selectedPath,
  onToggle,
  onSelect,
}: FileTreeItemProps) {
  const isExpanded = expandedPaths.has(node.path)
  const isSelected = node.path === selectedPath
  const isFolder = node.type === 'folder'

  const handleClick = useCallback(() => {
    if (isFolder) {
      onToggle(node.path)
    } else {
      onSelect(node)
    }
  }, [isFolder, node.path, onToggle, onSelect])

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          paddingLeft: `${depth * 16 + 8}px`,
          cursor: 'pointer',
          fontSize: '13px',
          color: isSelected ? '#ffffff' : '#cccccc',
          background: isSelected ? '#094771' : 'transparent',
          whiteSpace: 'nowrap',
          height: '22px',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = '#2a2d2e'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        {isFolder && (
          <span style={{ display: 'flex', alignItems: 'center', width: '16px', flexShrink: 0 }}>
            <FolderChevron expanded={isExpanded} />
          </span>
        )}
        {!isFolder && <span style={{ width: '16px', flexShrink: 0 }} />}
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {getFileIcon(node.name, node.type)}
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.name}
        </span>
      </div>
      {isFolder && isExpanded && node.children && (
        <>
          {node.children
            .sort((a, b) => {
              // Folders first, then files
              if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
              return a.name.localeCompare(b.name)
            })
            .map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                expandedPaths={expandedPaths}
                selectedPath={selectedPath}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
        </>
      )}
    </>
  )
}

export function FileExplorer() {
  const expandedPaths = useFileStore((s) => s.expandedPaths)
  const selectedPath = useFileStore((s) => s.selectedPath)
  const toggleFolder = useFileStore((s) => s.toggleFolder)
  const selectFile = useFileStore((s) => s.selectFile)
  const openFile = useEditorStore((s) => s.openFile)

  const [searchQuery, setSearchQuery] = useState('')

  const filteredTree = useMemo(() => {
    if (!searchQuery) return DEMO_TREE
    // Simple filter: show files matching the search
    const query = searchQuery.toLowerCase()
    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .map((node) => {
          if (node.type === 'folder' && node.children) {
            const filteredChildren = filterNodes(node.children)
            if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query)) {
              return { ...node, children: filteredChildren }
            }
            return null
          }
          if (node.name.toLowerCase().includes(query)) {
            return node
          }
          return null
        })
        .filter(Boolean) as FileNode[]
    }
    return filterNodes(DEMO_TREE)
  }, [searchQuery])

  const handleSelect = useCallback(
    (node: FileNode) => {
      selectFile(node.path)
      const content = DEMO_CONTENTS[node.path] ?? `// ${node.name}\n// File content would be loaded from the server`
      openFile(node.path, node.name, content)
    },
    [selectFile, openFile]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#252526',
        color: '#cccccc',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderBottom: '1px solid #3c3c3c',
        }}
      >
        <span>资源管理器</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            title="新建文件"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#cccccc',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v10M3 8h10" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            title="新建文件夹"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#cccccc',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h5l1.5 1.5H14v7H2zM8 8v4M6 10h4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            title="刷新"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#cccccc',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13.5 8a5.5 5.5 0 01-10.4 2M2.5 8a5.5 5.5 0 0110.4-2" strokeLinecap="round"/>
              <path d="M13 2v4h-4M3 14v-4h4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '4px 8px', borderBottom: '1px solid #3c3c3c' }}>
        <input
          type="text"
          placeholder="搜索文件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            background: '#3c3c3c',
            border: '1px solid #3c3c3c',
            borderRadius: '4px',
            color: '#cccccc',
            fontSize: '12px',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#007fd4'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#3c3c3c'
          }}
        />
      </div>

      {/* File tree */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {filteredTree.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            expandedPaths={expandedPaths}
            selectedPath={selectedPath}
            onToggle={toggleFolder}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}
