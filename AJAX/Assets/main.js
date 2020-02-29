var locations = [];

const LoadLocations = () => {
    if(!localStorage.getItem('locations')){
        localStorage.setItem('locations', JSON.stringify(locations));
    } else {
        locations = JSON.parse(localStorage.getItem('locations'));
    }

    let html = '';
    locations.forEach( (loc) => {
        html += `<li id='${loc}'>${loc}</li>`;
    });

    $('#history').html(html);
}

LoadLocations();

$('li').on('click', (event) => {
    $('#location').val(event.currentTarget.innerHTML);
    LoadWeather();
});


$('#search').on('click',(err) => {
    LoadWeather();
});

$('#location').keypress((event)=>{
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    if(keyCode== '13')
        LoadWeather();
});

const LoadWeather = () => {
    // Get an API Key from OpenWeatherMap API
    let APIKey = "74e44f1ee042c90125ceb0fa3902d65f";
    // Get location from User
    let location = $('#location').val();
    // Create an AJAX call to retrieve data Log the data in console
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
    let forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKey}`;

    // Log the data in HTML
    $.ajax({url: queryURL, method: "GET"}).then(function(response){
        $("#currentWeatherCity").text(response.name);
        $("#currentWeatherDate").text(moment().format(`MMM Do`));
        $("#currentWeatherIcon").attr('src',`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        // $(".icon").css('background-repeat','no-repeat');
        // $(".icon").css('background-size','25px 25px');
        $("#currentWeatherTemp").text(`Temperature: ${Math.floor((parseInt(response.main.temp)-273.15)*1.80+32)}\u00b0F`);
        $("#currentWeatherHumidity").text(`Humidity: ${response.main.humidity}%`);
        $("#currentWeatherWind").text(`Wind: ${response.wind.speed}m/s @${response.wind.deg}\u00b0`);

        // console.log(response);
        if(!locations.includes(location)) {
            locations.push(location);
            localStorage.setItem('locations',JSON.stringify(locations));
        }
        $('#history').css('display', 'none');

        $.ajax({url: `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`, method: "GET"}).then( (UV) => {
            $("#currentWeatherUV").text(`UV index: ${UV.value}`);
        });
    }).catch( (err) => {
        alert(`Check input. (city,state <= no abbreviations)\n${err.code}`);
    });

    $.ajax({url: forecastURL, method: "GET"}).then(function(response){
        // console.log(response);
        for (let i=1; i<=5; i++){
            let forecast = response.list[i+(i-1)*8]
            $(`#forecast${i}Date`).text(forecast.dt_txt.split(' ')[0]);
            $(`#forecast${i}Icon`).attr('src', `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`);
            $(`#forecast${i}Temp`).html(`Temp: <span style="color:blue">${Math.floor((parseInt(forecast.main.temp_min)-273.15)*1.80+32)}\u00b0F</span>/<span style="color:red">${Math.floor((parseInt(forecast.main.temp_max)-273.15)*1.80+32)}\u00b0F</span>`);
            $(`#forecast${i}Humidity`).text(`Humidity: ${forecast.main.humidity}%`);
        }
    });
}