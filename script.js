
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWiEL = document.getElementById('current-wi');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForeEl = document.getElementById("weather-fore");
const currentTempEl = document.getElementById("today-temp");

const days =['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const API_KEY = '19733b0913c692ab19390f00230674b4';
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12hr = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    timeEl.innerHTML = hoursIn12hr + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = date +' '+months[month] + ',' + days[day]
}, 1000);

getWeatherData()

function getWeatherData(){
    console.log()
    navigator.geolocation.getCurrentPosition((success) =>{
        let{latitude,longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/3.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)

        .then(res => res.json())
        .then(data =>
            {
                console.log(data)
                showWeatherData(data);
            })
            .catch(error =>{
                console.error("Error fetching weather data:", error);
            }
                )
        })
}

function showWeatherData(data) {
    console.log(data.current);
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

    currentWiEL.innerHTML =
        `<div class="wi">
        <p>Humidity</p>
        <p>${humidity}%</p>
    </div>
    <div class="wi">
        <p>Pressure</p>
        <p>${pressure} hPa</p>
    </div>
    <div class="wi">
        <p>Wind Speed</p>
        <p>${wind_speed} m/s</p>
    </div>
    <div class="wi">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
    </div>
    <div class="wi">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
    </div>`;
    let otherDayForecast = ''
    data.daily.forEach((day,idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
            alt="weather icon" class="w-icon">
           <div class="other">
           <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
           <div class="temp">Morning -${day.temp.day}&#176; C</div>
           <div class="temp">Night - ${day.temp.night}&#176; C</div>
           </div>

            `
        }else{
            otherDayForecast += `
            <div class="weather-fore-item">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Morning - ${day.temp.day}&#176; C</div>
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
        </div>
            `
        }
    })
    weatherForeEl.innerHTML = otherDayForecast;
}
