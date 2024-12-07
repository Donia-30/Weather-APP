const navLinks = document.querySelectorAll('.nav-item a');

// active link in navbar
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

document.getElementById('city-input').addEventListener('input', getWeather);

function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (city === "") {
        // ue Geolocation API when input is empty (ask user to use your location)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;  
                const lon = position.coords.longitude;  
                getWeatherByCoordinates(lat, lon);
            }, function(error) {
                console.error('Error getting location', error);
                alert('Unable to retrieve your location');
                clearWeatherData();
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            clearWeatherData();
        }
    } else {
        // display the city that user enter 
        getWeatherByCity(city);
    }
}

//display the city that user enter
function getWeatherByCity(city) {
    const apiKey = 'c6d14833fe5749aaaff113032240612';  //my API
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&lang=ar`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // delete data when not found city
                clearWeatherData();
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            clearWeatherData();
            console.error('Error fetching weather data', error);
        });
}

// use location to know weather
function getWeatherByCoordinates(lat, lon) {
    const apiKey = 'c6d14833fe5749aaaff113032240612';  // my API
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&lang=ar`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                clearWeatherData();
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            clearWeatherData();
            console.error('Error fetching weather data', error);
        });
}

//display weather
function displayWeather(data) {
    const forecast = data.forecast.forecastday;
    const location = data.location;

    // card of day1
    updateCard('.day1', forecast[0], location, getDayName(forecast[0].date));

    // card of day2
    updateCard('.day2', forecast[1], location, getDayName(forecast[1].date));

    // card of day3
    updateCard('.day3', forecast[2], location, getDayName(forecast[2].date));
}

// update card with new data
function updateCard(cardClass, dayData, location, dayName) {
    const card = document.querySelector(cardClass);

    //insert city name 
    card.querySelector('.location').textContent = location.name;

    // insert date
    card.querySelector('.date').textContent = dayName + ", " + formatDate(dayData.date);

    // insert temp, condition
    card.querySelector('.temp').textContent = `${dayData.day.avgtemp_c}°C`;
    card.querySelector('.condition').textContent = dayData.day.condition.text;

    // icon moon,sun
    const isDay = dayData.day.is_day;
    const icon = isDay ? '🌞' : '🌙';  
    card.querySelector('.day-night').textContent = icon;
}

// change date to day
function getDayName(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
}

// display date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;  
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
