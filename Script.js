

//background
function setWeatherBackground(temp, weatherMain, weatherDescription = "") {
    const body = document.body;
    // Remove all possible weather backgrounds first
    body.classList.remove(
        "bg-snow", "bg-meteor", "bg-rain", "bg-cloudy", "bg-sunny", "bg-thunder", "bg-mist", "bg-drizzle", "bg-default"
    );

    const main = weatherMain.toLowerCase();
    const desc = weatherDescription.toLowerCase();

    if (temp <= 1 || main.includes("snow") || desc.includes("snow")) {
        body.classList.add("bg-snow");
    } else if (temp >= 40) {
        body.classList.add("bg-meteor");
    } else if (main.includes("clear") || desc.includes("clear")) {
        body.classList.add("bg-sunny");
    } else if (main.includes("cloud") || desc.includes("cloud")) {
        body.classList.add("bg-cloudy");
    } else if (main.includes("rain") || desc.includes("rain")) {
        body.classList.add("bg-rain");
    } else if (main.includes("thunder") || desc.includes("thunder")) {
        body.classList.add("bg-thunder");
    } else if (main.includes("drizzle") || desc.includes("drizzle")) {
        body.classList.add("bg-drizzle");
    } else if (main.includes("mist") || desc.includes("mist") || main.includes("fog") || desc.includes("fog") || main.includes("haze") || desc.includes("haze")) {
        body.classList.add("bg-mist");
    } else {
        body.classList.add("bg-default"); 
    }
}

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
        showLoading();
        icon.textContent = "✅";
        text.textContent = "Location On";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    hideLoading();
                    getCity();
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
        document.querySelector("#dailyForecast").innerHTML = "";
    }
}
//Dropdown for recent cities

// Save recent city and update datalist
function saveRecentCity(city) {
    let recent = JSON.parse(localStorage.getItem('recentCities') || '[]');
    recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
    recent.unshift(city);
    if (recent.length > 5) recent = recent.slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(recent));
    updateDatalist();
}

function updateDatalist() {
    const datalist = document.getElementById('cityOptions');
    let recent = JSON.parse(localStorage.getItem('recentCities') || '[]');
    datalist.innerHTML = recent.map(city => `<option value="${city}"></option>`).join('');
}


updateDatalist();


// Get API Key
// Get User Location based on Permission
const weatheryk = document.querySelector("#getWeatherButton").addEventListener("click", () => {
    locationOn = false;
    const icon = document.getElementById("locationToggleIcon");
    const text = document.getElementById("locationToggleText");
    icon.textContent = "📍";
    text.textContent = "Location Off";
    getCity();
});

 
//Get city log and lat
async function getCity() {
   
   if(locationOn) {
      
   
   try{ showLoading();
    const apiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${KEYsyy}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.status !== 200 || !data[0]) {
        alert("Location not found. Please try again.");
        hideLoading();
        return;
    }
    city = data[0].name;
    saveRecentCity(city);
    getWeather();
   } catch (error) {
    alert("Error fetching city data. Please try again.");
       console.error("Error fetching city data:", error);
   } finally {
       hideLoading();
   }
   } else {
       city = document.querySelector("#city").value;
       if (!city) {
           alert("Please enter a city name.");
           return;
       }
       saveRecentCity(city);
       getWeather();
   }
}

//Get Weather Data
let currentWeatherdata;
let hourlyWeatherdata;
let dailyWeatherdata;

