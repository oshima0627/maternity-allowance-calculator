/**
 * サイト間遷移ナビゲーション
 *
 * 以前は <button onClick={window.open}> だったが、これは検索エンジンにとって
 * リンクではない。クロールの経路にならず評価も渡らないため、相互リンクとして
 * 機能していなかった（配信HTMLを調べたところ姉妹サイトへの <a href> は0本だった）。
 * 素の <a> に置き換え、onClick が不要になったので 'use client' も外している。
 * CSS 側は既に text-decoration: none なので見た目は変わらない。
 */

import './SiteNavigation.css';

const SITES = {
  maternity: { url: 'https://maternity.nexeed-lab.com', label: '出産手当金' },
  childcare: { url: 'https://childcare.nexeed-lab.com', label: '育児休業給付金' },
  sickness: { url: 'https://sickness.nexeed-lab.com', label: '傷病手当金' },
  ikunavi: { url: 'https://ikunavi.nexeed-lab.com', label: '育休ナビ' },
} as const;

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8H13M13 8L8 3M13 8L8 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface SiteNavigationProps {
  variant?: 'header' | 'inline';
  currentSite?: 'maternity' | 'childcare' | 'sickness';
}

export default function SiteNavigation({ variant = 'header' }: SiteNavigationProps) {
  if (variant === 'header') {
    return (
      <nav className="site-navigation site-navigation--header">
        <div className="site-navigation__container">
          <div className="site-navigation__current">
            <span className="site-navigation__label">現在</span>
            <span className="site-navigation__title">出産手当金</span>
          </div>

          <a
            href={SITES.childcare.url}
            target="_blank"
            rel="noopener"
            className="site-navigation__link"
            aria-label="育児休業給付金シミュレーターに移動"
          >
            <span className="site-navigation__title">{SITES.childcare.label}</span>
          </a>

          <a
            href={SITES.sickness.url}
            target="_blank"
            rel="noopener"
            className="site-navigation__link"
            aria-label="傷病手当金シミュレーターに移動"
          >
            <span className="site-navigation__title">{SITES.sickness.label}</span>
          </a>

          <a
            href={SITES.ikunavi.url}
            target="_blank"
            rel="noopener"
            className="site-navigation__link"
            aria-label="育休ナビ（制度の解説）を開く"
          >
            <span className="site-navigation__title">{SITES.ikunavi.label}</span>
          </a>
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="site-navigation__card-icon"
              aria-hidden="true"
            >
              <path
                d="M10 2L13 7H17L13.5 10.5L15 16L10 12.5L5 16L6.5 10.5L3 7H7L10 2Z"
                fill="currentColor"
              />
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

        <a
          href={SITES.childcare.url}
          target="_blank"
          rel="noopener"
          className="site-navigation__card-button"
          aria-label="育児休業給付金シミュレーターで計算する"
        >
          <span>育児休業給付金を計算する</span>
          {ARROW}
        </a>

        {/* 計算だけでなく制度の中身を知りたい人向けの導線。
            手続きの流れやケース別の解説は育休ナビ側にある。 */}
        <p className="site-navigation__card-note">
          手続きの流れやケース別の解説は
          <a href={SITES.ikunavi.url} target="_blank" rel="noopener">
            育休ナビ
          </a>
          でまとめています。
        </p>
      </div>
    </div>
  );
}
