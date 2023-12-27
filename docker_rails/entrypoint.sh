#!/bin/bash
set -e

# 依存関係のインストール
# bundle install

# WebpackerとReactのセットアップ
rails webpacker:install
rails webpacker:install:react

# その他の初期化コマンド（必要に応じて）

# サーバー起動コマンド
exec "$@"
