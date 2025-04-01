import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { getCurrentWeather } from "../services/weatherService";

const SearchLocation: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [_, setDefaultLocation] = useLocalStorage<string>(
    "defaultLocation",
    "London"
  );
  const [unit] = useLocalStorage<string>("unit", "metric");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Test the location by trying to fetch weather for it
      await getCurrentWeather(query, unit);

      // If no error, set as default location
      setDefaultLocation(query.trim());

      // Redirect to Home
      navigate("/");
    } catch (err) {
      console.error("Error searching location:", err);
      setError("Location not found. Please try a different city name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Search Location</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find a city to view weather information
        </p>
      </header>

      <section>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium">
              Enter City Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. New York, London, Tokyo"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 pr-10"
                aria-label="Search Location"
                disabled={loading}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter a city name to search for weather information
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default SearchLocation;
