const apiKey = "a26b03db4b46f5470098ffe06c23f6f9"; // Replace with your actual OpenWeatherMap API key

// Function to get weather by city or village name
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const dateTimeDiv = document.getElementById("dateTime");

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city or village name.</p>";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      resultDiv.innerHTML = `<p>City or village not found ❌</p>`;
      document.body.style.background = "linear-gradient(to right, #ff9a9e, #fad0c4)";
      return;
    }

    displayWeather(data);
    showDateTime(data.timezone);
  } catch (error) {
    resultDiv.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
  }
}

// Function to get weather by current location
function getLocationWeather() {
  const resultDiv = document.getElementById("weatherResult");
  const dateTimeDiv = document.getElementById("dateTime");

  if (navigator.geolocation) {
    resultDiv.innerHTML = "<p>Fetching your location... 🌍</p>";

    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
        showDateTime(data.timezone);
      } catch (error) {
        resultDiv.innerHTML = `<p>Error fetching weather for your location.</p>`;
      }
    }, () => {
      resultDiv.innerHTML = "<p>Location access denied ❌</p>";
    });
  } else {
    resultDiv.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
  }
}

// Function to display weather info
function displayWeather(data) {
  const resultDiv = document.getElementById("weatherResult");

  const city = data.name;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;

  // Change background based on weather
  if (desc.includes("rain")) {
    document.body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)";
  } else if (desc.includes("cloud")) {
    document.body.style.background = "linear-gradient(to right, #d7d2cc, #304352)";
  } else if (desc.includes("sun") || desc.includes("clear")) {
    document.body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
  } else {
    document.body.style.background = "linear-gradient(to right, #74ebd5, #ACB6E5)";
  }

  resultDiv.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
    <p><strong>${city}</strong></p>
    <p>🌡️ Temperature: ${temp} °C</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>🌈 Condition: ${desc}</p>
  `;
}

function showDateTime(timezoneOffset) {
  const dateTimeDiv = document.getElementById("dateTime");

  // Get current UTC time
  const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;

  // Add city timezone offset (in seconds → convert to ms)
  const cityTime = new Date(utcTime + timezoneOffset * 1000);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  dateTimeDiv.innerHTML = `🕒 ${cityTime.toLocaleDateString('en-IN', options)}`;
}

