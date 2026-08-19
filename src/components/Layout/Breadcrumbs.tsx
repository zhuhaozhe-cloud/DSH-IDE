import React from 'react'
import { useEditorStore } from '../../stores/editor-store'

export function Breadcrumbs() {
  const groups = useEditorStore((s) => s.groups)
  const activeGroupId = useEditorStore((s) => s.activeGroupId)
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  const activeTab = activeGroup?.tabs.find((t) => t.id === activeGroup?.activeTabId)

  if (!activeTab) return null

  const parts = activeTab.filePath.split('/').filter(Boolean)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '22px',
        padding: '0 12px',
        background: '#1e1e1e',
        borderBottom: '1px solid #252526',
        fontSize: '12px',
        color: '#a9a9a9',
        gap: '4px',
        overflow: 'hidden',
      }}
    >
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ color: '#666', margin: '0 2px' }}>/</span>
          )}
          <span
            style={{
              cursor: 'pointer',
              padding: '1px 4px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2d2e'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#a9a9a9'
            }}
          >
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