async function getWeather() {
    try {
        showLoading();

        // Get current weather data
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYsyy}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.status !== 200 || !data.main) {
            alert("City not found. Please enter a valid city name.");
            hideLoading();
            return;
        }
        currentWeatherdata = data;
        setWeatherBackground(currentWeatherdata.main.temp, currentWeatherdata.weather[0].main, currentWeatherdata.weather[0].description);

        // Use free 3-hourly forecast endpoint
        const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${KEYsyy}&units=metric`;
        const response2 = await fetch(apiUrl2);
        const data2 = await response2.json();
        if (response2.status !== 200 || !data2.list) {
            alert("Hourly forecast not found for this city.");
            hideLoading();
            return;
        }
        hourlyWeatherdata = data2;
       

        // Daily weather data
        const apiUrl3 = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${KEYsyy}&units=metric`;
        const response3 = await fetch(apiUrl3);
        const data3 = await response3.json();
        if (response3.status !== 200 || !data3.list) {
            alert("Daily forecast not found for this city.");
            hideLoading();
            return;
        }
        dailyWeatherdata = data3;

        // Only display if all data is valid
        displayWeatherCurrent();
        displayWeatherHourly();
        displayWeatherDaily();

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data.");
    } finally {
        hideLoading();
    }
}

function displayWeatherCurrent() {
     console.log(hourlyWeatherdata);
     const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const weatherContainer = document.querySelector("#currentWeather");
    weatherContainer.innerHTML = `
        <div class="bg-gradient-to-br from-blue-100 to-amber-100 rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 border-4 border-blue-300 mt-8 max-w-2xl mx-auto scale-105 hover:shadow-2xl transition-all duration-300">
          <p class="text-lg text-blue-600 font-medium">${currentDate}</p>  
        <h1 class="text-4xl font-extrabold text-blue-800 mb-2 tracking-wide">${currentWeatherdata.name}</h1>
            <div class="flex items-center gap-6">
                <span class="text-6xl">🌡️</span>
                <span class="text-5xl font-bold text-blue-700">${currentWeatherdata.main.temp}°C</span>
            </div>
            <div class="flex flex-wrap justify-center gap-8 mt-4">
                <p class="flex items-center gap-2 text-lg text-blue-900">
                    <span class="text-2xl">💧</span>
                    <span class="font-semibold">${currentWeatherdata.main.humidity}%</span>
                </p>
                <p class="flex items-center gap-2 text-lg text-blue-900">
                    <span class="text-2xl">💨</span>
                    <span class="font-semibold">${currentWeatherdata.wind.speed} m/s</span>
                </p>
            </div>
            <p class="text-xl text-slate-700 mt-2 capitalize font-medium">
                <span class="text-2xl">🌤️</span> ${currentWeatherdata.weather[0].description}
            </p>
            <p class="text-lg text-amber-700">Feels Like: ${currentWeatherdata.main.feels_like}°C</p>
        </div>
    `;
   
}

