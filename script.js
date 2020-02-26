// jQuery
$(function() {});

//
//INITIALIZE PAGE
//
// Set starting location to Portland, OR
var City = "portland";

// Define array for search history
var searchHistory = [];

// check local storage for previous saved search history
var checkPrevious = JSON.parse(localStorage.getItem("searchHistory"));

// get previously saved search history from local storage (if exists)
if (checkPrevious !== null) {
	searchHistory = checkPrevious;
}

// show previous history (if exists)
createButtons();

// Set Open Weather API Key
var key = "0959a518fd93cebc53ed34118e0e9471";

// Show weather & forecast for starting location
getWeather(City);
getForecast(City);

//
// USER INTERACTION
//
// Event listener for new search
$("#searchBtn").on("click", function(event) {
	event.preventDefault();
	var userEntry = $("#searchEntry").val();
	$("#search")[0].reset();
	newCity(userEntry);
});

// Event listener for search history
$(".historyButton").on("click", previousCity);

//
// APPLICATION FUNCTIONS
//
// When user searches for City
function newCity(userEntry) {
	// add City to search history (if not already there)
	if (searchHistory.indexOf(userEntry) == -1) {
		searchHistory.unshift(userEntry);
		// limit list to most recent 10
		searchHistory = searchHistory.slice(0, 10);
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
		createButtons();
	}
	// show weather & foreacst for selected city
	getWeather(userEntry);
	getForecast(userEntry);
}

// When user chooses city from search history
function previousCity(event) {
	var selectedCity = $(this).prop("value");

	// show weather & foreacst for selected city
	getWeather(selectedCity);
	getForecast(selectedCity);
}

// Create buttons for search history
function createButtons() {
	$("#history").empty();
	searchHistory.forEach(function(name) {
		$("#history").append(
			'<input class="btn btn-outline-secondary p-2 historyButton" type="button" value="' +
				name +
				'" />'
		);
	});
}

// Show weather data on page
function showWeather(weatherData, uvData) {
	// variable for the date
	var utcSeconds = weatherData.dt;
	var d = new Date(0);
	d.setUTCSeconds(utcSeconds);
	d = d.toLocaleDateString("en-US");

	// variable for converted temperature
	var F = Math.round((weatherData.main.temp * 9) / 5 - 459.67);

	// variable for uv color coding
	var uvColor;
	if (uvData.value < 3) {
		uvColor = "bg-success";
	} else if (uvData.value > 7) {
		uvColor = "bg-danger";
	} else {
		uvColor = "bg-warning";
	}

	// write to HTML
	$("#currentCity").text(weatherData.name + " (" + d + ") ");
	$("#currentCity").append(
		'<img src="http://openweathermap.org/img/wn/' +
			weatherData.weather[0].icon +
			'@2x.png" alt="weather icon" width="60px" height="60px">'
	);
	$("#temp").text("Temperature: " + F + " °F");
	$("#humid").text("Humidity: " + weatherData.main.humidity + " %");
	$("#wind").text("Wind Speed: " + weatherData.wind.speed + " MPH");
	$("#uvindex").html(
		'UV Index: <span class="text-white rounded-sm ' +
			uvColor +
			' p-2">' +
			uvData.value +
			"</span>"
	);
}

// Show five-day forecast
function showForecast(forecastData) {
	for (i = 0; i < 5; i++) {
		// get info from every 8th element in the returned array
		var dataIndex = forecastData.list[i * 8 + 4];

		// variable for the date
		var utcSeconds = dataIndex.dt;
		var d = new Date(0);
		d.setUTCSeconds(utcSeconds);
		d = d.toLocaleDateString("en-US");

		// variable for converted temperature
		var F = Math.round((dataIndex.main.temp * 9) / 5 - 459.67);

		// write to HTML
		var boxID = $("#" + i);
		boxID.html("<h4>" + d + "</h4>");
		boxID.append(
			'<img src="http://openweathermap.org/img/wn/' +
				dataIndex.weather[0].icon +
				'@2x.png" alt="weather icon" width="50px" height="50px">'
		);
		boxID.append("<p>Temp: " + F + " °F</p>");
		boxID.append("<p>Humidity: " + dataIndex.main.humidity + " °F</p>");
	}
}

//
// SERVER INTERACTION
//
// Get weather for selected City
function getWeather(here) {
	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		here +
		"&appid=" +
		key;

	// Get data from Open Weather API
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		var weatherData = response;

		// Create query url with coordinates from previous call
		var lat = weatherData.coord.lat;
		var lon = weatherData.coord.lon;
		var query2URL =
			"https://api.openweathermap.org/data/2.5/uvi?appid=" +
			key +
			"&lat=" +
			lat +
			"&lon=" +
			lon;

		// Get UV data from Open Weather API
		$.ajax({
			url: query2URL,
			method: "GET"
		}).then(function(response) {
			var uvData = response;

			// and call function to show data on page
			showWeather(weatherData, uvData);
		});
	});
}

// Get forecast for selected City
function getForecast(here) {
	var queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		here +
		"&appid=" +
		key;

	// Get forecast data from Open Weather API
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		var forecastData = response;

		// and call function to show data on page
		showForecast(forecastData);
	});
}
