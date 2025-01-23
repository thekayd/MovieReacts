import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true); // Set loading to true before starting fetch
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (error) {
        console.error(error);
        setError("Error fetching popular movies");
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return;
    }
    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="movies-grid">
        {movies.length > 0
          ? movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
          : !loading && <p>No movies found</p>}
      </div>
    </div>
  );
};

export default Home;
