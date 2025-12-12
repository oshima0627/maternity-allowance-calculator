'use client';

/**
 * サイト間遷移ナビゲーション
 * 出産手当金シミュレーターと育児休業給付金シミュレーター間の遷移
 */

import './SiteNavigation.css';

interface SiteNavigationProps {
  variant?: 'header' | 'inline';
  currentSite?: 'maternity' | 'childcare';
}

export default function SiteNavigation({ 
  variant = 'header',
  currentSite = 'maternity' 
}: SiteNavigationProps) {
  const handleNavigation = (targetSite: 'maternity' | 'childcare') => {
    // Google Analytics追跡（実装時に追加）
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'site_navigation', {
        'event_category': 'Navigation',
        'event_label': `${currentSite}_to_${targetSite}`
      });
    }

    // 遷移先URL
    const urls = {
      maternity: 'https://maternity-allowance-calculator.nexeed-web.com',
      childcare: 'https://childcare-calculator.vercel.app' // 育児休業給付金シミュレーターのURL
    };

    window.open(urls[targetSite], '_blank', 'noopener,noreferrer');
  };

  if (variant === 'header') {
    return (
      <nav className="site-navigation site-navigation--header">
        <div className="site-navigation__container">
          <div className="site-navigation__current">
            <span className="site-navigation__label">現在</span>
            <span className="site-navigation__title">出産手当金</span>
          </div>
          
          <div className="site-navigation__divider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <button 
            onClick={() => handleNavigation('childcare')}
            className="site-navigation__link"
            type="button"
            aria-label="育児休業給付金シミュレーターに移動"
          >
            <span className="site-navigation__label">次のステップ</span>
            <span className="site-navigation__title">育児休業給付金</span>
            <svg className="site-navigation__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>
    );
  }

  // インライン版（結果表示エリア用）
  return (
    <div className="site-navigation site-navigation--inline">
      <div className="site-navigation__card">
        <div className="site-navigation__card-header">
          <h3 className="site-navigation__card-title">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="site-navigation__card-icon">
              <path d="M10 2L13 7H17L13.5 10.5L15 16L10 12.5L5 16L6.5 10.5L3 7H7L10 2Z" fill="currentColor"/>
            </svg>
            次のステップ
          </h3>
          <p className="site-navigation__card-desc">産休後の育児休業も計算してみませんか？</p>
        </div>
        
        <div className="site-navigation__card-content">
          <div className="site-navigation__benefit-item">
            <span className="site-navigation__benefit-label">支給期間</span>
            <span className="site-navigation__benefit-value">最大2年間</span>
          </div>
          <div className="site-navigation__benefit-item">
            <span className="site-navigation__benefit-label">支給率</span>
            <span className="site-navigation__benefit-value">67% → 50%</span>
          </div>
        </div>
        
        <button 
          onClick={() => handleNavigation('childcare')}
          className="site-navigation__card-button"
          type="button"
          aria-label="育児休業給付金シミュレーターで計算する"
        >
          <span>育児休業給付金を計算する</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}