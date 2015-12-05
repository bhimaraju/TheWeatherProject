var forecastType = {
    today: "conditions",
    hourly: "hourly",
    daily: "forecast"
};
var wUndergroundKey = "YOUR-WEATHER-UNDERGROUND-KEY";
var googleMapsKey = "YOUR-GOOGLE-MAPS-API-KEY";
var currentForecastType = forecastType.today;
var timeArray = ["4:00 AM"];
var tempArrayF = [];
var tempArrayC = [];
var tempArray = [];
var tempType = "C";
var currentTime;
var coord = [];
var autocomplete, city, state, country;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

//Sets metric or imperial units
function setTempPref() {
    hourlyGraph(tempType);
    if (tempType == 'F') {
        $(".C").hide();
        $(".F").show();
    } else if (tempType == 'C') {
        $(".F").hide();
        $(".C").show();
    }
}

//Code for to call the Google Places API which enables autocomplete
function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')),
        { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.

    autocomplete.addListener('place_changed', getPlaceAddress);
}

//Function to fetch and display the current conditions for a selected location
function currentConditions(location, fn) {
    var request = {
        Location: location,
        Forecast: "conditions"
    };

    console.log(request);

    //The ajax call to the C# code which return HTML created from XSLT
    $.ajax({
        url: '/home/forecast/',
        dataType: 'html',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(request)
    }).done(function (weatherHtml) {
        $("#conditions").html(weatherHtml);
        fn();
        // console.log(weather);
    }).error(function (er) {
        console.log("Error :" + er);
    });
}

//Loads the Weather Radar Map
function loadRadarMap(location) {
    if (location == null) {
        $("#map").html("<h4 class='text-center' style='margin-top:120px'>The Weather Radar Map supports United States and Canada only</h4>");
    } else {
        var url = 'http://api.wunderground.com/api/'+ wUndergroundKey + '/animatedradar' + location + '.gif?newmaps=1&timelabel=1&timelabel.y=20&num=15&delay=100&noclutter=1&smooth=1&rainsnow=1&width=310&height=300'
        $("#map").html('<img src="' + url + '" alt="Weather Radar" style="width:310px;height:300px;border-radius:10px;">');
        // console.log(weather);
    }
}

//Function to fetch and display the current conditions for a selected location
function extendedForecast(location) {
    var request = {
        Location: location,
        Forecast: "forecast"
    };

    //The ajax call to the C# code which return HTML created from XSLT
    $.ajax({
        url: '/home/forecast/',
        dataType: 'html',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(request)
    }).done(function (weather) {
        $("#extended").html(weather);
        //console.log(weather);
    }).error(function (er) {
        console.log("Error :" + er);
    });
}

//Fetches data from the hourly API and is used to render a graph at a later stage
function hourlyForecast(location, fn) {
    $.ajax({
        url: 'http://api.wunderground.com/api/' + wUndergroundKey + '/hourly' + location + '.json',
        dataType: 'json',
        method: 'GET'
    }).done(function (weather) {
        var i = 0;
        $.each(weather.hourly_forecast, function (index, value) {
            if (index % 3 == 0) { //Remainder of three since we want three hour intervals
                timeArray[i] = value.FCTTIME.civil; //
                tempArrayF[i] = parseInt(value.temp.english, 10); //Used to create the F graph
                tempArrayC[i] = parseInt(value.temp.metric, 10); //Used to create the C graph
                i++;
                if (i == 8) return false;
            }
        });
        hourlyGraph(); //Renders the Graph
        //console.log(weather);
    }).error(function (er) {
        console.log("Error :" + er);
    });

}

//Renders the Hourly Graph
function hourlyGraph() {
    if (tempType == "C") {
        tempArray = tempArrayC;
    }
    else if (tempType == "F") {
        tempArray = tempArrayF;
    }
    $('#hourly').highcharts({ //Hightcharts is a third party plugin to generate graphs
        chart: {
            borderRadius: 10,
            backgroundColor: 'white',
            color: "darkred"
        },
        title: {
            text: 'Hourly Temperature Variation',
            x: -20, //center,
            style: {
                color: 'darkred'
            }
        },
        xAxis: {
            categories: timeArray,
            style: {
                color: 'darkred'
            }
        },
        yAxis: {
            title: {
                text: 'Temperature (°' + tempType + ')',
                style: {
                    color: 'darkred'
                }
            },
            plotLines: [{
                value: 0,
                width: 1
            }]
        },
        tooltip: {
            valueSuffix: '°' + tempType
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0

        },
        series: [{
            name: 'Hourly',
            color: 'darkred',
            data: tempArray

        }]
    });
}

