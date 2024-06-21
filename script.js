document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.weather-app');
    const temp = document.querySelector('.temp');
    const dateOutput = document.querySelector('.date');
    const timeOutput = document.querySelector('.time');
    const conditionOutput = document.querySelector('.condition');
    const nameOutput = document.querySelector('.name');
    const icon = document.querySelector('.icon');
    const cloudOutput = document.querySelector('.cloud');
    const humidityOutput = document.querySelector('.humidity');
    const windOutput = document.querySelector('.wind');
    const form = document.getElementById('locationInput');
    const search = document.querySelector('.search');
    const btn = document.querySelector('.submit');
    const cities = document.querySelectorAll('.city');

    let cityInput = "Pune";

    cities.forEach(city => {
        city.addEventListener('click', e => {
            cityInput = e.target.textContent;
            fetchWeatherData();
            app.style.opacity = "0";
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (search.value.trim().length === 0) {
            alert('Please type in a city name');
        } else {
            cityInput = search.value.trim();
            fetchWeatherData();
            search.value = "";
            app.style.opacity = "0";
        }
    });

    function dayOfTheWeek(day, month, year) {
        const weekday = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        return weekday[new Date(`${year}-${month}-${day}`).getDay()];
    }

    function fetchWeatherData() {
        const apiKey = 'f7384650901f4e5685d93033242006'; // Replace with your actual API key
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cityInput)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);

                temp.innerHTML = `${data.current.temp_c}&#176;`;
                conditionOutput.innerHTML = data.current.condition.text;

                const localtime = data.location.localtime;
                const y = parseInt(localtime.substr(0, 4));
                const m = parseInt(localtime.substr(5, 2));
                const d = parseInt(localtime.substr(8, 2));
                const time = localtime.substr(11);

                dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
                timeOutput.innerHTML = time;
                nameOutput.innerHTML = data.location.name;

                // Ensure the icon URL is complete
                const iconUrl = `https:${data.current.condition.icon}`;
                icon.src = iconUrl;

                cloudOutput.innerHTML = `${data.current.cloud}%`;
                humidityOutput.innerHTML = `${data.current.humidity}%`;
                windOutput.innerHTML = `${data.current.wind_kph} km/h`;

                let timeOfDay = data.current.is_day ? "day" : "night";
                const code = data.current.condition.code;

                const weatherConditions = {
                    clear: [1000],
                    cloudy: [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282],
                    rainy: [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252],
                    snowy: [] // Add appropriate codes if necessary
                };

                if (weatherConditions.clear.includes(code)) {
                    app.style.backgroundImage = `url(${timeOfDay}_clear.jpg)`;
                    btn.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
                } else if (weatherConditions.cloudy.includes(code)) {
                    app.style.backgroundImage = `url(${timeOfDay}_cloudy.jpg)`;
                    btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
                } else if (weatherConditions.rainy.includes(code)) {
                    app.style.backgroundImage = `url(${timeOfDay}_rainy.jpg)`;
                    btn.style.background = timeOfDay === "night" ? "#325c80" : "#647d75";
                } else {
                    app.style.backgroundImage = `url(${timeOfDay}_snowy.jpg)`;
                    btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";
                }

                app.style.opacity = "1";
            })
            .catch(error => {
                alert(error.message);
                app.style.opacity = "1";
            });
    }

    // Initial fetch of weather data
    fetchWeatherData();
    app.style.opacity = "1";
});
