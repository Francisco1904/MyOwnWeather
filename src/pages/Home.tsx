import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentWeather,
  getWeatherForecast,
  WeatherData,
  ForecastData,
} from "../services/weatherService";
import WeatherCard from "../components/WeatherCard";
import useLocalStorage from "../hooks/useLocalStorage";

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocalStorage<string>("defaultLocation", "London");
  const [unit] = useLocalStorage<string>("unit", "metric");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both current weather and forecast data
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(location, unit),
          getWeatherForecast(location, 3, unit),
        ]);

        setWeather(currentData);
        setForecast(forecastData);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, unit]);

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">My Own Weather App</h1>
      </header>

      <section aria-live="polite">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && weather && (
          <>
            <WeatherCard weather={weather} units={unit} forecast={forecast} />

            <div className="mt-6 flex justify-center">
              <Link
                to="/details"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                aria-label="View detailed weather information"
              >
                View Detailed Forecast
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
