// jQuery
$(function() {});

//GLOBALS
// Initializize API location to Portland, OR
var queryCity = "q=portland,or";
console.log(queryCity);

// If geolocation available - set API location to current user location
// if ("geolocation" in navigator) {
// 	navigator.geolocation.getCurrentPosition(function(position) {
// 		console.log(
// 			"Found your location \nLat : " +
// 				position.coords.latitude +
// 				" \nLang :" +
// 				position.coords.longitude
// 		);
// 		queryCity =
// 			"lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
// 		console.log(queryCity);
// 	});
// }

// Define array for search history
var searchHistory = [];

// check local storage for previous saved search history
var checkPrevious = JSON.parse(localStorage.getItem("searchHistory"));

// get previously saved search history from local storage (if exists)
if (checkPrevious !== null) {
	searchHistory = checkPrevious;
}

// show previous history (if exists)
searchHistory.forEach(createButton);

// Variable for Open Weather API Key
var key = "0959a518fd93cebc53ed34118e0e9471";

// USER INTERFACE
// Event listener for new search
$("#searchBtn").on("click", newCity);

// Event listener for search history
$(":input").on("click", previousCity);

// APPLICATION FUNCTIONS
// When user searches for City
function newCity(event) {
	var userEntry = $("#searchEntry").val();

	// add searched City to history list
	searchHistory.push(userEntry);

	// update local storage
	localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

	// show searched City in search history
	createButton(userEntry);

	// show weather for selected city
	getWeather(userEntry);
}

// When user chooses city from search history
function previousCity(event) {
	console.log($(this).prop("value"));

	// var selectedCity = ;
	// show weather for selected city
	// getWeather(selectedCity);
}

// Create button in search history
function createButton(name, index) {
	$("#history").append(
		'<input class="btn btn-outline-secondary" type="button" value="' +
			name +
			'" />'
	);
}

// Show weather data on page
function showWeather(weatherData, uvData) {
	console.log(weatherData);
	console.log(uvData);
	var today = moment().format("M/D/YYYY");
	$("#currentCity").text(weatherData.name + " (" + today + ") ");
	$("#currentCity").append(
		'<img src="http://openweathermap.org/img/wn/' +
			weatherData.weather[0].icon +
			'@2x.png" alt="weather icon">'
	);
	var F = Math.round((weatherData.main.temp * 9) / 5 - 459.67);
	$("#temp").text("Temperature: " + F + " °F");
	$("#humid").text("Humidity: " + weatherData.main.humidity + " %");
	$("#wind").text("Wind Speed: " + weatherData.wind.speed + " MPH");
	$("#uvindex").text("UV Index: " + uvData.value);
}

// SERVER INTERACTION
// Get weather for selected City
function getWeather(here) {
	// Create query url with user input
	queryCity = "q=" + here;

	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?" +
		queryCity +
		"&appid=" +
		key;
	console.log(queryURL);

	// Get data from Open Weather API
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		var weatherData = response;

		// Create query url with coorindates from previous call
		var lat = weatherData.coord.lat;
		var lon = weatherData.coord.lon;
		var query2URL =
			"http://api.openweathermap.org/data/2.5/uvi?appid=" +
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
