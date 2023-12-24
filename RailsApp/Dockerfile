FROM ruby:3.2.2
# ベースにするイメージを指定

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs default-mysql-client vim
# RailsのインストールやMySQLへの接続に必要なパッケージをインストール

RUN mkdir /RailsApp
# コンテナ内にmyappディレクトリを作成

WORKDIR /RailsApp
# 作成したmRailsAppディレクトリを作業用ディレクトリとして設定

COPY Gemfile /RailsApp/Gemfile
COPY Gemfile.lock /RailsApp/Gemfile.lock
# ローカルの Gemfile と Gemfile.lock をコンテナ内のmyapp配下にコピー

RUN bundle install
# コンテナ内にコピーした Gemfile の bundle install

COPY . /RailsApp
# ローカルのRailsApp配下のファイルをコンテナ内のmyapp配下にコピー
