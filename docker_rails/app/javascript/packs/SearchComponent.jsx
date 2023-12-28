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
    fetch(`/search?year=${searchParams.year}&term=${searchParams.term}&day=${searchParams.day}&period=${searchParams.period}&teacher=${searchParams.teacher}&name=${searchParams.name}&lecture_number=${searchParams.lecture_number}&credits=${searchParams.credits}&subject_type=${searchParams.subject_type}&faculty_code=${searchParams.faculty_code}`)
      .then(response => response.json())
      .then(data => setSearchResults(data));
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
