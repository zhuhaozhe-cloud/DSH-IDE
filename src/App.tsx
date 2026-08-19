import React, { useCallback } from 'react'
import { TitleBar } from './components/Layout/TitleBar'
import { MenuBar } from './components/Layout/MenuBar'
import { SideBar } from './components/Layout/SideBar'
import { StatusBar } from './components/Layout/StatusBar'
import { Breadcrumbs } from './components/Layout/Breadcrumbs'
import { EditorGroup } from './components/Editor/EditorGroup'
import { TerminalView } from './components/Terminal/TerminalPanel'
import { CommandPalette } from './components/Common/CommandPalette'
import { QuickOpen } from './components/Common/QuickOpen'
import { useUIStore } from './stores/ui-store'
import { useTerminalStore } from './stores/terminal-store'
import { useEditorStore } from './stores/editor-store'
import { useKeybindings } from './hooks/use-keybindings'

export function App() {
  const sidebarVisible = useUIStore((s) => s.sidebarVisible)
  const sidebarWidth = useUIStore((s) => s.sidebarWidth)
  const setSidebarWidth = useUIStore((s) => s.setSidebarWidth)
  const bottomPanelVisible = useTerminalStore((s) => s.isVisible)
  const bottomPanelHeight = useTerminalStore((s) => s.height)
  const setBottomPanelHeight = useTerminalStore((s) => s.setHeight)
  const groups = useEditorStore((s) => s.groups)

  // Register keyboard shortcuts
  useKeybindings()

  const handleSidebarResize = useCallback(
    (newWidth: number) => {
      setSidebarWidth(newWidth)
    },
    [setSidebarWidth]
  )

  const handleBottomPanelResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startY = e.clientY
      const startHeight = bottomPanelHeight

      const onMouseMove = (e: MouseEvent) => {
        const newHeight = Math.max(100, Math.min(800, startHeight - (e.clientY - startY)))
        setBottomPanelHeight(newHeight)
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [bottomPanelHeight, setBottomPanelHeight]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#1e1e1e',
        color: '#cccccc',
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Title Bar */}
      <TitleBar />

      {/* Menu Bar */}
      <MenuBar />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        {sidebarVisible && (
          <SideBar width={sidebarWidth} onResize={handleSidebarResize} />
        )}

        {/* Editor + Bottom Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Editor Area */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {groups.map((group) => (
              <div
                key={group.id}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <EditorGroup groupId={group.id} />
              </div>
            ))}
          </div>

          {/* Bottom Panel Resize Handle */}
          {bottomPanelVisible && (
            <div
              onMouseDown={handleBottomPanelResize}
              style={{
                height: '4px',
                cursor: 'row-resize',
                background: '#3c3c3c',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#007fd4'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3c3c3c'
              }}
            />
          )}

          {/* Bottom Panel (Terminal) */}
          {bottomPanelVisible && (
            <div style={{ height: `${bottomPanelHeight}px`, overflow: 'hidden', flexShrink: 0 }}>
              <TerminalView />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Overlays */}
      <CommandPalette />
      <QuickOpen />
    </div>
  )
}
