// SearchForm.jsx
import React from 'react';

const SearchForm = ({ handleSearch, searchType, setSearchType, query, setQuery, placeholder, inputType }) => {

  return (
    <form onSubmit={handleSearch} className="d-flex flex-column align-items-center mb-5">
      <div className="input-group mb-3" style={{ maxWidth: '600px' }}>
        <select
          className="form-select"
          onChange={(e) => setSearchType(e.target.value)}
          value={searchType}
        >
          <option value="title">Title</option>
          <option value="genre">Genre</option>
          <option value="year">Release Year</option>
        </select>
        <input
          type={inputType}
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
