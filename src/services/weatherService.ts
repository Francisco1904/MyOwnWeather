import axios from "axios";

// Base URL for WeatherAPI.com
const BASE_URL = "https://api.weatherapi.com/v1";

// Use the API key from environment variables
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error("WeatherAPI key is not defined in environment variables");
}

// Interface for weather data from WeatherAPI
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
  };
}

// Interface for forecast data
export interface ForecastData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
      }>;
    }>;
  };
}

/**
 * Get the current weather for a location
 * @param location Location name or coordinates
 * @param units Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit)
 * @returns Promise with weather data
 */
export const getCurrentWeather = async (
  location: string,
  units: string = "metric"
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: location,
        aqi: "no",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

/**
 * Get the forecast weather for a location
 * @param location Location name or coordinates
 * @param days Number of days to forecast (1-10)
 * @param units Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit)
 * @returns Promise with forecast data
 */
export const getWeatherForecast = async (
  location: string,
  days: number = 5,
  units: string = "metric"
): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days: days,
        aqi: "no",
        alerts: "no",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};
