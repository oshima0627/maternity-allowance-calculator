import type { Metadata } from 'next'
import './globals.css'
import { APP_CONFIG, OGP_CONFIG } from './utils/constants'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: OGP_CONFIG.title,
  description: OGP_CONFIG.description,
  keywords: [
    '出産手当金',
    'シミュレーター',
    '産前産後休業',
    '計算',
    '給付金',
    '健康保険',
    '妊娠',
    '出産',
    '社会保険',
    'マタニティ',
    '母性保健',
    '標準報酬',
    '休業手当',
    '産休',
    '育休',
    '支給金',
    '産前休業',
    '産後休業',
  ],
  authors: [{ name: 'Maternity Calculator' }],
  creator: 'Maternity Calculator',
  publisher: 'Maternity Calculator',
  openGraph: {
    type: 'website',
    siteName: OGP_CONFIG.siteName,
    title: OGP_CONFIG.title,
    description: OGP_CONFIG.description,
    locale: 'ja_JP',
    url: APP_CONFIG.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: OGP_CONFIG.title,
    description: OGP_CONFIG.description,
    site: '@maternity_calc',
    creator: '@maternity_calc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: APP_CONFIG.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#E91E63" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={APP_CONFIG.url} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="出産手当金シミュレーター" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap&subset=japanese"
        />
        {APP_CONFIG.gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${APP_CONFIG.gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <div className="app">
          <header>
            <div className="container">
              <h1>{APP_CONFIG.title}</h1>
              <p className="subtitle">
                妊娠中・育休予定の方向け 手取り額シミュレーター
              </p>
            </div>
          </header>

          <main>
            <div className="container">
              {children}
            </div>
          </main>

          <footer>
            <div className="container">
              <div className="footer-content">
                <div className="footer-section">
                  <h3>免責事項</h3>
                  <p>
                    当サイトの計算結果はあくまで概算であり、実際の支給額を保証するものではありません。
                    正確な金額については、必ず加入している健康保険組合または勤務先にご確認ください。
                  </p>
                  <p>
                    当サイトの利用により生じたいかなる損害についても、当方は一切の責任を負いかねます。
                  </p>
                </div>
                
                <div className="footer-section">
                  <h3>注意事項</h3>
                  <p>
                    • 計算結果は令和7年度の制度に基づきます<br />
                    • 健康保険料率は全国平均10%を使用しています<br />
                    • 最新の情報は厚生労働省・健康保険組合でご確認ください
                  </p>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>
                  &copy; 2025 出産手当金シミュレーター. 
                  データ出典: 厚生労働省
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