//This function renders the background image which it gets from the C# code based on the time and weather of a particular location
function backgroundImage() {
    var strArr = timeArray[0].split(" ");
    //console.log("Full time: " + strArr);

    var number = parseInt(strArr[0].split(":")[0]);
    //console.log("Number is: " + number);
    var ampm = strArr[1];
    //console.log("AM or PM: " + ampm);


    //Converting to a 24 hour format
    if (ampm == "AM" && number == 12) {
        number = 0;
    }
    if (ampm == "PM") {
        number += 12;
    }

    var dayOrNight;

    if (number >= 6 && number < 18) {
        dayOrNight = "day";
    } else {
        dayOrNight = "night";
    }

    // console.log(dayOrNight);

    //Data to be posted
    var request = {
        Forecast: $("#weather").text(),
        DayOrNight: dayOrNight
    }

    //                console.log(p);

    //Ajax call to the API hosted on our server
    $.ajax({
        url: '/Home/BackgroundImage',
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        data: request
    }).done(function (result) {
        console.log(JSON.parse(result).d.results[0].MediaUrl);
        //  console.log($("#weather_condition").text());
        $("body").css({
            "background-image": "url('" + JSON.parse(result).d.results[0].MediaUrl + "')",
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
        });


        //When the #main div is ready, do the following:
        $("#main").ready(function () {
            setTempPref();
            $("#loading").hide();
            $("#twitter.widget-0").contents().find('body').css("opacity", "0.75");
            $("#main").show();
        });

        //console.log(JSON.parse(result).d.results[0].MediaUrl);
    }).error(function (er) {
        console.log("Error :" + er);
    });
}

$('img').error(function () {
    $(this).attr('src', 'missing.png');
});


// Get the place details from the autocomplete object.
function getPlaceAddress() {
    
    var place = autocomplete.getPlace();
  //  console.log(place);

    for (var component in componentForm) {
        if (document.getElementById(component)) {
            document.getElementById(component).value = '';
            document.getElementById(component).disabled = false;
        }
    }

    // Get each component of the address from the place details
    // and set the necessary variable
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (addressType == "locality" || addressType == "administrative_area_level_1" || addressType == "country") {

            if (addressType == "locality" && componentForm[addressType]) {
                city = place.address_components[i][componentForm[addressType]];
                //  console.log(city);
            }

            if (componentForm[addressType] && addressType == "administrative_area_level_1") {
                state = place.address_components[i][componentForm[addressType]];
                //console.log(state);
            }

            if (componentForm[addressType] && addressType == "country") {
                country = place.address_components[i][componentForm[addressType]];
                //console.log(country);
            }
        }
    }

    //Calls the Google Maps API to fetch coordinates for a given address
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + (city + ',' + state + ',' + country).replace(/ /g, "+") + '&key=' + googleMapsKey,
        dataType: 'json',
        method: 'GET'
    }).done(function (result) {
        console.log(result);
        if (result.results.length>0) {
                coord = [result.results[0].geometry.location.lat, result.results[0].geometry.location.lng];
        }
        else {
            alert("The location " + $("#autocomplete").val() + " is not supported - please be more specific.");
            return false;
        }

        //Gets Location from Coordinates and then proceeds with querying and loading weather data
        getLocFromCoord(coord, function (loc) {
            //Once we have the locations, perform the following actions:
            $("#main").hide();
            $("#loading").show();
            console.log(loc);
            console.log(country);
            if (country == "United States" || country == "Canada") { //Map only works for US and Canada
                loadRadarMap(loc);
            } else {
                loadRadarMap(null);
            }
            console.log("It works!!")
            hourlyForecast(loc);
            extendedForecast(loc);
            currentConditions(loc, backgroundImage);
        });
    }).error(function (er) {
        console.log("Error :" + er);
    });
}

//First Load
function initializePage() {
    geoLookup(function (loc) {
        console.log("the geolookup location is: " + loc);
        $("#loading").show();
            loadRadarMap(loc);
            console.log("It works!!")
            hourlyForecast(loc);
            extendedForecast(loc);
            currentConditions(loc, backgroundImage);
    });
}

//Gets Lat and Long from Browser
function geoLookup(fn) {
    if (navigator.geolocation) {
        console.log("A");
        navigator.geolocation.getCurrentPosition(function (loc) {
            return geoLocSuccess(loc,fn);
        }, geoLocFail, {timeout:50000});
    } else {
        console.log("A");
        $("#autocomplete").show();
    }
}

//This happens when Geolocation is success
function geoLocSuccess(location, fn) {
    console.log("Success");
    var lat = location.coords.latitude;
    var lng = location.coords.longitude;
    return getLocFromCoord([lat, lng], fn);
}

//This gets called when GeoLocation fails
function geoLocFail(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("Permission Denied");
            forceInitializePage();
            break;
        case error.POSITION_UNAVAILABLE:
            forceInitializePage();
            break;
        case error.TIMEOUT:
            forceInitializePage();
            break;
        case error.UNKNOWN_ERROR:
            forceInitializePage();
            break;
    }
}

//Given Coordinates of a Location, fetch the corresponding Wunderground id of the place
function getLocFromCoord(coord, fn) {
    var myUrl = 'http://api.wunderground.com/api/' + wUndergroundKey + '/geolookup/q/' + coord[0] + ',' + coord[1] + '.json';
    console.log(myUrl);

    $.ajax({
        url: myUrl,
        dataType: 'json',
        method: 'GET'
    }).done(function (weather) {
        console.log("Look here!!!" + weather.location.l);
        fn(weather.location.l);
        //console.log(weather);
    }).error(function (er) {
        console.log("Error :" + er);
    });
}


//If GeoLocation Fails, initialize page to Cincinnati
function forceInitializePage() {
    console.log("Force initializing");
    var loc = "/q/zmw:45275.1.99999";    //Cincinnati
    $("#loading").show();
    loadRadarMap(loc);
    hourlyForecast(loc);
    extendedForecast(loc);
    currentConditions(loc, backgroundImage);
}

initializePage();

//Sets the Fahrenheight or Celsius
$("#tempPref").on("click", "a", function () {
    tempType = $(this).attr("units");
    setTempPref();
});