import React from 'react'; // Import the React library
import "../styles/BrowseMovies.css";// Import CSS styles

// Define the SearchForm component
const SearchForm = ({ handleSearch, searchType, setSearchType, query, setQuery, placeholder, inputType }) => {

  // Render the SearchForm component
  return (
    <form onSubmit={handleSearch} className="d-flex flex-column align-items-center mb-5 browse-search-form">
      <div className="row gx-2 align-items-center" style={{ maxWidth: '600px', width: '100% ' }}>
        {/* Dropdown for Search Type */}
      <div className="col-sm-4 mb-2 mb-sm-0">
        <select
          className="form-select"
          onChange={(e) => setSearchType(e.target.value)}
          value={searchType}
        >
          <option value="title">Title</option> 
          <option value="genre">Genre</option>
          <option value="year">Release Year</option>
        </select>
        </div>

        {/* Input for Query */}
        <div className="col-sm-5 mb-2 mb-sm-0">
        <input
          type={inputType}
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        </div>

        {/* Submit Button */}
        <div className="col-sm-3">
        <button type="submit" className="btn btn-primary w-100">
          Search
        </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
