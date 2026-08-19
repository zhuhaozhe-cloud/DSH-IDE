/**
 * VS Code-style menu bar for the IDE view.
 *
 * Design: Minimalist/Swiss, dense layout, keyboard accessible.
 * Uses DSH CSS variables for theme consistency.
 */
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { colors, typography, spacing, radius, shadow, transition, zIndex, layout } from './design-tokens.ts'

export interface MenuItem {
  label: string
  shortcut?: string
  separator?: boolean
  disabled?: boolean
  action: () => void
}

export interface SeparatorItem {
  separator: true
}

export type MenuItemOrSeparator = MenuItem | SeparatorItem

export interface MenuDef {
  label: string
  items: MenuItemOrSeparator[]
}

export interface MenuBarProps {
  menus: MenuDef[]
}

const barStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
  height: layout.menuBarHeight,
  background: colors.bgLayer1,
  borderBottom: `1px solid ${colors.borderDefault}`,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize.xs,
  userSelect: 'none',
}

const menuButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${spacing[4]}px`,
  background: active ? colors.accentPrimary : 'transparent',
  color: active ? '#fff' : colors.textPrimary,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  transition: transition.fast,
})

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: 220,
  background: colors.bgLayer1,
  border: `1px solid ${colors.borderDefault}`,
  borderRadius: radius.md,
  boxShadow: shadow.lg,
  zIndex: zIndex.menuDropdown,
  padding: `${spacing[1]}px 0`,
}

const itemStyle = (disabled: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[1]}px ${spacing[4]}px`,
  background: 'transparent',
  color: disabled ? colors.textTertiary : colors.textPrimary,
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  width: '100%',
  textAlign: 'left',
  transition: transition.fast,
})

const separatorStyle: React.CSSProperties = {
  height: 1,
  background: colors.borderDefault,
  margin: `${spacing[1]}px ${spacing[4]}px`,
}

const shortcutStyle: React.CSSProperties = {
  color: colors.textTertiary,
  fontSize: typography.fontSize.xs,
  marginLeft: spacing[8],
}

export function MenuBar({ menus }: MenuBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hovering, setHovering] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const handleButton = useCallback(
    (idx: number) => {
      setOpenIndex((prev) => (prev === idx ? null : idx))
      setHovering(true)
    },
    []
  )

  const handleEnter = useCallback(
    (idx: number) => {
      if (hovering) setOpenIndex(idx)
    },
    [hovering]
  )

  const handleItemClick = useCallback(
    (item: MenuItemOrSeparator) => {
      if ('separator' in item && item.separator) return
      const menuItem = item as MenuItem
      if (!menuItem.disabled) menuItem.action()
      setOpenIndex(null)
      setHovering(false)
    },
    []
  )

  useEffect(() => {
    if (!openIndex && !hovering) return
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
        setHovering(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openIndex, hovering])

  return (
    <div ref={barRef} style={barStyle}>
      {menus.map((menu, idx) => (
        <div key={menu.label} style={{ position: 'relative' }}>
          <button
            style={menuButtonStyle(openIndex === idx)}
            onClick={() => handleButton(idx)}
            onMouseEnter={() => handleEnter(idx)}
          >
            {menu.label}
          </button>
          {openIndex === idx && (
            <div style={dropdownStyle}>
              {menu.items.map((item, i) =>
                'separator' in item && item.separator ? (
                  <div key={`sep-${i}`} style={separatorStyle} />
                ) : (
                  <button
                    key={(item as MenuItem).label}
                    style={itemStyle((item as MenuItem).disabled ?? false)}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={(e) => {
                      if (!(item as MenuItem).disabled) {
                        e.currentTarget.style.background = colors.bgLayer2
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span>{(item as MenuItem).label}</span>
                    {(item as MenuItem).shortcut && (
                      <span style={shortcutStyle}>{(item as MenuItem).shortcut}</span>
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
