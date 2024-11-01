async function fetchWeatherData(location) {
  const apiKey = '32804b24a847407391c53709241010'; // Your API key
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`);
  
  if (!response.ok) {
      console.error('Error fetching weather data:', response.statusText);
      return;
  }

  const data = await response.json();
  displayWeather(data);
  displayActivityRecommendation(data);
  storeWeatherData(data); // Store data in localStorage
}

function displayWeather(data) {
  const locationInfo = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
  document.getElementById('location').textContent = locationInfo;
  document.getElementById('current-temp').textContent = `Current Temperature: ${data.current.temp_c}°C`;
  document.getElementById('forecast-temp').textContent = `Forecast Temperature: ${data.forecast.forecastday[0].day.avgtemp_c}°C`;
  document.getElementById('conditions').textContent = `Weather: ${data.current.condition.text}`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${data.current.wind_kph} kph`;
  document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
  document.getElementById('rain-chance').textContent = `Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;

  const localTime = new Date(data.location.localtime);
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
  document.getElementById('local-time').textContent = `Local Time: ${formattedTime}`;

  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.src = `https:${data.current.condition.icon}`;
  weatherIcon.alt = "Weather icon";
}

function displayActivityRecommendation(data) {
  const temp = data.current.temp_c;
  const windSpeed = data.current.wind_kph;
  const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain;
  let recommendation = '';

  if (temp > 15 && temp < 25 && windSpeed < 20 && rainChance < 20) {
      recommendation = "Great weather for hiking!";
  } else if (temp > 20 && temp < 30 && windSpeed > 5 && windSpeed < 25 && rainChance < 30) {
      recommendation = "Ideal conditions for paragliding!";
  } else if (rainChance > 50) {
      recommendation = "It looks like there's a high chance of rain today.You might want to consider indoor activitieslike play chess or be prepared with an umbrella if you need to be outside. Stay dry!";
  } else {
      recommendation = "By the weather information It could be good for a brisk walk or some light outdoor activities, but it might not be the most pleasant weather for more extensive outdoor adventures.";
  }

  document.getElementById('activity-recommendation').innerHTML = recommendation;
  return recommendation; // Return the recommendation
}

function storeWeatherData(data) {
  const recommendation = displayActivityRecommendation(data); // Get the recommendation

  // Format the local time
  const localTime = new Date(data.location.localtime);
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

  const weatherInfo = {
      location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
      currentTemp: `Current Temperature: ${data.current.temp_c}°C`,
      forecastTemp: `Forecast Temperature: ${data.forecast.forecastday[0].day.avgtemp_c}°C`,
      conditions: `Weather: ${data.current.condition.text}`,
      windSpeed: `Wind Speed: ${data.current.wind_kph} kph`,
      humidity: `Humidity: ${data.current.humidity}%`,
      rainChance: `Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`,
      recommendation: recommendation,
      localTime: `Local Time: ${formattedTime}` // Add local time
  };

  localStorage.setItem("weatherData", JSON.stringify(weatherInfo));
}

document.getElementById('get-weather').addEventListener('click', () => {
  const locationInput = document.getElementById('location-input').value;
  if (locationInput) {
      fetchWeatherData(locationInput);
  } else {
      alert('Please enter a location');
  }
});
