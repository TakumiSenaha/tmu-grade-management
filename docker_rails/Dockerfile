#Docker Hubからruby:3.0.5のイメージをプルする
FROM ruby:3.0.5

# debian系のためapt-getを使用してnode.jsとyarnをインストール
RUN apt-get update -qq
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
&& apt-get install -y nodejs
RUN npm install --global yarn

#docker内の作業ディレクトリを作成＆設定
WORKDIR /docker_rails

#Gemfile,Gemfile.lockをローカルからCOPY
COPY Gemfile Gemfile.lock /docker_rails/

#コンテナ内にコピーしたGemfileを用いてbundel install
RUN bundle install

# package.json と yarn.lock をコピー
COPY package.json yarn.lock /docker_rails/

# コンテナ内でyarn installを実行
RUN yarn install

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

#railsを起動する
CMD ["rails", "server", "-b", "0.0.0.0"]