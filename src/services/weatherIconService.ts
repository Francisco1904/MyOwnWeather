// Import icons from the icons module
import * as icons from "../assets/icons/icons";

/**
 * Maps weather condition codes to icon file paths
 * @param conditionCode The weather condition code from WeatherAPI.com
 * @param isDay Boolean indicating if it's daytime
 * @returns Path to the appropriate weather icon
 */
export const getWeatherIcon = (
  conditionCode: number,
  isDay: boolean = true
) => {
  try {
    // Mapping based on WeatherAPI.com condition codes
    // https://www.weatherapi.com/docs/weather_conditions.json

    // Sunny / Clear
    if (conditionCode === 1000) {
      return isDay ? icons.clearDay : icons.clearNight;
    }

    // Partly Cloudy
    if (conditionCode === 1003) {
      return isDay ? icons.partlyCloudyDay : icons.partlyCloudyNight;
    }

    // Cloudy / Overcast
    if (conditionCode === 1006 || conditionCode === 1009) {
      return conditionCode === 1006 ? icons.cloudy : icons.overcast;
    }

    // Mist / Fog / Freezing Fog
    if (
      conditionCode === 1030 ||
      conditionCode === 1135 ||
      conditionCode === 1147
    ) {
      return icons.fog;
    }

    // Rain conditions (light, medium, heavy)
    if (
      [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(
        conditionCode
      )
    ) {
      return isDay ? icons.partlyCloudyDayRain : icons.partlyCloudyNightRain;
    }

    // Freezing rain / Sleet
    if (
      [1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1249, 1252].includes(
        conditionCode
      )
    ) {
      return icons.overcastRain;
    }

    // Snow (light, medium, heavy)
    if (
      [
        1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279,
        1282,
      ].includes(conditionCode)
    ) {
      return icons.snow;
    }

    // Thunderstorm
    if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
      return conditionCode === 1087
        ? icons.thunderstorms
        : icons.thunderstormsRain;
    }

    // Default fallback
    return isDay ? icons.clearDay : icons.clearNight;
  } catch (error) {
    console.error("Error loading weather icon:", error);
    return icons.defaultIcon;
  }
};

// Weather metric icons
export const getWeatherMetricIcon = (metricType: string) => {
  try {
    switch (metricType) {
      case "humidity":
        return icons.humidity;
      case "temperature":
        return icons.thermometer;
      case "pressure":
        return icons.barometer;
      case "wind":
        return icons.wind;
      case "windDirection":
        return icons.compass;
      default:
        return icons.defaultIcon;
    }
  } catch (error) {
    console.error("Error loading metric icon:", error);
    return icons.defaultIcon;
  }
};
