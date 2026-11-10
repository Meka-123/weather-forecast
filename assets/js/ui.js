const WEATHER_CODES = {
  0: ["Clear sky", "☀"],
  1: ["Mainly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"],
  45: ["Fog", "🌫"],
  48: ["Depositing rime fog", "🌫"],
  51: ["Light drizzle", "🌦"],
  53: ["Moderate drizzle", "🌦"],
  55: ["Dense drizzle", "🌧"],
  56: ["Light freezing drizzle", "🌧"],
  57: ["Dense freezing drizzle", "🌧"],
  61: ["Slight rain", "🌧"],
  63: ["Moderate rain", "🌧"],
  65: ["Heavy rain", "🌧"],
  66: ["Light freezing rain", "🌧"],
  67: ["Heavy freezing rain", "🌧"],
  71: ["Slight snow", "🌨"],
  73: ["Moderate snow", "🌨"],
  75: ["Heavy snow", "❄"],
  77: ["Snow grains", "❄"],
  80: ["Slight rain showers", "🌦"],
  81: ["Moderate rain showers", "🌧"],
  82: ["Violent rain showers", "🌧"],
  85: ["Slight snow showers", "🌨"],
  86: ["Heavy snow showers", "❄"],
  95: ["Thunderstorm", "⛈"],
  96: ["Thunderstorm with slight hail", "⛈"],
  99: ["Thunderstorm with heavy hail", "⛈"]
};

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function readableWeather(code) {
  return WEATHER_CODES[code] || ["Conditions unavailable", "☁"];
}

function formatNumber(value, suffix = "") {
  return Number.isFinite(value) ? `${Math.round(value)}${suffix}` : "—";
}

function formatDay(dateString, options) {
  const date = new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "Day unavailable" : new Intl.DateTimeFormat(undefined, options).format(date);
}

export function showLoading(cityName) {
  setBusy(true);
  const panel = statusPanel();
  panel.hidden = false;
  panel.className = "status-panel loading-state";
  panel.replaceChildren();
  panel.append(
    createElement("span", "loading-spinner"),
    createElement("h2", "", `Finding ${cityName}…`),
    createElement("p", "", "Checking the latest forecast.")
  );
  showWeather(false);
  showCityPicker(false);
}

export function showInitial() {
  setBusy(false);
  const panel = statusPanel();
  panel.hidden = false;
  panel.className = "status-panel initial-state";
  panel.replaceChildren(
    createElement("span", "status-art", "☀"),
    createElement("h2", "", "Start with a city"),
    createElement("p", "", "Search for a place to see its current weather and five-day forecast.")
  );
  showWeather(false);
  showCityPicker(false);
}

export function showError(message, heading = "We couldn’t load that forecast") {
  setBusy(false);
  const panel = statusPanel();
  panel.hidden = false;
  panel.className = "status-panel error-state";
  panel.replaceChildren(
    createElement("span", "status-art", "!"),
    createElement("h2", "", heading),
    createElement("p", "", message)
  );
  showWeather(false);
  showCityPicker(false);
}

export function showCityOptions(cities, onChoose) {
  setBusy(false);
  statusPanel().hidden = true;
  const picker = cityPicker();
  picker.replaceChildren();
  picker.hidden = false;
  picker.append(
    createElement("h2", "picker-title", "Which place did you mean?"),
    createElement("p", "picker-copy", "Choose the matching city to see its forecast.")
  );

  const list = createElement("div", "city-list");
  cities.forEach((city, index) => {
    const button = createElement("button", "city-option");
    button.type = "button";
    button.append(
      createElement("span", "option-number", String(index + 1).padStart(2, "0")),
      createElement("span", "option-name", city.name || "Unnamed place"),
      createElement("span", "option-location", [city.admin1, city.country].filter(Boolean).join(", ") || "Location details unavailable"),
      createElement("span", "option-arrow", "→")
    );
    button.addEventListener("click", () => onChoose(city));
    list.append(button);
  });
  picker.append(list);
  showWeather(false);
  statusPanel().replaceChildren();
}

