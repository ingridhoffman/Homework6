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

// SERVER INTERACTION
// Custom url with user input and unique key
var queryURL =
	"https://api.openweathermap.org/data/2.5/weather?" +
	queryCity +
	"&appid=" +
	key;
console.log(queryURL);

// Call to Open Weather API
// $.ajax({
// 	url: queryURL,
// 	method: "GET"
// }).then(function(response) {
// 	console.log(response);
// });

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
	showWeather(userEntry);
}

// When user chooses city from search history
function previousCity(event) {
	console.log($(this).prop("value"));

	// var selectedCity = ;
	// show weather for selected city
	// showWeather(selectedCity);
}

// Create button in search history
function createButton(name, index) {
	$("#history").append(
		'<input class="btn btn-outline-secondary" type="button" value="' +
			name +
			'" />'
	);
}

// function to show weather for selected City
function showWeather(here) {
	// change query City
	queryCity = "q=" + here;
	console.log(queryCity);
}
