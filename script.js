$(document).ready(function(){
    const apiKey = "3c0052b927f6e7f742d696bf9d0b9013";
    let date = new Date();
    let hour = date.getHours();
    let city = $("#searchVal").val().trim();
    //const history = JSON.parse(localStorage.getItem("cities")) || [];
    //let queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&units=imperial&appid=" + apiKey;
    
    // getData();
    
    $("#searchBtn").on("click", function(e) {
        city = $("#searchVal").val().trim();
      //THE Search Button click keeps the getData() at bay until the event is met. If not the getData() will automatically run  
        getData();
        //get5Day();
        //Code below negates the append and clears the section before the code that displays the next 5 days. Negating the endless appending that can occur.
        $(".5day").empty()
    })
    //established a function before the ajax because it will have nothing to do if nothing is placed
    function getData(){
       let queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
            "q=" + city + "&units=imperial&appid=" + apiKey;
        
        $.ajax({
            //method tells the URL that we are trying to 'GET' information
            method: 'GET',
            //url tells us where the information is coming from given the url
            url: queryURL,
          
        }).then(function(response){
           // console.log(response)
        let citySearch  = response.name;
        $(".current-city").text("Current Weather: " + citySearch);
        let temp = response.main.temp;
        $(".temp").text("Temperature: " + temp + "°F");
        let humid = response.main.humidity;
        $(".humidity").text("Humidity: " + humid + "%"); // changing the doc content
        let wind = response.wind.speed;
        $(".wind").text("Wind: " + wind + "MPH");

        let lat = response.coord.lat;
        let lon = response.coord.lon;
       // console.log(lat,lon);


        //This was previously in the top in the button scope, but in order to call it in the scope function below, it must be done this way
        getUV(lat,lon);
        get5Day(lat,lon);
        });

        
            
    
    };

    function getUV(lat, lon) {
        let uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            method: 'GET',
            url: uvURL,
        }).then(function(response){
            //console.log("fine")
            let uv = response[0].value;
            $(".UV").text("UV Index: " + uv);
        });
    };

    function get5Day(lat, lon){
        let daysURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            method: 'GET',
            url: daysURL,
        }).then(function(response){

            console.log(response);
            //console.log(lat, lon);
            for(let i = 0; i < response.list.length; i+=8){
                let forecastDate = response.list[i].dt_txt;
                let kelvin = response.list[i].main.temp;
                let forecastTemp = ("Temperature (F): " + (((kelvin - 273.15) * 1.80 +32)).toFixed(2));
                let forecastHumidity = ("Humidity: " + response.list[i].main.humidity + "%");
                let forecastCards = $(`
                    <div class="col-sm-2 card-body day${i} daysAhead">
                        <h5>${forecastDate}</h5>
                        <img src='https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png'></img>
                        <p>${forecastTemp}</p>
                        <p>${forecastHumidity}</p>
                    </div>               
                    `);
                $(".5day").append(forecastCards);
            };
        });
    };
});

