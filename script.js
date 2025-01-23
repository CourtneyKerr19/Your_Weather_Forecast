const apiKey = "c58deec9381a085ee7a2e646e341e9e6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrlBase = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city = "New York") {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching weather data:", data.message);
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        const cityInfo = {
            name: data.name || "Unknown",
            coordinates: `Lat: ${data.coord?.lat}, Lon: ${data.coord?.lon}` || "Unknown",
            timezone: `UTC ${data.timezone >= 0 ? "+" : ""}${data.timezone / 3600}` || "Unknown",
        };
        console.log("City Info:", cityInfo);

        document.querySelector(".city-name").innerHTML = cityInfo.name;
        document.querySelector(".city-coordinates").innerHTML = cityInfo.coordinates;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        const weatherCondition = data.weather[0].main;
        if (weatherCondition === "Clouds") weatherIcon.src = "images/clouds.png";
        else if (weatherCondition === "Clear") weatherIcon.src = "images/clear.png";
        else if (weatherCondition === "Rain") weatherIcon.src = "images/rain.png";
        else if (weatherCondition === "Drizzle") weatherIcon.src = "images/drizzle.png";
        else if (weatherCondition === "Mist") weatherIcon.src = "images/mist.png";

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        console.error("Error:", error.message);
        document.querySelector(".error").style.display = "block";
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(forecastUrlBase + city + `&appid=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching forecast data:", data.message);
            return [];
        }

        const forecast = data.list.slice(0, 5).map((entry) => ({
            date: entry.dt_txt,
            temperature: `${Math.round(entry.main.temp)}°C`, 
            condition: entry.weather[0].main, 
        }));

        console.log("Forecast Data:", forecast);
        return forecast;

    } catch (error) {
        console.error("Error fetching forecast:", error.message);
        return [];
    }
}

async function displayForecast(city) {
    const forecast = await getForecast(city);

    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = "";

    forecast.forEach((day) => {
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast-day");

        forecastDay.innerHTML = `
            <p>${day.date}</p>
            <p>${day.temperature}</p>
            <p>${day.condition}</p>
        `;

        forecastContainer.appendChild(forecastDay);
    });
}

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();

    if (city === "") {
        console.error("City name is empty");
        document.querySelector(".error").style.display = "block";
        return;
    }

    checkWeather(city); 
    displayForecast(city); 
});

checkWeather();
displayForecast("New York");

searchBox.addEventListener("input", () => {
    const cityPreview = document.querySelector(".city-preview");
    cityPreview.textContent = searchBox.value.trim();  // Shows the current input text as city preview
});