// Display hourly weather data
function displayWeatherHourly() {
    const weatherContainer = document.querySelector("#hourlyForecast");
    weatherContainer.style.display = "block";
    weatherContainer.innerHTML = `<div class="relative max-w-5xl mx-auto mt-8 px-4">
            <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">24-Hour Forecast</h2>
            <button id="scrollLeft" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/80 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 md:left-2 " >←</button>
            <div class="overflow-hidden">
                <div class="flex gap-4 transition-transform duration-300 scroll-smooth" id="hourlyCards"></div>
            </div>
            <button id="scrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/80 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 md:right-2" >→</button>
        </div>
        `;

    // Only add cards if not already present
    const grid = document.getElementById("hourlyCards");
    grid.innerHTML = ""; // Clear previous cards

    hourlyWeatherdata.list.slice(0, 24).forEach((hour) => {
        const hourDiv = document.createElement("div");
        hourDiv.className = "min-w-[180px] bg-white/90 rounded-2xl shadow-lg p-5 flex flex-col items-center border border-blue-200 transition-all duration-200 hover:shadow-xl hover:scale-105 hover:bg-white";
        hourDiv.innerHTML = `
<p class="text-lg font-semibold text-blue-700 mb-2">
    ${new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })}
</p>
            <div class="flex items-center gap-2 mb-3">
                <span class="text-3xl">🌡️</span>
                <span class="text-2xl font-bold text-blue-600">${hour.main.temp}°C</span>
            </div>
            <div class="space-y-2 w-full">
                <p class="flex items-center justify-between text-blue-800">
                    <span class="text-lg">💧</span> 
                    <span class="font-medium">${hour.main.humidity}%</span>
                </p>
                <p class="flex items-center justify-between text-blue-800">
                    <span class="text-lg">💨</span> 
                    <span class="font-medium">${hour.wind.speed} m/s</span>
                </p>
            </div>
            <p class="italic text-slate-600 mt-3 text-center capitalize font-medium">
                ${hour.weather[0].description}
            </p>
        `;
        grid.appendChild(hourDiv);
    });

   
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const container = document.getElementById('hourlyCards');
    
    let currentCard = 0;
    const totalCards = hourlyWeatherdata.list.length;
    
    scrollLeftBtn.onclick = () => {
        if (currentCard > 0) {
            currentCard = Math.max(0, currentCard - 1);
            container.children[currentCard].scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    scrollRightBtn.onclick = () => {
        if (currentCard < totalCards - 1) {
            currentCard = Math.min(totalCards - 1, currentCard + 1);
            container.children[currentCard].scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };
}

//display daily weather data
function displayWeatherDaily() {
    const weatherContainer = document.querySelector("#dailyForecast");
    weatherContainer.innerHTML = `
        <div class="relative max-w-4xl md:max-w-6xl mx-auto mt-8 px-12">
            <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">7-Day Forecast</h2>
            <button id="scrollLeftDailyBtn" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/80 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg">←</button>
            <div class="overflow-hidden">
                <div id="dailyCards" class="flex gap-4 transition-all duration-300"></div>
            </div>
            <button id="scrollRightDailyBtn" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/80 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg">→</button>
        </div>
    `;

    const cardsContainer = document.getElementById("dailyCards");

    dailyWeatherdata.list.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const dayDiv = document.createElement("div");
        dayDiv.className = "min-w-[220px] bg-white/90 rounded-2xl shadow-lg p-5 flex flex-col items-center border border-blue-200 transition-all duration-200 hover:shadow-xl hover:scale-105";
        
        dayDiv.innerHTML = `
            <p class="font-semibold text-blue-700 text-lg mb-2">
                ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <div class="flex items-center gap-2 mb-3">
                <span class="text-3xl">🌡️</span>
                <div class="flex flex-col">
                    <span class="text-xl font-bold text-blue-600">${day.temp.max}°C</span>
                    <span class="text-sm text-gray-500">${day.temp.min}°C</span>
                </div>
            </div>
            <div class="w-full space-y-2">
                <p class="flex items-center justify-between text-blue-800">
                    <span class="text-lg">💧</span> 
                    <span class="font-medium">${day.humidity}%</span>
                </p>
                <p class="flex items-center justify-between text-blue-800">
                    <span class="text-lg">💨</span> 
                    <span class="font-medium">${day.speed} m/s</span>
                </p>
            </div>
            <p class="italic text-slate-600 mt-3 text-center capitalize">
                ${day.weather[0].description}
            </p>
            <div class="mt-2 text-sm text-gray-500">
                <p>Morning: ${day.temp.morn}°C</p>
                <p>Day: ${day.temp.day}°C</p>
                <p>Evening: ${day.temp.eve}°C</p>
                <p>Night: ${day.temp.night}°C</p>
            </div>
        `;
        cardsContainer.appendChild(dayDiv);
    });

    // Add scroll functionality
    const scrollLeftBtn = document.getElementById('scrollLeftDailyBtn');
    const scrollRightBtn = document.getElementById('scrollRightDailyBtn');
    const container = document.getElementById('dailyCards');

    let currentCard = 0;
    const totalCards = dailyWeatherdata.list.length;

    scrollLeftBtn.onclick = () => {
        if (currentCard > 0) {
            currentCard = Math.max(0, currentCard - 1);
            container.children[currentCard].scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    scrollRightBtn.onclick = () => {
        if (currentCard < totalCards - 1) {
            currentCard = Math.min(totalCards - 1, currentCard + 1);
            container.children[currentCard].scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };
}
//Loading Spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}
function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}