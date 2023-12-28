// /app/javascript/packs/SearchComponent.jsx

import React, { useState } from 'react';

function SearchComponent() {
  const [searchParams, setSearchParams] = useState({
    year: '',
    term: '',
    day: ''
    // 他の検索パラメータも追加
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
    fetch(`/search?year=${searchParams.year}&term=${searchParams.term}&day=${searchParams.day}`)
      .then(response => response.json())
      .then(data => setSearchResults(data));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="year"
          value={searchParams.year}
          onChange={handleInputChange}
          placeholder="年度"
        />
        <input
          name="term"
          value={searchParams.term}
          onChange={handleInputChange}
          placeholder="学期"
        />
        <input
          name="day"
          value={searchParams.day}
          onChange={handleInputChange}
          placeholder="曜日"
        />
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
