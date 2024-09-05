const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "6cfb7244a2c4a5aa28ffff4c885a0024";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city) {
    displayLoadingState(); // Show a loading state
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
      cityInput.value = ""; // Clear the input after successful fetch
    } catch (error) {
      console.error("Error fetching weather data:", error);
      displayError("Could not fetch weather data. Please try again later.");
    }
  } else {
    displayError("Please enter a city.");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorMessage = `Error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Could not fetch weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or API error:", error);
    throw new Error("Could not fetch weather data");
  }
}

function displayLoadingState() {
  card.textContent = "Loading...";
  card.style.display = "flex";
}

function displayWeatherInfo(data) {
  const cityDisplay = document.createElement("h1");
  cityDisplay.textContent = data.name;
  cityDisplay.classList.add("cityDisplay");

  const tempDisplay = document.createElement("p");
  tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
  tempDisplay.classList.add("tempDisplay");

  const weatherEmoji = document.createElement("p");
  weatherEmoji.textContent = getWeatherEmoji(data.weather[0].id);
  weatherEmoji.classList.add("weatherEmoji");

  const descDisplay = document.createElement("p");
  descDisplay.textContent = capitalizeFirstLetter(data.weather[0].description);
  descDisplay.classList.add("descDisplay");

  const humidityDisplay = document.createElement("p");
  humidityDisplay.textContent = `Humidity: ${data.main.humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  card.textContent = ""; // Clear previous content
  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(weatherEmoji);
  card.appendChild(descDisplay);
  card.appendChild(humidityDisplay);
  card.style.display = "flex";
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return "⛈️"; // Thunderstorm
  } else if (weatherId >= 300 && weatherId < 500) {
    return "🌧️"; // Drizzle
  } else if (weatherId >= 500 && weatherId < 600) {
    return "🌦️"; // Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return "❄️"; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return "🌫️"; // Atmosphere (fog, mist, etc.)
  } else if (weatherId === 800) {
    return "☀️"; // Clear sky
  } else if (weatherId > 800) {
    return "☁️"; // Clouds
  } else {
    return "🌡️"; // Default emoji
  }
}

function displayError(message) {
  card.textContent = ""; // Clear previous content
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  card.appendChild(errorDisplay);
  card.style.display = "flex";
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
