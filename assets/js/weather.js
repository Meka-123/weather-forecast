const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`The weather service returned an error (${response.status}). Please try again.`);
  }
  return response.json();
}

export async function searchCities(cityName) {
  const parameters = new URLSearchParams({
    name: cityName,
    count: "5",
    language: "en",
    format: "json"
  });
  const data = await fetchJson(`${GEOCODING_URL}?${parameters}`);
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchForecast(latitude, longitude) {
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "5"
  });
  return fetchJson(`${FORECAST_URL}?${parameters}`);
}
