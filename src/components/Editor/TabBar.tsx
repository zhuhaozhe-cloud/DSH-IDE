import React from 'react'
import { useEditorStore } from '../../stores/editor-store'
import { getFileIcon } from '../../utils/file-icons'

interface TabBarProps {
  groupId: string
}

export function TabBar({ groupId }: TabBarProps) {
  const group = useEditorStore((s) => s.groups.find((g) => g.id === groupId))
  const setActiveTab = useEditorStore((s) => s.setActiveTab)
  const closeTab = useEditorStore((s) => s.closeTab)

  if (!group || group.tabs.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '35px',
        background: '#252526',
        borderBottom: '1px solid #3c3c3c',
        overflow: 'hidden',
      }}
    >
      {group.tabs.map((tab) => {
        const isActive = tab.id === group.activeTabId
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(groupId, tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '100%',
              cursor: 'pointer',
              background: isActive ? '#1e1e1e' : 'transparent',
              color: isActive ? '#ffffff' : '#969696',
              borderRight: '1px solid #252526',
              borderBottom: isActive ? '1px solid #007acc' : '1px solid transparent',
              marginBottom: isActive ? '-1px' : '0',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              minWidth: '0',
              position: 'relative',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#2d2d2d'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {getFileIcon(tab.fileName, 'file')}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tab.fileName}
            </span>
            {tab.isDirty && (
              <span style={{ color: '#e8e8e8', fontSize: '10px', marginLeft: '2px' }}>
                ●
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeTab(groupId, tab.id)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                background: 'none',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: isActive ? '#969696' : 'transparent',
                fontSize: '14px',
                marginLeft: '4px',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = isActive ? '#969696' : 'transparent'
              }}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
