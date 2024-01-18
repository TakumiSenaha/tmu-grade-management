# process
reference for Docker : https://zenn.dev/peishim/articles/89bfa48396c348

## Gemfile
add gem
```
# For Use Database
gem 'activerecord'

# For React
gem 'react-rails'
```

## Set Up Database
1. Create Lecture model
   ```sh
   docker-compose exec web bash
   ```
   ```sh
   rails generate model Lecture year:integer term:string day:string period:string teacher:string name:string lecture_number:string credits:integer syllabus_url:string subject_type:string faculty_code:string
   ```
2. The **/app/models/lecture.rb** file is generated and the Lecture class is defined. Edit lecture.rb to tell Rails which attributes will be used.
   ```rb
   # app/models/lecture.rb
   class Lecture < ApplicationRecord
    def self.search(params)
        # データベースクエリを実行し、検索条件に基づいて結果を取得する
        lectures = Lecture.all
        # 各パラメータに基づく絞り込み
        lectures = lectures.where(term: params[:term]) if params[:term].present?
        lectures = lectures.where(day: params[:day]) if params[:day].present?
        lectures = lectures.where(period: params[:period]) if params[:period].present?
        lectures = lectures.where(teacher: params[:teacher]) if params[:teacher].present?
        lectures = lectures.where(name: params[:name]) if params[:name].present?
        lectures = lectures.where(lecture_number: params[:lecture_number]) if params[:lecture_number].present?
        lectures = lectures.where(credits: params[:credits]) if params[:credits].present?
        lectures = lectures.where(subject_type: params[:subject_type]) if params[:subject_type].present?
        lectures = lectures.where(faculty_code: params[:faculty_code]) if params[:faculty_code].present?

        lectures
        end
    end
   ```
3. A migration file named **db/migrate/YYYYYMMDDHHMMSS_create_lectures.rb** will be generated, containing a script to create the lectures table with the specified columns.Edit this file to add or change the columns you need.
   ```rb
   # app/db/migrate/...
    class CreateLectures < ActiveRecord::Migration[6.1]
        def change
            create_table :lectures do |t|
            t.integer :year
            t.string :term
            t.string :day
            t.string :period
            t.string :teacher
            t.string :name
            t.string :lecture_number
            t.integer :credits
            t.string :syllabus_url
            t.string :subject_type
            t.string :faculty_code

            t.timestamps
            end
        end
    end
   ```
4. Execute the following command to create a table in the database
   ```sh
   rails db:migrate
   ```
   or
   ```sh
   docker-compose exec [container-name] rails db:migrate

   ```
5. import **tsv file**
   In this case, we will download and use the scraping data from the following Git Hub.
   https://github.com/tenk-9/tmuSyllabus_scraping

6. Rake task to store information in database
   ```rake
   # /lib/tasks/import_lectures.rake
    namespace :import do
        desc "Import lectures from TSV file"
        task lectures: :environment do
            require 'csv'

            filename = '/docker_rails/syllabus/tmu_syllabus_2023.tsv'

            CSV.foreach(filename, col_sep: "\t", headers: true) do |row|
            Lecture.create!(
                year: row['開講年度'],
                term: row['開講学期'],
                day: row['曜日'],
                period: row['時限'],
                teacher: row['教員'],
                name: row['科目名'],
                lecture_number: row['授業番号'],
                credits: row['単位数'],
                syllabus_url: row['シラバスURL'],
                subject_type: row['科目区分'],
                faculty_code: row['学部コード']
            )
            end
        end
    end

   ```
7. Check Database
   You can open the Rails console to see the records of the Lecture model.
   ```sh
   docker-compose exec web rails console
   ```

   ```sh
   Lecture.all
   ```
   or
   ```sh
   docker-compose exec db mysql -u root -p
   ```
   ```sql
   USE your_database_name;
   SELECT * FROM lectures;
   ```

## Set Up React
1. Create an **entrypoint.sh** file in the project root with the following contents
   ```sh
   #!/bin/bash
    set -e

    # 依存関係のインストール(これはDockerfileで行っている場合はいらない)
    # bundle install

    # WebpackerとReactのセットアップ
    rails webpacker:install
    rails webpacker:install:react

    # その他の初期化コマンド（必要に応じて）

    # サーバー起動コマンド
    exec "$@"

   ```
2. Copy entrypoint.sh into the Dockerfile and set it as executable
   ```dockerfile
   COPY entrypoint.sh /usr/bin/
   RUN chmod +x /usr/bin/entrypoint.sh
   ENTRYPOINT ["entrypoint.sh"]
   ```
3. Use the following commands to compile JavaScript, CSS, and other files and check for errors.
   ```sh
   rails webpacker:compile
   ```
