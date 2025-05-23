# 🌦️ Weather Forecast Application

## Overview

This project is a responsive weather forecast application built with **JavaScript**, **HTML**, **CSS**, and **Tailwind CSS**. It retrieves weather data from the OpenWeatherMap API and displays it in a user-friendly interface. The app supports location-based forecasts, current weather, extended forecasts, and recent city searches.

---

## Features

- **Search by City Name:** Enter any city to get its current and extended weather.
- **Location-Based Forecast:** Get weather for your current location using geolocation.
- **Recent Cities Dropdown:** Quickly select from recently searched cities (stored in localStorage).
- **Responsive UI:** Looks great on desktop, iPad Mini, and iPhone SE.
- **Weather Icons & Backgrounds:** Visual cues for sunny, cloudy, rainy, snow, and more.
- **Extended Forecast:** View multi-day (5-day or 7-day) forecasts.
- **Error Handling:** User-friendly messages for invalid input or API errors.
- **Loading Spinner:** Shows while fetching data.
- **Input Validation:** Prevents empty or invalid city searches.
- **Version Control:** All code tracked with Git.

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/Manidrag/The-Weather
cd The-Weather
```

### 2. **Install Dependencies**

If using Tailwind CLI (recommended):

```bash
npm install
```

### 3. **Configure API Key**

- Create a `config.js` file in the project root:
    ```js
    // config.js
    const KEYsyy = "YOUR_OPENWEATHERMAP_API_KEY";
    ```
- Replace `"YOUR_OPENWEATHERMAP_API_KEY"` with your actual API key from [OpenWeatherMap](https://openweathermap.org/api).

### 4. **Build Tailwind CSS**

If you change Tailwind classes or `style.css`, rebuild with:

```bash
npx tailwindcss -i ./css/style.css -o ./css/output.css --watch
```

### 5. **Run the App**

- Open `index.html` directly in your browser, or use a local server (like VS Code Live Server).

---

## Usage

- **Search for a city:** Type a city name and click **Search**.
- **Use your location:** Click the 📍 **Location** button to get weather for your current location.
- **Recent cities:** Click the input to see and select from recent searches.
- **View extended forecast:** Scroll down to see hourly and daily forecasts.
- **Visual backgrounds:** The background changes based on weather (sunny, rain, snow, etc.).

---

## Project Structure

```
the-weather-api/
├── index.html
├── bgimage.css
├── css
│   ├── style.css
│   └── output.css
├── src/
│   └── bgimages
├── Script.js
├── config.js
├── tailwind.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Customization

- **Background Images:** Edit `bgimage.css` to use your own images for different weather types.
- **Forecast Days:** Change the number of days in the API call for longer/shorter forecasts.
- **Styling:** Modify Tailwind classes in `index.html` for a different look.

---

## Error Handling

- Alerts for invalid city names, empty input, or API/network errors.
- Loading spinner appears while fetching data.

---

## License

MIT

---

## Credits

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Tailwind CSS](https://tailwindcss.com/)
- Weather icons and backgrounds: pixabay.com.

---

## Author

- Manish Krishna Joshi

---

**Happy Weather Watching!**