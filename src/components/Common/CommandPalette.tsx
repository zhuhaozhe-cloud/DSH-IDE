import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useUIStore } from '../../stores/ui-store'
import { useEditorStore } from '../../stores/editor-store'
import { useTerminalStore } from '../../stores/terminal-store'
import { defaultKeybindings } from '../../keybindings/default'

interface Command {
  id: string
  label: string
  category: string
  shortcut?: string
  action: () => void
}

export function CommandPalette() {
  const isVisible = useUIStore((s) => s.commandPaletteVisible)
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel)
  const toggleQuickOpen = useUIStore((s) => s.toggleQuickOpen)
  const createTerminal = useTerminalStore((s) => s.createTerminal)

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'view.toggleSidebar',
        label: '切换侧边栏',
        category: '视图',
        shortcut: 'Ctrl+B',
        action: toggleSidebar,
      },
      {
        id: 'view.toggleTerminal',
        label: '切换终端',
        category: '视图',
        shortcut: 'Ctrl+`',
        action: toggleBottomPanel,
      },
      {
        id: 'view.quickOpen',
        label: '快速打开文件',
        category: '视图',
        shortcut: 'Ctrl+P',
        action: toggleQuickOpen,
      },
      {
        id: 'terminal.new',
        label: '新建终端',
        category: '终端',
        action: () => createTerminal(),
      },
      {
        id: 'editor.splitHorizontal',
        label: '向右分割编辑器',
        category: '编辑器',
        action: () => useEditorStore.getState().splitEditor('horizontal'),
      },
      {
        id: 'editor.splitVertical',
        label: '向下分割编辑器',
        category: '编辑器',
        action: () => useEditorStore.getState().splitEditor('vertical'),
      },
      ...defaultKeybindings.map((kb) => ({
        id: kb.command,
        label: kb.label,
        category: kb.command.split('.')[0],
        shortcut: kb.key,
        action: () => {},
      })),
    ],
    [toggleSidebar, toggleBottomPanel, toggleQuickOpen, createTerminal]
  )

  const filteredCommands = useMemo(() => {
    if (!query) return commands
    const q = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.id.toLowerCase().includes(q)
    )
  }, [query, commands])

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
      toggleCommandPalette()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filteredCommands[selectedIndex]
      if (cmd) {
        cmd.action()
        toggleCommandPalette()
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
      onClick={toggleCommandPalette}
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

      {/* Palette */}
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
            placeholder="输入命令..."
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

        {/* Command list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
          {filteredCommands.map((cmd, i) => (
            <div
              key={cmd.id}
              onClick={() => {
                cmd.action()
                toggleCommandPalette()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                cursor: 'pointer',
                background: i === selectedIndex ? '#094771' : 'transparent',
                color: i === selectedIndex ? '#ffffff' : '#cccccc',
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#888888' }}>{cmd.category}</span>
                <span style={{ fontSize: '13px' }}>{cmd.label}</span>
              </div>
              {cmd.shortcut && (
                <span style={{ fontSize: '12px', color: '#888888' }}>
                  {cmd.shortcut}
                </span>
              )}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div style={{ padding: '12px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
              无匹配命令
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
