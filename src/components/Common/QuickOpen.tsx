import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useUIStore } from '../../stores/ui-store'
import { useEditorStore } from '../../stores/editor-store'
import { useFileStore } from '../../stores/file-store'
import { getFileIcon } from '../../utils/file-icons'

// Demo file paths for quick open
const DEMO_FILES = [
  { path: '/workspace/src/App.tsx', name: 'App.tsx' },
  { path: '/workspace/src/main.tsx', name: 'main.tsx' },
  { path: '/workspace/src/index.css', name: 'index.css' },
  { path: '/workspace/src/components/Header.tsx', name: 'Header.tsx' },
  {path: '/workspace/src/components/Footer.tsx', name: 'Footer.tsx' },
  { path: '/workspace/package.json', name: 'package.json' },
  { path: '/workspace/tsconfig.json', name: 'tsconfig.json' },
  { path: '/workspace/vite.config.ts', name: 'vite.config.ts' },
  { path: '/workspace/README.md', name: 'README.md' },
  { path: '/workspace/.gitignore', name: '.gitignore' },
]

export function QuickOpen() {
  const isVisible = useUIStore((s) => s.quickOpenVisible)
  const toggleQuickOpen = useUIStore((s) => s.toggleQuickOpen)
  const openFile = useEditorStore((s) => s.openFile)

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = useMemo(() => {
    if (!query) return DEMO_FILES
    const q = query.toLowerCase()
    return DEMO_FILES.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    if (isVisible) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isVisible])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleQuickOpen()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredFiles.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const file = filteredFiles[selectedIndex]
      if (file) {
        const content = `// ${file.name}\\n// File content would be loaded from the server`
        openFile(file.path, file.name, content)
        toggleQuickOpen()
      }
    }
  }

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
      onClick={toggleQuickOpen}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
        }}
      />

      {/* Quick open panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '560px',
          maxHeight: '400px',
          background: '#252526',
          border: '1px solid #454545',
          borderRadius: '6px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Input */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #3c3c3c' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索文件..."
            style={{
              width: '100%',
              padding: '6px 8px',
              background: '#3c3c3c',
              border: '1px solid #3c3c3c',
              borderRadius: '4px',
              color: '#cccccc',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#007fd4'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#3c3c3c'
            }}
          />
        </div>

        {/* File list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
          {filteredFiles.map((file, i) => (
            <div
              key={file.path}
              onClick={() => {
                const content = `// ${file.name}\\n// File content would be loaded from the server`
                openFile(file.path, file.name, content)
                toggleQuickOpen()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                background: i === selectedIndex ? '#094771' : 'transparent',
                color: i === selectedIndex ? '#ffffff' : '#cccccc',
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              {getFileIcon(file.name, 'file')}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '11px', color: '#888888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.path}
                </div>
              </div>
            </div>
          ))}
          {filteredFiles.length === 0 && (
            <div style={{ padding: '12px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
              无匹配文件
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