export function renderForecast(city, data) {
  setBusy(false);
  statusPanel().replaceChildren();
  showCityPicker(false);

  const content = weatherContent();
  content.replaceChildren();
  content.hidden = false;
  statusPanel().hidden = true;

  const heading = createElement("div", "forecast-heading");
  const name = createElement("div");
  name.append(
    createElement("p", "eyebrow", "CURRENT CONDITIONS"),
    createElement("h2", "city-name", city.name || "Weather forecast"),
    createElement("p", "city-detail", [city.admin1, city.country].filter(Boolean).join(", "))
  );
  const date = createElement("p", "updated-label", formatDay(data.daily?.time?.[0], { weekday: "long", month: "long", day: "numeric" }));
  heading.append(name, date);
  content.append(heading);

  const current = data.current || {};
  const [description, icon] = readableWeather(current.weather_code);
  const hero = createElement("section", "current-card");
  hero.setAttribute("aria-label", "Current weather");
  const conditions = createElement("div", "current-condition");
  conditions.append(
    createElement("span", "current-icon", icon),
    createElement("div", "condition-copy", description)
  );
  hero.append(
    createElement("p", "current-label", "RIGHT NOW"),
    createElement("div", "current-main", `${formatNumber(current.temperature_2m, "°")}`),
    conditions
  );
  content.append(hero);

  const details = createElement("section", "details-grid");
  details.setAttribute("aria-label", "Weather details");
  [
    ["Feels like", formatNumber(current.apparent_temperature, "°"), "Apparent temperature"],
    ["Humidity", formatNumber(current.relative_humidity_2m, "%"), "Relative humidity"],
    ["Wind speed", formatNumber(current.wind_speed_10m, " km/h"), "At 10 metres"]
  ].forEach(([label, value, note]) => {
    const card = createElement("article", "detail-card");
    card.append(
      createElement("p", "detail-label", label),
      createElement("p", "detail-value", value),
      createElement("p", "detail-note", note)
    );
    details.append(card);
  });
  content.append(details);

  const daily = data.daily || {};
  const days = Array.isArray(daily.time) ? daily.time : [];
  const forecastSection = createElement("section", "daily-section");
  const sectionHeading = createElement("div", "section-heading");
  sectionHeading.append(
    createElement("p", "eyebrow", "UP NEXT"),
    createElement("h2", "", "Five-day forecast")
  );
  forecastSection.append(sectionHeading);
  const dayGrid = createElement("div", "forecast-grid");
  days.slice(0, 5).forEach((day, index) => {
    const [dayDescription, dayIcon] = readableWeather(daily.weather_code?.[index]);
    const card = createElement("article", "day-card");
    card.append(
      createElement("p", "day-name", formatDay(day, { weekday: "short" })),
      createElement("p", "day-date", formatDay(day, { month: "short", day: "numeric" })),
      createElement("span", "day-icon", dayIcon),
      createElement("p", "day-condition", dayDescription),
      createElement("p", "day-temperatures", `${formatNumber(daily.temperature_2m_max?.[index], "°")} / ${formatNumber(daily.temperature_2m_min?.[index], "°")}`),
      createElement("p", "day-precipitation", `Rain ${formatNumber(daily.precipitation_probability_max?.[index], "%")}`)
    );
    dayGrid.append(card);
  });
  if (!days.length) {
    dayGrid.append(createElement("p", "forecast-unavailable", "The five-day forecast is not available for this location."));
  }
  forecastSection.append(dayGrid);
  content.append(forecastSection);
}

function setBusy(isBusy) {
  document.querySelector(".results").setAttribute("aria-busy", String(isBusy));
}

function statusPanel() {
  return document.querySelector("#status-panel");
}

function cityPicker() {
  return document.querySelector("#city-picker");
}

function weatherContent() {
  return document.querySelector("#weather-content");
}

function showWeather(isVisible) {
  weatherContent().hidden = !isVisible;
}

function showCityPicker(isVisible) {
  cityPicker().hidden = !isVisible;
}
