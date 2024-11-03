const apiKey = '7dfa5e38313bbdecbaf8e3b1ce3ffa5a';
const weatherInfoDiv = document.getElementById('weather-info');
const cityElement = document.getElementById('city');
const descriptionElement = document.getElementById('description');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const weatherIcon = document.getElementById('weather-icon');

// Fetch weather data by user-inputted location
function fetchWeatherByInput() {
    const location = document.getElementById('location-input').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }
    fetchWeatherData(location);
}

// Fetch weather data by current location
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(null, lat, lon);
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Fetch weather data from API
function fetchWeatherData(location, lat = null, lon = null) {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

    if (location) {
        url += `&q=${encodeURIComponent(location)}`;
    } else if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => displayWeatherData(data))
        .catch(error => alert(`Error fetching weather data: ${error.message}`));
}

// Display weather data
function displayWeatherData(data) {
    if (data.cod !== 200) {
        alert(data.message);
        return;
    }

    const { name } = data;
    const { description, main } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    cityElement.textContent = `City: ${name}`;
    descriptionElement.textContent = `Weather: ${description}`;
    temperatureElement.textContent = `Temperature: ${temp}°C`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
    windElement.textContent = `Wind Speed: ${speed} m/s`;

    // Set the weather icon based on the main weather description
    if (main.toLowerCase() === 'clouds') {
        weatherIcon.src = 'cloud.png';
        weatherIcon.alt = 'Cloudy';
    } else if (main.toLowerCase() === 'rain') {
        weatherIcon.src = 'rain.png';
        weatherIcon.alt = 'Rainy';
    } else if (main.toLowerCase() === 'clear') {
        weatherIcon.src = 'sun.png';
        weatherIcon.alt = 'Sunny';
    } else {
        weatherIcon.src = ''; // Hide the icon if weather condition is unknown
    }
    weatherIcon.style.display = weatherIcon.src ? 'block' : 'none';

    weatherInfoDiv.style.display = 'block';
}
