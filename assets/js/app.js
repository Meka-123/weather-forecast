import { fetchForecast, searchCities } from "./weather.js";
import { renderForecast, showCityOptions, showError, showInitial, showLoading } from "./ui.js";

const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");

form.addEventListener("submit", handleSearch);
cityInput.addEventListener("input", () => cityInput.setCustomValidity(""));
showInitial();

async function handleSearch(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (!cityName) {
    cityInput.setCustomValidity("Enter a city name to search.");
    cityInput.reportValidity();
    return;
  }
  cityInput.setCustomValidity("");
  await findCity(cityName);
}

async function findCity(cityName) {
  setSearching(true);
  showLoading(cityName);
  try {
    const cities = await searchCities(cityName);
    if (!cities.length) {
      showError(`We couldn’t find “${cityName}”. Check the spelling and try another city.`, "No places found");
      return;
    }
    if (cities.length === 1) {
      await loadCityForecast(cities[0]);
      return;
    }
    showCityOptions(cities, loadCityForecast);
  } catch (error) {
    showError(error.message || "Check your internet connection and try again.");
  } finally {
    setSearching(false);
  }
}

async function loadCityForecast(city) {
  setSearching(true);
  showLoading(city.name || "your city");
  try {
    const forecast = await fetchForecast(city.latitude, city.longitude);
    if (!forecast.current || !forecast.daily) {
      throw new Error("The weather service returned incomplete forecast data. Please try another city.");
    }
    renderForecast(city, forecast);
  } catch (error) {
    showError(error.message || "Check your internet connection and try again.");
  } finally {
    setSearching(false);
  }
}

function setSearching(isSearching) {
  searchButton.disabled = isSearching;
  searchButton.classList.toggle("is-loading", isSearching);
  cityInput.readOnly = isSearching;
}
