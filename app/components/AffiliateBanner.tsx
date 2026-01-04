'use client';

import './AffiliateBanner.css';

/**
 * アフィリエイトバナーコンポーネント
 * a8.netのバナーを表示
 */
export default function AffiliateBanner() {
  return (
    <div className="affiliate-banner">
      <div className="affiliate-banner__label">PR</div>
      <div className="affiliate-banner__content">
        <a href="https://px.a8.net/svt/ejp?a8mat=4AUXWS+FT6F3M+1IRY+1TK1F5" rel="nofollow">
          <img
            border="0"
            width="336"
            height="280"
            alt=""
            src="https://www23.a8.net/svt/bgt?aid=260104492956&wid=001&eno=01&mid=s00000007099011011000&mc=1"
          />
        </a>
        <img
          border="0"
          width="1"
          height="1"
          src="https://www12.a8.net/0.gif?a8mat=4AUXWS+FT6F3M+1IRY+1TK1F5"
          alt=""
        />
      </div>
    </div>
  );
}
