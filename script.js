// jQuery
$(function() {});

//GLOBALS
// Initializize API location to Portland, OR
var queryCity = "q=portland,or";

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
$("#searchBtn").on("click", function(event) {
	event.preventDefault();
	var userEntry = $("#searchEntry").val();
	newCity(userEntry);
});

// Event listener for search history
$(":input").on("click", previousCity);

// APPLICATION FUNCTIONS
// When user searches for City
function newCity(userEntry) {
	// add City to search history (if not already there)
	if (searchHistory.indexOf(userEntry) == -1) {
		searchHistory.unshift(userEntry);
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
		createButton(userEntry);
		console.log(searchHistory);
	}
	// show weather for selected city
	getWeather(userEntry);
	getForecast(userEntry);
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
	// variable for today's date
	// var today = moment().format("M/D/YYYY");
	// variable for the date
	var utcSeconds = weatherData.dt;
	var d = new Date(0);
	d.setUTCSeconds(utcSeconds);
	d = d.toLocaleDateString("en-US");
	console.log(d);

	// variable for converted temperature
	var F = Math.round((weatherData.main.temp * 9) / 5 - 459.67);

	// write to HTML
	$("#currentCity").text(weatherData.name + " (" + d + ") ");
	$("#currentCity").append(
		'<img src="http://openweathermap.org/img/wn/' +
			weatherData.weather[0].icon +
			'@2x.png" alt="weather icon">'
	);
	$("#temp").text("Temperature: " + F + " °F");
	$("#humid").text("Humidity: " + weatherData.main.humidity + " %");
	$("#wind").text("Wind Speed: " + weatherData.wind.speed + " MPH");
	$("#uvindex").text("UV Index: " + uvData.value);
}

// Show five-day forecast
function showForecast(forecastData) {
	console.log(forecastData);
	for (i = 0; i < 5; i++) {
		// get info from every 8th element in the returned array
		var dataIndex = forecastData.list[i * 8];

		// variable for the date
		var utcSeconds = dataIndex.dt;
		var d = new Date(0);
		d.setUTCSeconds(utcSeconds);
		d = d.toLocaleDateString("en-US");

		// variable for converted temperature
		var F = Math.round((dataIndex.main.temp * 9) / 5 - 459.67);

		// write to HTML
		var boxID = $("#" + i);
		boxID.append("<h4>" + d + "</h4>");
		boxID.append(
			'<img src="http://openweathermap.org/img/wn/' +
				dataIndex.weather[0].icon +
				'@2x.png" alt="weather icon">'
		);
		boxID.append("<p>Temp: " + F + " °F</p>");
		boxID.append("<p>Humidity: " + dataIndex.main.humidity + " °F</p>");
	}
}

// SERVER INTERACTION
// Get weather for selected City
function getWeather(here) {
	// Create query url with user input
	//
	// queryCity = "q=" + here;

	// var queryURL =
	// 	"https://api.openweathermap.org/data/2.5/weather?" +
	// 	queryCity +
	// 	"&appid=" +
	// 	key;
	// console.log(queryURL);

	// // Get data from Open Weather API
	// $.ajax({
	// 	url: queryURL,
	// 	method: "GET"
	// }).then(function(response) {
	// 	var weatherData = response;

	// 	// Create query url with coorindates from previous call
	// 	var lat = weatherData.coord.lat;
	// 	var lon = weatherData.coord.lon;
	// 	var query2URL =
	// 		"http://api.openweathermap.org/data/2.5/uvi?appid=" +
	// 		key +
	// 		"&lat=" +
	// 		lat +
	// 		"&lon=" +
	// 		lon;

	// 	// Get UV data from Open Weather API
	// 	$.ajax({
	// 		url: query2URL,
	// 		method: "GET"
	// 	}).then(function(response) {
	// 		var uvData = response;
	//

	//
	//
	//
	var weatherData = {
		coord: { lon: -122.33, lat: 47.61 },
		weather: [
			{ id: 500, main: "Rain", description: "light rain", icon: "10n" },
			{ id: 701, main: "Mist", description: "mist", icon: "50n" }
		],
		base: "stations",
		main: {
			temp: 279.52,
			feels_like: 277.41,
			temp_min: 278.15,
			temp_max: 280.37,
			pressure: 1031,
			humidity: 93
		},
		visibility: 3219,
		wind: { speed: 1.5, deg: 160 },
		rain: { "1h": 0.25 },
		clouds: { all: 90 },
		dt: 1582716817,
		sys: {
			type: 1,
			id: 5692,
			country: "US",
			sunrise: 1582728985,
			sunset: 1582768109
		},
		timezone: -28800,
		id: 5809844,
		name: "Seattle",
		cod: 200
	};
	var uvData = {
		lat: 47.61,
		lon: -122.33,
		date_iso: "2020-02-26T12:00:00Z",
		date: 1582718400,
		value: 2.15
	};
	//
	//
	//

	// and call function to show data on page
	showWeather(weatherData, uvData);
	// 	});
	// });
}

