# /app/controllers/search_controller.rb
class SearchController < ApplicationController
  def index
    # パラメータに応じて検索を行う
    puts "Search params: #{search_params}"
    puts "Search results: #{@lectures}"
    @lectures = Lecture.search(search_params)
  end

  private

  def search_params
    params.permit(:year, :term, :day, :period, :teacher, :name, :lecture_number, :credits, :subject_type, :faculty_code)
    # 必要に応じて他のパラメータも許可
  end
end
