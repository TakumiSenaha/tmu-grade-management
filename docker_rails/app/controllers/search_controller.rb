# /app/controllers/search_controller.rb
class SearchController < ApplicationController
  def index
    # パラメータに応じて検索を行う
    # 検索結果をインスタンス変数に格納する（ビューで使用するため）
    # @lectures = Lecture.search(search_params)
    # 検索結果をJSON形式で返す(すべてのデータが返ってきてしまう)
    # render json: @lectures
  end
  # def search_data
  #   @lectures = Lecture.search(params)
  #   render json: @lectures
  # end
  def search_data
    @lectures = Lecture.search(search_params)
    render json: @lectures
  end
  private
  def search_params
    params.permit(:year, :term, :day, :period, :teacher, :name, :lecture_number, :credits, :subject_type, :faculty_code)
    # 必要に応じて他のパラメータも許可
  end
end
