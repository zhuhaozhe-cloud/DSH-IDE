import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useUIStore } from '../../stores/ui-store'
import { useEditorStore } from '../../stores/editor-store'
import { useTerminalStore } from '../../stores/terminal-store'

interface MenuItem {
  label: string
  shortcut?: string
  action?: () => void
  separator?: boolean
  disabled?: boolean
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

export function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const menuBarRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel)
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleQuickOpen = useUIStore((s) => s.toggleQuickOpen)
  const groups = useEditorStore((s) => s.groups)
  const activeGroupId = useUIStore((s) => s.sidebarPanel)
  const activeTab = groups
    .find((g) => g.id === 'main')
    ?.tabs.find((t) => t.id === groups.find((g) => g.id === 'main')?.activeTabId)
  const closeTab = useEditorStore((s) => s.closeTab)
  const closeGroup = useEditorStore((s) => s.closeGroup)
  const createTerminal = useTerminalStore((s) => s.createTerminal)

  const menus: MenuGroup[] = [
    {
      label: '文件',
      items: [
        { label: '新建文件', shortcut: 'Ctrl+N' },
        { label: '新建窗口', shortcut: 'Ctrl+Shift+N' },
        { separator: true, label: '' },
        { label: '打开文件...', shortcut: 'Ctrl+O' },
        { label: '打开文件夹...' },
        { separator: true, label: '' },
        { label: '保存', shortcut: 'Ctrl+S', action: () => activeTab && useEditorStore.getState().setTabDirty(activeTab.id, false) },
        { label: '全部保存', shortcut: 'Ctrl+Shift+S' },
        { separator: true, label: '' },
        { label: '关闭编辑器', shortcut: 'Ctrl+W', action: () => { if (activeTab) closeTab('main', activeTab.id) } },
        { label: '关闭文件夹' },
      ],
    },
    {
      label: '编辑',
      items: [
        { label: '撤销', shortcut: 'Ctrl+Z' },
        { label: '重做', shortcut: 'Ctrl+Shift+Z' },
        { separator: true, label: '' },
        { label: '剪切', shortcut: 'Ctrl+X' },
        { label: '复制', shortcut: 'Ctrl+C' },
        { label: '粘贴', shortcut: 'Ctrl+V' },
        { separator: true, label: '' },
        { label: '查找', shortcut: 'Ctrl+F' },
        { label: '替换', shortcut: 'Ctrl+H' },
      ],
    },
    {
      label: '视图',
      items: [
        { label: '命令面板...', shortcut: 'Ctrl+Shift+P', action: toggleCommandPalette },
        { label: '快速打开', shortcut: 'Ctrl+P', action: toggleQuickOpen },
        { separator: true, label: '' },
        { label: '切换侧边栏', shortcut: 'Ctrl+B', action: toggleSidebar },
        { label: '切换终端', shortcut: 'Ctrl+`', action: toggleBottomPanel },
        { separator: true, label: '' },
        { label: '放大', shortcut: 'Ctrl+=' },
        { label: '缩小', shortcut: 'Ctrl+-' },
        { label: '重置缩放', shortcut: 'Ctrl+0' },
      ],
    },
    {
      label: '终端',
      items: [
        { label: '新建终端', shortcut: 'Ctrl+Shift+`', action: () => createTerminal() },
        { label: '分割终端' },
        { separator: true, label: '' },
        { label: '关闭终端', shortcut: 'Ctrl+Shift+`' },
      ],
    },
    {
      label: '帮助',
      items: [
        { label: '欢迎页' },
        { separator: true, label: '' },
        { label: 'DSH IDE 文档' },
        { label: '检查更新' },
        { separator: true, label: '' },
        { label: '关于 DSH IDE' },
      ],
    },
  ]

  const handleMenuClick = useCallback((label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label))
  }, [])

  const handleMenuHover = useCallback((label: string) => {
    setActiveMenu((prev) => (prev !== null ? label : null))
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={menuBarRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '24px',
        background: '#3c3c3c',
        borderBottom: '1px solid #252526',
        fontSize: '13px',
        color: '#cccccc',
        padding: '0 4px',
        gap: '0',
      }}
    >
      {menus.map((menu) => (
        <div key={menu.label} style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick(menu.label)}
            onMouseEnter={() => handleMenuHover(menu.label)}
            style={{
              padding: '2px 8px',
              background: activeMenu === menu.label ? 'rgba(255,255,255,0.1)' : 'none',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#cccccc',
              fontSize: '13px',
            }}
          >
            {menu.label}
          </button>

          {activeMenu === menu.label && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: '220px',
                background: '#252526',
                border: '1px solid #454545',
                borderRadius: '4px',
                padding: '4px 0',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div
                    key={`sep-${i}`}
                    style={{
                      height: '1px',
                      background: '#3c3c3c',
                      margin: '4px 0',
                    }}
                  />
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action?.()
                      setActiveMenu(null)
                    }}
                    disabled={item.disabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '4px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: item.disabled ? 'default' : 'pointer',
                      color: item.disabled ? '#666666' : '#cccccc',
                      fontSize: '13px',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!item.disabled) {
                        e.currentTarget.style.background = '#094771'
                        e.currentTarget.style.color = '#ffffff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                      e.currentTarget.style.color = item.disabled ? '#666666' : '#cccccc'
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span style={{ color: '#888888', fontSize: '12px', marginLeft: '24px' }}>
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
