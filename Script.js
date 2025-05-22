let latitude;
let longitude;
let locationOn = false;
// Remove the parentheses () after getlocation
document.querySelector("#locationToggleBtn").addEventListener("click", getlocation);
function getlocation() {
    locationOn = !locationOn;
    const icon = document.getElementById("locationToggleIcon");
    const text = document.getElementById("locationToggleText");
    
    if (locationOn) {
        icon.textContent = "✅";
        text.textContent = "Location On";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    getWeather();
                },
                function(error) {
                    console.error("Error getting location:", error);
                    alert("Unable to get location.");
                    // Reset the toggle if location fails
                    locationOn = false;
                    icon.textContent = "📍";
                    text.textContent = "Location Off";
                }
            );
        }
    } else {
        icon.textContent = "📍";
        text.textContent = "Location Off";
        // Clear weather displays
        document.querySelector("#currentWeather").innerHTML = "";
        document.querySelector("#hourlyForecast").innerHTML = "";
    }
}

// Get User Location based on Permission
const weatheryk = document.querySelector("#getWeatherButton").addEventListener("click", getCity);

//Get city log and lat
async function getCity() {
    const city = document.querySelector("#city").value;
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${KEYsyy}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!data.length) {
        alert("City not found.");
        return;
    }
    latitude = data[0].lat;
    longitude = data[0].lon;
    getWeather();
}

//Get Weather Data
let currentWeatherdata;
let hourlyWeatherdata;

async function getWeather() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEYsyy}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    currentWeatherdata = data;

    // Use free 3-hourly forecast endpoint
    const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${KEYsyy}`;
    const response2 = await fetch(apiUrl2);
    const data2 = await response2.json();
    hourlyWeatherdata = data2;
    displayWeatherCurrent();
    displayWeatherHourly();
}

//Display Weather Data
function displayWeatherCurrent() {
    const weatherContainer = document.querySelector("#currentWeather");
    weatherContainer.innerHTML = `
        <div class="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-blue-200 mt-4 max-w-md mx-auto">
            <h1 class="text-2xl font-bold text-blue-700 mb-2">Weather in ${currentWeatherdata.name}</h1>
            <p class="text-lg font-semibold">🌡️ Temperature: <span class="text-blue-600">${currentWeatherdata.main.temp}°C</span></p>
            <p>💧 Humidity: ${currentWeatherdata.main.humidity}%</p>
            <p>💨 Wind Speed: ${currentWeatherdata.wind.speed} m/s</p>
            <p>🌤️ Description: ${currentWeatherdata.weather[0].description}</p>
            <p>🤗 Feels Like: ${currentWeatherdata.main.feels_like}°C</p>
        </div>
         <h2 class="text-xl font-bold text-blue-700 mb-4 ml-2">24-Hour Forecast</h2>
    `;
}

function displayWeatherHourly() {
    const weatherContainer = document.querySelector("#hourlyForecast");
    weatherContainer.innerHTML = `
       
        <div class="flex gap-1 overflow-x-auto pb-4" id="hourlyCards"></div>
    `;
    const grid = document.getElementById("hourlyCards");
    // Show up to 24 hours
    hourlyWeatherdata.list.slice(0, 24).forEach((hour) => {
        const hourDiv = document.createElement("div");
        hourDiv.className = "min-w-[200px] w-max bg-gradient-to-br from-blue-100 to-amber-100 rounded-2xl shadow-lg p-5 flex flex-col items-center border border-blue-200 transition-transform hover:scale-105 duration-200";
        hourDiv.innerHTML = `
    <p class="text-lg font-semibold text-blue-700 mb-2">
    ${new Date(hour.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
  </p>
  <div class="flex items-center gap-2 mb-2">
    <span class="text-3xl">🌡️</span>
    <span class="text-xl font-bold text-blue-600">${hour.main.temp}°C</span>
  </div>
  <p class="flex items-center gap-1 text-blue-800 mb-1">
    <span class="text-lg">💧</span> <span>${hour.main.humidity}%</span>
  </p>
  <p class="flex items-center gap-1 text-blue-800 mb-1">
    <span class="text-lg">💨</span> <span>${hour.wind.speed} m/s</span>
  </p>
  <p class="italic text-slate-600 mt-2 text-center capitalize">
    ${hour.weather[0].description}
  </p>
        `;
        grid.appendChild(hourDiv);
    });
    //when we got the data and displayed hiding the search div and showing the weather div and hourly div and the location button left side small search in put at right side to search for another city
   document.querySelector("#location").style.display = "none";
   document.querySelector("#searchweather").style.display = "none";
   document.querySelector("#hourlyForecast").style.display = "block";
    document.querySelector("#currentWeather").style.display = "block";

}