4. Creating and Importing React Components
   ```jsx
   // /app/javascript/packs/SearchComponent.jsx

    import React, { useState } from 'react';

    function SearchComponent() {
        const [searchParams, setSearchParams] = useState({
            year: '',
            term: '',
            day: '',
            period: '',    // 時限
            teacher: '',   // 教員名
            name: '',      // 授業名
            lecture_number: '', // 授業番号
            credits: '',   // 単位数
            subject_type: '',  // 科目区分
            faculty_code: ''   // 学部コード
            // 他の検索パラメータも追加可能
        });

        const [searchResults, setSearchResults] = useState([]);

        function handleInputChange(event) {
            const { name, value } = event.target;
            setSearchParams(prevParams => ({
            ...prevParams,
            [name]: value
            }));
        }

        function handleSubmit(event) {
            event.preventDefault();
            // fetchのURLを更新
            fetch(`/search/data?year=${searchParams.year}&term=${searchParams.term}&day=${searchParams.day}&period=${searchParams.period}&teacher=${searchParams.teacher}&name=${searchParams.name}&lecture_number=${searchParams.lecture_number}&credits=${searchParams.credits}&subject_type=${searchParams.subject_type}&faculty_code=${searchParams.faculty_code}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
            });
        }

        return (
            <div>
            <form onSubmit={handleSubmit}>
                {/* 各検索フィールドを追加 */}
                <input name="year" value={searchParams.year} onChange={handleInputChange} placeholder="年度" />
                <input name="term" value={searchParams.term} onChange={handleInputChange} placeholder="学期" />
                <input name="day" value={searchParams.day} onChange={handleInputChange} placeholder="曜日" />
                <input name="period" value={searchParams.period} onChange={handleInputChange} placeholder="時限" />
                <input name="teacher" value={searchParams.teacher} onChange={handleInputChange} placeholder="教員名" />
                <input name="name" value={searchParams.name} onChange={handleInputChange} placeholder="授業名" />
                <input name="lecture_number" value={searchParams.lecture_number} onChange={handleInputChange} placeholder="授業番号" />
                <input name="credits" value={searchParams.credits} onChange={handleInputChange} placeholder="単位数" />
                <input name="subject_type" value={searchParams.subject_type} onChange={handleInputChange} placeholder="科目区分" />
                <input name="faculty_code" value={searchParams.faculty_code} onChange={handleInputChange} placeholder="学部コード" />
                <button type="submit">検索</button>
            </form>

            <div>
                {searchResults.map(lecture => (
                <div key={lecture.id}>
                    <p>{lecture.name}</p>
                    <p>{lecture.teacher}</p>
                    <p>{lecture.year}</p>
                    {/* 他の情報も表示 */}
                </div>
                ))}
            </div>
            </div>
        );
    }

    export default SearchComponent;

   ```

   Import React components into app/javascript/packs/application.js
   ```js
   // This file is automatically compiled by Webpack, along with any other files
    // present in this directory. You're encouraged to place your actual application logic in
    // a relevant structure within app/javascript and only use these pack files to reference
    // that code so it'll be compiled.

    // /app/javascript/packs/application.js
    import Rails from "@rails/ujs"
    import Turbolinks from "turbolinks"
    import * as ActiveStorage from "@rails/activestorage"
    import "channels"

    // 追加項目
    import React from 'react';
    import ReactDOM from 'react-dom';
    import SearchComponent from './SearchComponent';

    document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('search-container');
    if (container) {
        ReactDOM.render(<SearchComponent />, container);
        }
    });
    //

    Rails.start()
    Turbolinks.start()
    ActiveStorage.start()
   ```
5. 
## Set Up routes.rb
```
get 'search', to: 'search#index'
```

## Configure controller settings for **routes.rb**
```sh
docker-compose exec [container-name] rails generate controller Search
```

## Edit the created controller.
```rb
# /app/controllers/search_controller.rb
class SearchController < ApplicationController
  def index
    # パラメータに応じて検索を行う
    # 検索結果をインスタンス変数に格納する（ビューで使用するため）
    # 初期はコンポーネントをマンウトするのみで良い
    # @lectures = Lecture.search(search_params)

    # 検索結果をJSON形式で返す(すべてのデータが返ってきてしまう)
    # render json: @lectures
  end

  def search_data
    # 許可するパラメータを設定して探索
    @lectures = Lecture.search(search_params)
    render json: @lectures
  end

  private

  def search_params
    params.permit(:year, :term, :day, :period, :teacher, :name, :lecture_number, :credits, :subject_type, :faculty_code)
    # 必要に応じて他のパラメータも許可
  end

end

```
## Edit /veiws/search/index.html.erb
<!--/veiws/search/search/index.html.erb-->
<div id="search-container"></div>

## The technology used for the front-end was changed to Vue.js, TypeScript.
1. Update package.json
   ```json
{
  "name": "docker-rails",
  "private": true,
  "dependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "@babel/preset-react": "^7.23.3",
    "@rails/actioncable": "^6.0.0",
    "@rails/activestorage": "^6.0.0",
    "@rails/ujs": "^6.0.0",
    "@rails/webpacker": "5.4.4",
    "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
    "prop-types": "^15.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "turbolinks": "^5.2.0",
    "webpack": "^4.46.0",
    "webpack-cli": "^3.3.12",
    "vue": "^3.0.0",  // Vue.jsを追加
    "typescript": "^4.0.0"  // TypeScriptを追加
  },
  "version": "0.1.0",
  "devDependencies": {
    "@babel/plugin-proposal-private-methods": "^7.x.x",
    "webpack-dev-server": "^3",
    "@vue/compiler-sfc": "^3.0.0",  // Vue用のコンパイラを追加
    "vue-loader": "^16.0.0"  // Vue用のローダーを追加
  }
}
   ```
1. Update Dockerfile
```docker
# Docker Hubからruby:3.0.5のイメージをプルする
FROM ruby:3.0.5

# debian系のためapt-getを使用してnode.jsとyarnをインストール
RUN apt-get update -qq
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
&& apt-get install -y nodejs
RUN npm install --global yarn

# docker内の作業ディレクトリを作成＆設定
WORKDIR /docker_rails

# Gemfile, Gemfile.lockをローカルからCOPY
COPY Gemfile Gemfile.lock /docker_rails/

# コンテナ内にコピーしたGemfileを用いてbundle install
RUN bundle install

---Add
# package.json と yarn.lock をコピー
COPY package.json yarn.lock /docker_rails/

# コンテナ内でyarn installを実行
RUN yarn install
---

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# railsを起動する
CMD ["rails", "server", "-b", "0.0.0.0"]
```
2. a
3. 




