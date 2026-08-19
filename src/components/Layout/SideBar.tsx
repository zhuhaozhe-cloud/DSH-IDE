import React from 'react'
import { useUIStore } from '../../stores/ui-store'
import { FileExplorer } from '../Sidebar/FileExplorer'
import type { SidebarPanel } from '../../types'

interface SideBarProps {
  width: number
  onResize?: (newWidth: number) => void
}

const SIDEBAR_ICONS: { panel: SidebarPanel; label: string; icon: React.ReactNode }[] = [
  {
    panel: 'explorer',
    label: '资源管理器',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 4h6l2 2h8v10H2z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    panel: 'search',
    label: '搜索',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8.5" cy="8.5" r="4.5"/>
        <path d="M12 12l5 5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    panel: 'git',
    label: '源代码管理',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="2"/>
        <circle cx="14" cy="10" r="2"/>
        <circle cx="6" cy="15" r="2"/>
        <path d="M6 7v3M6 12v1" strokeLinecap="round"/>
        <path d="M8 10h4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    panel: 'ai',
    label: 'AI 助手',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

function SidebarContent({ panel }: { panel: SidebarPanel }) {
  switch (panel) {
    case 'explorer':
      return <FileExplorer />
    case 'search':
      return (
        <div style={{ padding: '12px', color: '#cccccc' }}>
          <input
            type="text"
            placeholder="搜索文件内容..."
            style={{
              width: '100%',
              padding: '6px 10px',
              background: '#3c3c3c',
              border: '1px solid #3c3c3c',
              borderRadius: '4px',
              color: '#cccccc',
              fontSize: '13px',
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
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#888888' }}>
            输入搜索词以搜索工作区中的文件内容
          </div>
        </div>
      )
    case 'git':
      return (
        <div style={{ padding: '12px', color: '#cccccc' }}>
          <div style={{ fontSize: '12px', color: '#888888' }}>源代码管理</div>
          <div style={{ marginTop: '12px', fontSize: '13px' }}>
            <div style={{ padding: '4px 0', borderBottom: '1px solid #3c3c3c' }}>
              <span style={{ color: '#6a9955' }}>M</span>{' '}
              <span>src/App.tsx</span>
            </div>
            <div style={{ padding: '4px 0', borderBottom: '1px solid #3c3c3c' }}>
              <span style={{ color: '#569cd6' }}>A</span>{' '}
              <span>src/components/New.tsx</span>
            </div>
          </div>
        </div>
      )
    case 'ai':
      return (
        <div style={{ padding: '12px', color: '#cccccc' }}>
          <div style={{ fontSize: '12px', color: '#888888', marginBottom: '8px' }}>AI 助手</div>
          <div
            style={{
              padding: '12px',
              background: '#3c3c3c',
              borderRadius: '6px',
              fontSize: '13px',
              lineHeight: '1.5',
            }}
          >
            <div style={{ color: '#569cd6', fontWeight: 500, marginBottom: '4px' }}>DSH AI</div>
            <div style={{ color: '#cccccc' }}>
              选择代码后按 Ctrl+Shift+A 与 AI 对话。
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

export function SideBar({ width, onResize }: SideBarProps) {
  const sidebarVisible = useUIStore((s) => s.sidebarVisible)
  const sidebarPanel = useUIStore((s) => s.sidebarPanel)
  const setSidebarPanel = useUIStore((s) => s.setSidebarPanel)

  if (!sidebarVisible) return null

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(150, Math.min(500, startWidth + (e.clientX - startX)))
      onResize?.(newWidth)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        background: '#252526',
        borderRight: '1px solid #3c3c3c',
        flexShrink: 0,
      }}
    >
      {/* Activity Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '48px',
          background: '#333333',
          borderRight: '1px solid #3c3c3c',
          paddingTop: '4px',
          gap: '0',
        }}
      >
        {SIDEBAR_ICONS.map(({ panel, label, icon }) => (
          <button
            key={panel}
            title={label}
            onClick={() => setSidebarPanel(panel)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: sidebarPanel === panel && sidebarVisible ? '#ffffff' : '#858585',
              borderBottom: sidebarPanel === panel && sidebarVisible ? '2px solid #ffffff' : '2px solid transparent',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              if (sidebarPanel !== panel || !sidebarVisible) {
                e.currentTarget.style.color = '#cccccc'
              }
            }}
            onMouseLeave={(e) => {
              if (sidebarPanel !== panel || !sidebarVisible) {
                e.currentTarget.style.color = '#858585'
              }
            }}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{ width: `${width - 48}px`, height: '100%', overflow: 'hidden' }}>
        <SidebarContent panel={sidebarPanel} />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResize}
        style={{
          width: '4px',
          cursor: 'col-resize',
          background: 'transparent',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#007fd4'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      />
    </div>
  )
}
