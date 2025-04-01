import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentWeather,
  getWeatherForecast,
  WeatherData,
  ForecastData,
} from "../services/weatherService";
import {
  getWeatherIcon,
  getWeatherMetricIcon,
} from "../services/weatherIconService";
import useLocalStorage from "../hooks/useLocalStorage";

const ExtendedWeather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocalStorage<string>("defaultLocation", "London");
  const [unit] = useLocalStorage<string>("unit", "metric");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both current weather and forecast
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(location, unit),
          getWeatherForecast(location, 5, unit),
        ]);

        setCurrentWeather(currentData);
        setForecast(forecastData);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, unit]);

  // Format temperature based on unit
  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°${unit === "imperial" ? "F" : "C"}`;
  };

  // Default icon for fallback
  const defaultIcon = "/src/assets/icons/production/fill/svg/thermometer.svg";

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Detailed Weather</h1>
        <h2 className="text-gray-600 dark:text-gray-400 mt-1">
          {currentWeather
            ? `${currentWeather.location.name}, ${currentWeather.location.country}`
            : "Loading..."}
        </h2>
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

        {!loading && !error && currentWeather && (
          <div className="space-y-6">
            {/* Current Weather Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Current Conditions</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("temperature") || defaultIcon}
                    alt="Temperature"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Temperature
                    </span>
                    <p className="font-medium">
                      {formatTemperature(
                        unit === "imperial"
                          ? currentWeather.current.temp_f
                          : currentWeather.current.temp_c
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("temperature") || defaultIcon}
                    alt="Feels Like"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Feels Like
                    </span>
                    <p className="font-medium">
                      {formatTemperature(
                        unit === "imperial"
                          ? currentWeather.current.feelslike_f
                          : currentWeather.current.feelslike_c
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("humidity") || defaultIcon}
                    alt="Humidity"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Humidity
                    </span>
                    <p className="font-medium">
                      {currentWeather.current.humidity}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("pressure") || defaultIcon}
                    alt="Pressure"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Pressure
                    </span>
                    <p className="font-medium">
                      {unit === "imperial"
                        ? `${currentWeather.current.pressure_in} inHg`
                        : `${currentWeather.current.pressure_mb} hPa`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("wind") || defaultIcon}
                    alt="Wind Speed"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Wind Speed
                    </span>
                    <p className="font-medium">
                      {Math.round(
                        unit === "imperial"
                          ? currentWeather.current.wind_mph
                          : currentWeather.current.wind_kph
                      )}
                      {unit === "imperial" ? " mph" : " km/h"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={getWeatherMetricIcon("windDirection") || defaultIcon}
                    alt="Wind Direction"
                    className="w-6 h-6 mr-2"
                  />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Wind Direction
                    </span>
                    <p className="font-medium">
                      {currentWeather.current.wind_dir}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            {forecast && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium mb-4">Forecast</h3>

                <div className="space-y-4">
                  {forecast.forecast.forecastday.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            getWeatherIcon(day.day.condition.code, true) ||
                            day.day.condition.icon
                          }
                          alt={day.day.condition.text}
                          className="w-10 h-10 mr-3"
                        />
                        <div>
                          <p className="font-medium">
                            {new Date(day.date).toLocaleDateString(undefined, {
                              weekday: "long",
                            })}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {day.day.condition.text}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex space-x-2">
                            <span className="text-sm text-blue-500 dark:text-blue-400">
                              Min:{" "}
                              {formatTemperature(
                                unit === "imperial"
                                  ? day.day.mintemp_f
                                  : day.day.mintemp_c
                              )}
                            </span>
                            <span className="text-sm text-red-500 dark:text-red-400">
                              Max:{" "}
                              {formatTemperature(
                                unit === "imperial"
                                  ? day.day.maxtemp_f
                                  : day.day.maxtemp_c
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {Math.round(
                              unit === "imperial"
                                ? day.day.maxwind_mph
                                : day.day.maxwind_kph
                            )}
                            {unit === "imperial" ? " mph" : " km/h"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default ExtendedWeather;
