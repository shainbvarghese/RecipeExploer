
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  // Fetch meals (initial or by search)
  const fetchMeals = async (url) => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch meals.');
      const data = await res.json();
      if (!data.meals) {
        setMeals([]);
        setNotFound(true);
      } else {
        setMeals(data.meals);
      }
    } catch (err) {
      setError('Error loading meals. Please try again.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch (meals starting with 'c')
  useEffect(() => {
    fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === '') {
      fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
    } else {
      fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="container">
      <h1>Recipe Explorer</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search meals by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {notFound && <p className="not-found">No meals found.</p>}
      <div className="card-grid">
        {meals.map(meal => (
          <div className="card" key={meal.idMeal}>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h2>{meal.strMeal}</h2>
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <p><strong>Cuisine:</strong> {meal.strArea}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
