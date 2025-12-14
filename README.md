# note-v1

## Overview

Note-v1は、Convexをバックエンドとして使用したモダンなMarkdownノート管理アプリケーションです。直感的なUIでノートの作成、編集、整理が可能で、リアルタイムデータ同期に対応しています。

### 主な機能

- **Markdownエディター**: MDXEditorを使用した高機能なMarkdown編集
- **フォルダ管理**: ノートをフォルダで整理
- **お気に入り・ピン留め**: 重要なノートを素早くアクセス
- **タグ機能**: ノートにタグを付けて分類
- **ダークモード**: 目に優しいダークテーマ対応
- **コピー＆エクスポート**: ノートのコピーや外部への書き出し
- **リアルタイム同期**: Convexによるリアルタイムデータ同期

## Tech Stack

### Frontend
- **React 19** - UIフレームワーク
- **TypeScript** - 型安全性の確保
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Jotai** - 軽量な状態管理ライブラリ
- **MDXEditor** - Markdown編集コンポーネント
- **Lucide React** - アイコンライブラリ

### Backend
- **Convex** - リアルタイムバックエンドプラットフォーム

## Setup

### 前提条件
- Node.js (推奨: v18以上)
- npm または yarn

### インストール手順

1. リポジトリのクローン
```bash
git clone <repository-url>
cd note-v1
```

2. 依存関係のインストール
```bash
npm install
```

3. Convexのセットアップ
```bash
npx convex dev
```

4. 開発サーバーの起動
```bash
npm run dev
```

## Usage

### 開発モード
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Directory Structure

```
note-v1/
├── convex/              # Convexバックエンド
│   ├── _generated/      # 自動生成ファイル
│   ├── folders.ts       # フォルダ関連のロジック
│   ├── notes.ts         # ノート関連のロジック
│   └── schema.ts        # データモデル定義
├── public/              # 静的ファイル
├── src/
│   ├── assets/          # 画像などのアセット
│   ├── components/      # Reactコンポーネント
│   │   ├── Editor.tsx   # エディターコンポーネント
│   │   └── SideMenu.tsx # サイドメニューコンポーネント
│   ├── domain/          # ドメインモデル
│   │   ├── folder.ts    # Folderクラス
│   │   └── note.ts      # Noteクラス
│   ├── store/           # Jotai状態管理
│   │   └── index.ts     # アトム定義
│   ├── utils/           # ユーティリティ関数
│   │   └── export.ts    # エクスポート機能
│   ├── App.tsx          # メインアプリケーション
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
└── package.json         # プロジェクト設定
```

## License

This repository is for personal/private use only.
