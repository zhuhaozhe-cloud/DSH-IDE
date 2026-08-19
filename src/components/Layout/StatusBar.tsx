import React, { useState, useEffect } from 'react'
import { useEditorStore } from '../../stores/editor-store'

export function StatusBar() {
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 })
  const groups = useEditorStore((s) => s.groups)
  const activeGroupId = useEditorStore((s) => s.activeGroupId)
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  const activeTab = activeGroup?.tabs.find((t) => t.id === activeGroup?.activeTabId)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail) {
        setCursorPos({ line: detail.line ?? 1, column: detail.column ?? 1 })
      }
    }
    document.addEventListener('dsh-ide-cursor', handler)
    return () => document.removeEventListener('dsh-ide-cursor', handler)
  }, [])

  const languageMap: Record<string, string> = {
    typescript: 'TypeScript',
    typescriptreact: 'TypeScript React',
    javascript: 'JavaScript',
    javascriptreact: 'JavaScript React',
    python: 'Python',
    java: 'Java',
    c: 'C',
    cpp: 'C++',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    ruby: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    less: 'Less',
    markdown: 'Markdown',
    sql: 'SQL',
    shell: 'Shell',
    powershell: 'PowerShell',
    plaintext: 'Plain Text',
    vue: 'Vue',
    svelte: 'Svelte',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '22px',
        background: '#007acc',
        color: '#ffffff',
        fontSize: '12px',
        padding: '0 12px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <StatusItem icon="\uD83C\uDF33" text="main" />
        <StatusItem text="0 错误" />
        <StatusItem text="0 警告" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {activeTab && (
          <StatusItem text={languageMap[activeTab.language] ?? activeTab.language} />
        )}
        <StatusItem text="UTF-8" />
        <StatusItem text="LF" />
        {activeTab && (
          <StatusItem text={`行 ${cursorPos.line}, 列 ${cursorPos.column}`} />
        )}
        <StatusItem icon="\uD83D\uDD04" text="" />
        <StatusItem icon="\u2699\uFE0F" text="" />
      </div>
    </div>
  )
}

function StatusItem({ icon, text }: { icon?: string; text: string }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        padding: '0 4px',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </span>
  )
}
