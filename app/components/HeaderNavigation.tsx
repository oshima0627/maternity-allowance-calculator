'use client'

/**
 * ヘッダーナビゲーション
 * サイト間遷移ボタン
 */

interface HeaderNavigationProps {
  targetSite: 'childcare' | 'maternity'
  targetUrl: string
  targetLabel: string
}

export default function HeaderNavigation({
  targetSite,
  targetUrl,
  targetLabel
}: HeaderNavigationProps) {
  const handleNavigation = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'site_navigation', {
        'event_category': 'Navigation',
        'event_label': `maternity_to_${targetSite}`
      })
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="header-nav">
      <button 
        onClick={handleNavigation}
        className="header-nav-button"
        type="button"
        aria-label={`${targetLabel}に移動`}
      >
        {targetLabel}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}