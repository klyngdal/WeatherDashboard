$(document).ready(function () {

    // FUNCTIONS
    function show(data) {
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        `
    }
    function showUV(data) {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        console.log(uvDisplay);
        return `
        <p><strong>UV Index:</strong>:${data.value}</p>
        `
    }

    function displayCities(cityList) {
        $('.city-list').empty();
        let list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        
        if (list) {
            for (let i = 0; i < cityList.length; i++) {
                let container = $("<div class=card></div>").text(cityList[i]);
                $('.city-list').prepend(container);
            }
        }
    }
   

    function showForecast(data) {
       let forecast = data.list; 
        
        // We want every 5th object's date, icon, temp, humidity (index 4)
        // Display date, icon, temp and humidity via html
        let currentForecast = [];
        for (let i = 0; i < forecast.length; i++) {

            let currentObject = forecast[i];
            // First time through loop - 0: {}
            // Second time through loop - 1: {} 
            //...
            let dt_time = currentObject.dt_txt.split(' ')[1] 
            
            if (dt_time === "12:00:00") {
                // currentObject.main ... time, icon, temp, humidity
                let main = currentObject.main;
                
                let temp = main.temp; //Convert to F
                let humidity = main.humidity;
                let date = moment(currentObject.dt_txt).format('l'); // Use MomentJS to convert
                let icon = currentObject.weather[0].icon;
                let iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }

        }
        $("#5-day-forecast").html(currentForecast.join(''));

    }

    // METHOD

    let stored = localStorage.getItem("cityList")
    if (stored) {
        cityList = JSON.parse(stored)
    } else {
        cityList = []
    }
    //let cityList = [];
    $('#submitCity').click(function (event) {
        event.preventDefault();
        let city = $('#city').val();
        // push city to cityList array
        cityList.push(city);
        // set cityList in localStorage 
        localStorage.setItem("cityList", JSON.stringify(cityList));
        // check length of array. if > 5 then don't add.
        displayCities(cityList);
        if (city != '') {

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
                type: "GET",
                success: function (data) {
                    let display = show(data);
                    $("#show").html(display);
                }
            });

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
                type: "GET",
                success: function (data) {
                    let forecastDisplay = showForecast(data)
                    // add to page
                }
            });
           
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a" + "&lat=" + lat + "&lon=" + lon,
                type: "GET",
                sucess: function (data) {
                    let uvDisplay = showUV(data);
                    console.log(uvDisplay, "uvDisplay");
                }
            });

        } else {
            $('#error').html('Please insert a city name:');
        }
    });

    displayCities(cityList);

});



