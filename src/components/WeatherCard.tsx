import React from "react";
import { WeatherData } from "../services/weatherService";
import { getWeatherIcon } from "../services/weatherIconService";

interface WeatherCardProps {
  weather: WeatherData;
  units: string;
  forecast?: any; // Optional forecast data for today's min/max
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  units,
  forecast,
}) => {
  // Check if it's day or night
  const isDay = weather.current.is_day === 1;

  // Get the proper weather icon
  const weatherIconSrc = getWeatherIcon(weather.current.condition.code, isDay);

  // Format temperature based on units
  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°${units === "imperial" ? "F" : "C"}`;
  };

  // Get today's forecast if available
  const todayForecast = forecast?.forecast?.forecastday?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {weather.location.name}, {weather.location.country}
          </h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center justify-center py-4">
          <img
            src={weatherIconSrc || weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="w-24 h-24 object-contain"
            aria-label={`Weather condition: ${weather.current.condition.text}`}
          />
        </div>

        <div className="flex flex-col items-center mt-2">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {formatTemperature(
              units === "imperial"
                ? weather.current.temp_f
                : weather.current.temp_c
            )}
          </span>
          <span className="text-lg capitalize text-gray-600 dark:text-gray-300 mt-1">
            {weather.current.condition.text}
          </span>

          {/* Today's Min/Max Temperature */}
          {todayForecast && (
            <div className="flex justify-center space-x-4 mt-2">
              <span className="text-sm text-red-500 dark:text-red-400">
                Max:{" "}
                {formatTemperature(
                  units === "imperial"
                    ? todayForecast.day.maxtemp_f
                    : todayForecast.day.maxtemp_c
                )}
              </span>
              <span className="text-sm text-blue-500 dark:text-blue-400">
                Min:{" "}
                {formatTemperature(
                  units === "imperial"
                    ? todayForecast.day.mintemp_f
                    : todayForecast.day.mintemp_c
                )}
              </span>
            </div>
          )}

          <div className="flex justify-between w-full mt-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center">
              <span className="font-medium">Feels Like</span>
              <span className="mt-1">
                {formatTemperature(
                  units === "imperial"
                    ? weather.current.feelslike_f
                    : weather.current.feelslike_c
                )}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Humidity</span>
              <span className="mt-1">{weather.current.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Wind</span>
              <span className="mt-1">
                {Math.round(
                  units === "imperial"
                    ? weather.current.wind_mph
                    : weather.current.wind_kph
                )}{" "}
                {units === "imperial" ? "mph" : "km/h"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
