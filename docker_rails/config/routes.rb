# /config/routes.rb
Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :classes, only: [:index]
  get 'search', to: 'search#index'
  get 'search/data', to: 'search#search_data'

end
