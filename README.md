# Weatherly

A responsive, beginner-friendly weather dashboard built with HTML5, CSS3, and vanilla JavaScript ES modules. It uses the free Open-Meteo geocoding and forecast APIs; no API key or backend is needed.

## Run locally

1. Open the `weather-forecast-app` folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Search for a city such as Addis Ababa. Select a result when more than one place matches.

ES modules and browser fetch requests work from a local web server. Opening `index.html` directly as a `file://` URL may prevent them from loading.

## Project files

- `index.html` contains the accessible page structure, city search, status region, and module stylesheet/script links.
- `assets/css/style.css` styles the dashboard and adapts it to desktop, tablet, and mobile screens.
- `assets/js/app.js` validates search input and coordinates geocoding, place selection, loading, and forecast requests.
- `assets/js/weather.js` fetches city matches and forecast data from Open-Meteo and reports HTTP errors.
- `assets/js/ui.js` safely creates the loading, empty, error, city-choice, current-weather, and five-day forecast views.
- `assets/images/` is reserved for optional local images; the app currently uses no image assets.

## Data sources and attribution

Weather forecasts are provided by [Open-Meteo](https://open-meteo.com/). City matches come from the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api), and weather data comes from the [Open-Meteo Forecast API](https://open-meteo.com/en/docs).

## Try these cases

- Search **Addis Ababa** and confirm current conditions and five forecast days are shown.
- Search another city, for example **Tokyo** or **Paris**.
- Search **zzzznotacity** to see the no-results message.
- Submit an empty search to see the required-field validation.
- Turn off the network and search again to see the connection error.
- Resize the browser to a phone width; the forecast cards become horizontally scrollable.
