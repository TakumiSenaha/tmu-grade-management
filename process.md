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
## Set Up rutes.rb
```
get 'search', to: 'search#index'
```

