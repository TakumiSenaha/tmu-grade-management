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