// Get forecast from Open Weather API
function getForecast(here) {
	//
	// queryCity = "q=" + here;

	// var queryURL =
	// 	"https://api.openweathermap.org/data/2.5/forecast?" +
	// 	queryCity +
	// 	"&appid=" +
	// 	key;
	// console.log(queryURL);

	// // Get data from Open Weather API
	// $.ajax({
	// 	url: queryURL,
	// 	method: "GET"
	// }).then(function(response) {
	// 	var forecastData = response;
	// 	showForecast(forecastData);
	// });

	//
	//
	//
	var forecastData = {
		cod: "200",
		message: 0,
		cnt: 40,
		list: [
			{
				dt: 1582718400,
				main: {
					temp: 277.28,
					feels_like: 275.25,
					temp_min: 276.04,
					temp_max: 277.28,
					pressure: 1030,
					sea_level: 1030,
					grnd_level: 1023,
					humidity: 94,
					temp_kf: 1.24
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }
				],
				clouds: { all: 58 },
				wind: { speed: 0.82, deg: 334 },
				sys: { pod: "n" },
				dt_txt: "2020-02-26 12:00:00"
			},
			{
				dt: 1582729200,
				main: {
					temp: 276.93,
					feels_like: 274.66,
					temp_min: 276,
					temp_max: 276.93,
					pressure: 1030,
					sea_level: 1030,
					grnd_level: 1023,
					humidity: 93,
					temp_kf: 0.93
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 87 },
				wind: { speed: 1.03, deg: 334 },
				sys: { pod: "d" },
				dt_txt: "2020-02-26 15:00:00"
			},
			{
				dt: 1582740000,
				main: {
					temp: 281.05,
					feels_like: 279.12,
					temp_min: 280.43,
					temp_max: 281.05,
					pressure: 1031,
					sea_level: 1031,
					grnd_level: 1024,
					humidity: 78,
					temp_kf: 0.62
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 85 },
				wind: { speed: 0.95, deg: 217 },
				sys: { pod: "d" },
				dt_txt: "2020-02-26 18:00:00"
			},
			{
				dt: 1582750800,
				main: {
					temp: 282.99,
					feels_like: 280.98,
					temp_min: 282.68,
					temp_max: 282.99,
					pressure: 1031,
					sea_level: 1031,
					grnd_level: 1024,
					humidity: 72,
					temp_kf: 0.31
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 99 },
				wind: { speed: 1.27, deg: 171 },
				sys: { pod: "d" },
				dt_txt: "2020-02-26 21:00:00"
			},
			{
				dt: 1582761600,
				main: {
					temp: 284.69,
					feels_like: 282.66,
					temp_min: 284.69,
					temp_max: 284.69,
					pressure: 1031,
					sea_level: 1031,
					grnd_level: 1024,
					humidity: 59,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 91 },
				wind: { speed: 0.97, deg: 132 },
				sys: { pod: "d" },
				dt_txt: "2020-02-27 00:00:00"
			},
			{
				dt: 1582772400,
				main: {
					temp: 279.2,
					feels_like: 277.26,
					temp_min: 279.2,
					temp_max: 279.2,
					pressure: 1032,
					sea_level: 1032,
					grnd_level: 1024,
					humidity: 82,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }
				],
				clouds: { all: 75 },
				wind: { speed: 0.68, deg: 157 },
				sys: { pod: "n" },
				dt_txt: "2020-02-27 03:00:00"
			},
			{
				dt: 1582783200,
				main: {
					temp: 278.52,
					feels_like: 276.42,
					temp_min: 278.52,
					temp_max: 278.52,
					pressure: 1033,
					sea_level: 1033,
					grnd_level: 1025,
					humidity: 90,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 88 },
				wind: { speed: 1.08, deg: 170 },
				sys: { pod: "n" },
				dt_txt: "2020-02-27 06:00:00"
			},
			{
				dt: 1582794000,
				main: {
					temp: 277.4,
					feels_like: 274.95,
					temp_min: 277.4,
					temp_max: 277.4,
					pressure: 1032,
					sea_level: 1032,
					grnd_level: 1024,
					humidity: 96,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }
				],
				clouds: { all: 68 },
				wind: { speed: 1.53, deg: 175 },
				sys: { pod: "n" },
				dt_txt: "2020-02-27 09:00:00"
			},
			{
				dt: 1582804800,
				main: {
					temp: 276.18,
					feels_like: 274.04,
					temp_min: 276.18,
					temp_max: 276.18,
					pressure: 1033,
					sea_level: 1033,
					grnd_level: 1024,
					humidity: 96,
					temp_kf: 0
				},
				weather: [
					{
						id: 802,
						main: "Clouds",
						description: "scattered clouds",
						icon: "03n"
					}
				],
				clouds: { all: 45 },
				wind: { speed: 0.78, deg: 193 },
				sys: { pod: "n" },
				dt_txt: "2020-02-27 12:00:00"
			},
			{
				dt: 1582815600,
				main: {
					temp: 275.71,
					feels_like: 273.19,
					temp_min: 275.71,
					temp_max: 275.71,
					pressure: 1032,
					sea_level: 1032,
					grnd_level: 1024,
					humidity: 96,
					temp_kf: 0
				},
				weather: [
					{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }
				],
				clouds: { all: 15 },
				wind: { speed: 1.21, deg: 182 },
				sys: { pod: "d" },
				dt_txt: "2020-02-27 15:00:00"
			},
			{
				dt: 1582826400,
				main: {
					temp: 281.59,
					feels_like: 278.79,
					temp_min: 281.59,
					temp_max: 281.59,
					pressure: 1032,
					sea_level: 1032,
					grnd_level: 1025,
					humidity: 69,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }
				],
				clouds: { all: 9 },
				wind: { speed: 1.87, deg: 200 },
				sys: { pod: "d" },
				dt_txt: "2020-02-27 18:00:00"
			},
			{
				dt: 1582837200,
				main: {
					temp: 286.3,
					feels_like: 283.79,
					temp_min: 286.3,
					temp_max: 286.3,
					pressure: 1031,
					sea_level: 1031,
					grnd_level: 1023,
					humidity: 53,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }
				],
				clouds: { all: 5 },
				wind: { speed: 1.65, deg: 204 },
				sys: { pod: "d" },
				dt_txt: "2020-02-27 21:00:00"
			},
			{
				dt: 1582848000,
				main: {
					temp: 286.33,
					feels_like: 284.23,
					temp_min: 286.33,
					temp_max: 286.33,
					pressure: 1029,
					sea_level: 1029,
					grnd_level: 1021,
					humidity: 55,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }
				],
				clouds: { all: 7 },
				wind: { speed: 1.21, deg: 214 },
				sys: { pod: "d" },
				dt_txt: "2020-02-28 00:00:00"
			},
			{
				dt: 1582858800,
				main: {
					temp: 280.54,
					feels_like: 278.82,
					temp_min: 280.54,
					temp_max: 280.54,
					pressure: 1029,
					sea_level: 1029,
					grnd_level: 1021,
					humidity: 80,
					temp_kf: 0
				},
				weather: [
					{
						id: 802,
						main: "Clouds",
						description: "scattered clouds",
						icon: "03n"
					}
				],
				clouds: { all: 42 },
				wind: { speed: 0.62, deg: 168 },
				sys: { pod: "n" },
				dt_txt: "2020-02-28 03:00:00"
			},
			{
				dt: 1582869600,
				main: {
					temp: 278.68,
					feels_like: 277.06,
					temp_min: 278.68,
					temp_max: 278.68,
					pressure: 1028,
					sea_level: 1028,
					grnd_level: 1020,
					humidity: 89,
					temp_kf: 0
				},
				weather: [
					{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }
				],
				clouds: { all: 21 },
				wind: { speed: 0.4, deg: 333 },
				sys: { pod: "n" },
				dt_txt: "2020-02-28 06:00:00"
			},
			{
				dt: 1582880400,
				main: {
					temp: 277.69,
					feels_like: 276.09,
					temp_min: 277.69,
					temp_max: 277.69,
					pressure: 1026,
					sea_level: 1026,
					grnd_level: 1018,
					humidity: 91,
					temp_kf: 0
				},
				weather: [
					{
						id: 802,
						main: "Clouds",
						description: "scattered clouds",
						icon: "03n"
					}
				],
				clouds: { all: 30 },
				wind: { speed: 0.19, deg: 58 },
				sys: { pod: "n" },
				dt_txt: "2020-02-28 09:00:00"
			},
			{
				dt: 1582891200,
				main: {
					temp: 276.78,
					feels_like: 275.15,
					temp_min: 276.78,
					temp_max: 276.78,
					pressure: 1023,
					sea_level: 1023,
					grnd_level: 1015,
					humidity: 93,
					temp_kf: 0
				},
				weather: [
					{
						id: 802,
						main: "Clouds",
						description: "scattered clouds",
						icon: "03n"
					}
				],
				clouds: { all: 38 },
				wind: { speed: 0.08, deg: 278 },
				sys: { pod: "n" },
				dt_txt: "2020-02-28 12:00:00"
			},
			{
				dt: 1582902000,
				main: {
					temp: 276.07,
					feels_like: 273.89,
					temp_min: 276.07,
					temp_max: 276.07,
					pressure: 1021,
					sea_level: 1021,
					grnd_level: 1013,
					humidity: 94,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 60 },
				wind: { speed: 0.73, deg: 206 },
				sys: { pod: "d" },
				dt_txt: "2020-02-28 15:00:00"
			},
			{
				dt: 1582912800,
				main: {
					temp: 282.51,
					feels_like: 279.91,
					temp_min: 282.51,
					temp_max: 282.51,
					pressure: 1019,
					sea_level: 1019,
					grnd_level: 1011,
					humidity: 71,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 51 },
				wind: { speed: 1.93, deg: 192 },
				sys: { pod: "d" },
				dt_txt: "2020-02-28 18:00:00"
			},
			{
				dt: 1582923600,
				main: {
					temp: 285.82,
					feels_like: 282.38,
					temp_min: 285.82,
					temp_max: 285.82,
					pressure: 1016,
					sea_level: 1016,
					grnd_level: 1008,
					humidity: 60,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 93 },
				wind: { speed: 3.34, deg: 200 },
				sys: { pod: "d" },
				dt_txt: "2020-02-28 21:00:00"
			},
			{
				dt: 1582934400,
				main: {
					temp: 284.55,
					feels_like: 279.49,
					temp_min: 284.55,
					temp_max: 284.55,
					pressure: 1014,
					sea_level: 1014,
					grnd_level: 1006,
					humidity: 59,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04d"
					}
				],
				clouds: { all: 97 },
				wind: { speed: 5.26, deg: 223 },
				sys: { pod: "d" },
				dt_txt: "2020-02-29 00:00:00"
			},
			{
				dt: 1582945200,
				main: {
					temp: 280.36,
					feels_like: 275.4,
					temp_min: 280.36,
					temp_max: 280.36,
					pressure: 1013,
					sea_level: 1013,
					grnd_level: 1005,
					humidity: 74,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 99 },
				wind: { speed: 4.91, deg: 210 },
				sys: { pod: "n" },
				dt_txt: "2020-02-29 03:00:00"
			},
			{
				dt: 1582956000,
				main: {
					temp: 277.6,
					feels_like: 271.17,
					temp_min: 277.6,
					temp_max: 277.6,
					pressure: 1014,
					sea_level: 1014,
					grnd_level: 1006,
					humidity: 86,
					temp_kf: 0
				},
				weather: [
					{ id: 500, main: "Rain", description: "light rain", icon: "10n" }
				],
				clouds: { all: 100 },
				wind: { speed: 6.87, deg: 208 },
				rain: { "3h": 0.25 },
				sys: { pod: "n" },
				dt_txt: "2020-02-29 06:00:00"
			},
			{
				dt: 1582966800,
				main: {
					temp: 277.76,
					feels_like: 270.72,
					temp_min: 277.76,
					temp_max: 277.76,
					pressure: 1016,
					sea_level: 1016,
					grnd_level: 1007,
					humidity: 79,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 100 },
				wind: { speed: 7.5, deg: 220 },
				sys: { pod: "n" },
				dt_txt: "2020-02-29 09:00:00"
			},
			{
				dt: 1582977600,
				main: {
					temp: 277.14,
					feels_like: 271.36,
					temp_min: 277.14,
					temp_max: 277.14,
					pressure: 1017,
					sea_level: 1017,
					grnd_level: 1008,
					humidity: 73,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }
				],
				clouds: { all: 83 },
				wind: { speed: 5.33, deg: 227 },
				sys: { pod: "n" },
				dt_txt: "2020-02-29 12:00:00"
			},
			{
				dt: 1582988400,
				main: {
					temp: 276.15,
					feels_like: 270.93,
					temp_min: 276.15,
					temp_max: 276.15,
					pressure: 1017,
					sea_level: 1017,
					grnd_level: 1009,
					humidity: 82,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }
				],
				clouds: { all: 0 },
				wind: { speed: 4.67, deg: 213 },
				sys: { pod: "d" },
				dt_txt: "2020-02-29 15:00:00"
			},
			{
				dt: 1582999200,
				main: {
					temp: 279.73,
					feels_like: 274.75,
					temp_min: 279.73,
					temp_max: 279.73,
					pressure: 1018,
					sea_level: 1018,
					grnd_level: 1010,
					humidity: 68,
					temp_kf: 0
				},
				weather: [
					{
						id: 802,
						main: "Clouds",
						description: "scattered clouds",
						icon: "03d"
					}
				],
				clouds: { all: 49 },
				wind: { speed: 4.51, deg: 223 },
				sys: { pod: "d" },
				dt_txt: "2020-02-29 18:00:00"
			},
			{
				dt: 1583010000,
				main: {
					temp: 283.84,
					feels_like: 279.3,
					temp_min: 283.84,
					temp_max: 283.84,
					pressure: 1018,
					sea_level: 1018,
					grnd_level: 1010,
					humidity: 38,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 63 },
				wind: { speed: 3.07, deg: 245 },
				sys: { pod: "d" },
				dt_txt: "2020-02-29 21:00:00"
			},
			{
				dt: 1583020800,
				main: {
					temp: 281.49,
					feels_like: 277.82,
					temp_min: 281.49,
					temp_max: 281.49,
					pressure: 1018,
					sea_level: 1018,
					grnd_level: 1010,
					humidity: 59,
					temp_kf: 0
				},
				weather: [
					{ id: 500, main: "Rain", description: "light rain", icon: "10d" }
				],
				clouds: { all: 64 },
				wind: { speed: 2.58, deg: 31 },
				rain: { "3h": 0.81 },
				sys: { pod: "d" },
				dt_txt: "2020-03-01 00:00:00"
			},
			{
				dt: 1583031600,
				main: {
					temp: 277.91,
					feels_like: 273.43,
					temp_min: 277.91,
					temp_max: 277.91,
					pressure: 1020,
					sea_level: 1020,
					grnd_level: 1011,
					humidity: 72,
					temp_kf: 0
				},
				weather: [
					{ id: 500, main: "Rain", description: "light rain", icon: "10n" }
				],
				clouds: { all: 40 },
				wind: { speed: 3.6, deg: 75 },
				rain: { "3h": 0.5 },
				sys: { pod: "n" },
				dt_txt: "2020-03-01 03:00:00"
			},
			{
				dt: 1583042400,
				main: {
					temp: 275.21,
					feels_like: 272.34,
					temp_min: 275.21,
					temp_max: 275.21,
					pressure: 1021,
					sea_level: 1021,
					grnd_level: 1012,
					humidity: 92,
					temp_kf: 0
				},
				weather: [
					{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }
				],
				clouds: { all: 21 },
				wind: { speed: 1.46, deg: 173 },
				sys: { pod: "n" },
				dt_txt: "2020-03-01 06:00:00"
			},
			{
				dt: 1583053200,
				main: {
					temp: 273.85,
					feels_like: 271.53,
					temp_min: 273.85,
					temp_max: 273.85,
					pressure: 1021,
					sea_level: 1021,
					grnd_level: 1013,
					humidity: 94,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }
				],
				clouds: { all: 0 },
				wind: { speed: 0.45, deg: 144 },
				sys: { pod: "n" },
				dt_txt: "2020-03-01 09:00:00"
			},
			{
				dt: 1583064000,
				main: {
					temp: 273.06,
					feels_like: 270.32,
					temp_min: 273.06,
					temp_max: 273.06,
					pressure: 1022,
					sea_level: 1022,
					grnd_level: 1014,
					humidity: 95,
					temp_kf: 0
				},
				weather: [
					{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }
				],
				clouds: { all: 7 },
				wind: { speed: 0.91, deg: 201 },
				sys: { pod: "n" },
				dt_txt: "2020-03-01 12:00:00"
			},
			{
				dt: 1583074800,
				main: {
					temp: 273.95,
					feels_like: 271.46,
					temp_min: 273.95,
					temp_max: 273.95,
					pressure: 1023,
					sea_level: 1023,
					grnd_level: 1015,
					humidity: 93,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 59 },
				wind: { speed: 0.68, deg: 186 },
				sys: { pod: "d" },
				dt_txt: "2020-03-01 15:00:00"
			},
			{
				dt: 1583085600,
				main: {
					temp: 279.8,
					feels_like: 277.57,
					temp_min: 279.8,
					temp_max: 279.8,
					pressure: 1023,
					sea_level: 1023,
					grnd_level: 1016,
					humidity: 71,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 58 },
				wind: { speed: 0.74, deg: 167 },
				sys: { pod: "d" },
				dt_txt: "2020-03-01 18:00:00"
			},
			{
				dt: 1583096400,
				main: {
					temp: 281.73,
					feels_like: 279.39,
					temp_min: 281.73,
					temp_max: 281.73,
					pressure: 1023,
					sea_level: 1023,
					grnd_level: 1017,
					humidity: 58,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 58 },
				wind: { speed: 0.67, deg: 29 },
				sys: { pod: "d" },
				dt_txt: "2020-03-01 21:00:00"
			},
			{
				dt: 1583107200,
				main: {
					temp: 280.28,
					feels_like: 277.73,
					temp_min: 280.28,
					temp_max: 280.28,
					pressure: 1022,
					sea_level: 1022,
					grnd_level: 1015,
					humidity: 63,
					temp_kf: 0
				},
				weather: [
					{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }
				],
				clouds: { all: 78 },
				wind: { speed: 0.92, deg: 351 },
				sys: { pod: "d" },
				dt_txt: "2020-03-02 00:00:00"
			},
			{
				dt: 1583118000,
				main: {
					temp: 277.98,
					feels_like: 275.31,
					temp_min: 277.98,
					temp_max: 277.98,
					pressure: 1023,
					sea_level: 1023,
					grnd_level: 1015,
					humidity: 78,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 100 },
				wind: { speed: 1.27, deg: 37 },
				sys: { pod: "n" },
				dt_txt: "2020-03-02 03:00:00"
			},
			{
				dt: 1583128800,
				main: {
					temp: 276.85,
					feels_like: 274.56,
					temp_min: 276.85,
					temp_max: 276.85,
					pressure: 1022,
					sea_level: 1022,
					grnd_level: 1014,
					humidity: 78,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 97 },
				wind: { speed: 0.48, deg: 104 },
				sys: { pod: "n" },
				dt_txt: "2020-03-02 06:00:00"
			},
			{
				dt: 1583139600,
				main: {
					temp: 274.62,
					feels_like: 270.95,
					temp_min: 274.62,
					temp_max: 274.62,
					pressure: 1021,
					sea_level: 1021,
					grnd_level: 1013,
					humidity: 92,
					temp_kf: 0
				},
				weather: [
					{
						id: 804,
						main: "Clouds",
						description: "overcast clouds",
						icon: "04n"
					}
				],
				clouds: { all: 100 },
				wind: { speed: 2.47, deg: 203 },
				sys: { pod: "n" },
				dt_txt: "2020-03-02 09:00:00"
			}
		],
		city: {
			id: 5809844,
			name: "Seattle",
			coord: { lat: 47.6062, lon: -122.3321 },
			country: "US",
			population: 608660,
			timezone: -28800,
			sunrise: 1582728985,
			sunset: 1582768110
		}
	};
}
