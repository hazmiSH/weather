const { ipcRenderer } = require('electron');

document.getElementById('goToActivitiesButton').addEventListener('click', () => {
    ipcRenderer.send('navigate-to-activities');
});

async function fetchWeather() {
    const location = document.getElementById('locationInput').value;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${location}&days=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();


        // Display key information
        document.getElementById('location').innerText = `Location: ${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById('localTime').innerText = `Local Time: ${data.location.localtime}`;
        document.getElementById('temperature').innerText = `Current Temperature: ${data.current.temp_c}°C`;
        document.getElementById('forecastTemperature').innerText = `Forecast Temperature: ${data.forecast.forecastday[0].day.avgtemp_c}°C`;
        document.getElementById('condition').innerText = `Condition: ${data.current.condition.text}`;
        
        // Log the icon URL for debugging
        const iconUrl = data.current.condition.icon;
        console.log(`Icon URL: ${iconUrl}`);
        
        // Fix the src attribute by adding the equal sign
        document.getElementById('icon').innerHTML = `<img src="https:${data.current.condition.icon}" alt="Weather icon">`;

        document.getElementById('wind').innerText = `Wind Speed: ${data.current.wind_kph} kph`;
        document.getElementById('humidity').innerText = `Humidity: ${data.current.humidity}%`;
        document.getElementById('chanceOfRain').innerText = `Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
        document.getElementById('chanceOfSnow').innerText = `Chance of Snow: ${data.forecast.forecastday[0].day.daily_chance_of_snow}%`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

