// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// /app/javascript/packs/application.js
import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

import React from 'react';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('search-container');
  if (container) {
    ReactDOM.render(<SearchComponent />, container);
  }
});

Rails.start()
Turbolinks.start()
ActiveStorage.start()