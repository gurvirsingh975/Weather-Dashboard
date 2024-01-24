document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city').value;
    getWeatherData(city);
});

function getWeatherData(city) {
    var apiKey = 'a3a550d2495fedbe1a4d59ffe2b321a5';
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data function
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeatherUI(data);
        })
        .catch(error => console.error('Error fetching current weather:', error));

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            updateForecastUI(data);
        })
        .catch(error => console.error('Error fetching forecast:', error));
}

function updateCurrentWeatherUI(data) {
    const city = data.name;
    const date = new Date(data.dt * 1000);
    const icon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const currentWeatherHtml = `
        <div>
            <h2>${city}</h2>
            <p>Date: ${date.toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${temperature} &#8451;</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
    `;

    document.getElementById('currentWeather').innerHTML = currentWeatherHtml;
}
function updateForecastUI(data) {
    const forecastList = data.list;

    // Group forecast entries by day
    const groupedForecast = forecastList.reduce((acc, forecastItem) => {
        const date = new Date(forecastItem.dt * 1000).toLocaleDateString();

        if (!acc[date]) {
            acc[date] = forecastItem;
        }

        return acc;
    }, {});

    // Create HTML elements to display the forecast information
    const forecastHtml = Object.values(groupedForecast).map(item => {
        const date = new Date(item.dt * 1000);
        const icon = item.weather[0].icon;
        const temperature = item.main.temp;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

        return `
            <div class="forecast-item">
                <p>Date: ${date.toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                <p>Temperature: ${temperature} &#8451;</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    }).join('');

    // Update the forecast UI element
    document.getElementById('forecast').innerHTML = forecastHtml;
}