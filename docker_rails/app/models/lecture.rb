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
