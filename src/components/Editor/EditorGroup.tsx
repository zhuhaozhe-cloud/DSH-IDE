import React from 'react'
import { useEditorStore } from '../../stores/editor-store'
import { TabBar } from './TabBar'
import { MonacoEditor } from './MonacoEditor'

interface EditorGroupProps {
  groupId: string
}

export function EditorGroup({ groupId }: EditorGroupProps) {
  const group = useEditorStore((s) => s.groups.find((g) => g.id === groupId))
  const activeGroupId = useEditorStore((s) => s.activeGroupId)

  if (!group) return null

  const activeTab = group.tabs.find((t) => t.id === group.activeTabId)
  const isActiveGroup = groupId === activeGroupId

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        outline: isActiveGroup ? 'none' : '1px solid #007acc',
        outlineOffset: '-1px',
      }}
    >
      <TabBar groupId={groupId} />
      <div style={{ flex: 1, overflow: 'hidden', background: '#1e1e1e' }}>
        {activeTab ? (
          <MonacoEditor
            key={activeTab.id}
            filePath={activeTab.filePath}
            content={activeTab.content}
            language={activeTab.language}
            tabId={activeTab.id}
          />
        ) : (
          <EmptyEditor />
        )}
      </div>
    </div>
  )
}

function EmptyEditor() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#888',
        gap: '16px',
      }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="4" width="48" height="56" rx="4" stroke="#555" strokeWidth="2"/>
        <line x1="16" y1="16" x2="48" y2="16" stroke="#444" strokeWidth="1.5"/>
        <line x1="16" y1="24" x2="40" y2="24" stroke="#444" strokeWidth="1.5"/>
        <line x1="16" y1="32" x2="44" y2="32" stroke="#444" strokeWidth="1.5"/>
        <line x1="16" y1="40" x2="36" y2="40" stroke="#444" strokeWidth="1.5"/>
      </svg>
      <div style={{ fontSize: '14px' }}>DSH IDE</div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        按 Ctrl+P 快速打开文件
      </div>
    </div>
  )
}
