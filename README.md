# 出産手当金シミュレーター

出産手当金の支給額を簡単に計算できるシミュレーターです。

## 機能
- 月額給与と出産予定日から出産手当金を自動計算
- 産前産後の支給期間を自動算出
- 現在の手取りとの比較表示
- よくある質問(FAQ)

## 技術スタック
- Next.js 15
- TypeScript
- CSS Modules

## 開発

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## デプロイ（Cloudflare）

静的エクスポート（`out/`）を Cloudflare で配信します。手順は [CLOUDFLARE.md](./CLOUDFLARE.md) を参照してください。

```bash
npm run preview   # ローカルで本番と同じ配信を確認
npm run deploy    # ビルドして Cloudflare にデプロイ
```
