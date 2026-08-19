import React from 'react'

export function TitleBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '30px',
        background: '#3c3c3c',
        color: '#cccccc',
        fontSize: '12px',
        padding: '0 12px',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1" fill="#007acc"/>
          <rect x="9" y="2" width="5" height="5" rx="1" fill="#569cd6"/>
          <rect x="2" y="9" width="5" height="5" rx="1" fill="#4ec9b0"/>
          <rect x="9" y="9" width="5" height="5" rx="1" fill="#6a9955"/>
        </svg>
        <span style={{ fontWeight: 500 }}>DSH IDE</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#cccccc',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 3h10M1 6h10M1 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
