# lib/tasks/import_lectures.rake
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
