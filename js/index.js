function makeGetRequest(path) {
	return new Promise(function (resolve, reject) {
		axios.get(path).then(
			(response) => {
				var result = response.data;
				// console.log("Async Get Request: " + path);
				resolve(result);
			},
			(error) => {
				reject(error);
			}
		);
	});
}

function toCelsius(k) {
	c = k - 273.5;
	return c.toFixed(2);
}

function extractDate(d) {
	var x =
		"(" +
		d.getFullYear() +
		"/" +
		d.getMonth() +
		"/" +
		d.getDate() +
		") " +
		d.getHours() +
		":" +
		d.getMinutes() +
		":" +
		d.getSeconds();
	if (d.getHours() < 12) x += " AM ";
	else x += " PM ";
	return x;
}

function newColor(element) {
	text =
		element.childNodes[1].childNodes[9].childNodes[1].childNodes[1]
			.childNodes[1].textContent;
	text = text.split(" ");
	weatherClass = text[1];
	body = document.getElementsByTagName("body")[0];
	bodyClass = body.getAttribute("class");
	bodyClass = bodyClass.split(" ");
	body.setAttribute("class", bodyClass[0] + " " + weatherClass);
}

function originalColor() {
	body = document.getElementsByTagName("body")[0];
	bodyClass = body.getAttribute("class");
	bodyClass = bodyClass.split(" ");
	body.setAttribute("class", bodyClass[0] + " Original");
}

async function fetchData() {
	var cityName = document.getElementById("city-names").value;
	var weatherData = await makeGetRequest(
		"http://api.openweathermap.org/data/2.5/forecast?id=" +
			cityName +
			"&appid=ab4ae1b0a4072f1cd0bfc3877b1dfe52"
	);
	console.log(weatherData);

	var temp = document.getElementById("city");
	temp.innerHTML = weatherData.city.name;
	var temp = document.getElementById("long");
	temp.innerHTML = weatherData.city.coord.lon;
	var temp = document.getElementById("lat");
	temp.innerHTML = weatherData.city.coord.lat;

	var d = new Date(weatherData.city.sunrise * 1000);
	var temp = document.getElementById("sunrise");
	temp.innerHTML = extractDate(d);

	var d = new Date(weatherData.city.sunset * 1000);
	var temp = document.getElementById("sunset");
	temp.innerHTML = extractDate(d);

	var weatherDiv = document.getElementById("weather-data");
	var divText = weatherDiv.innerHTML;
	var finalDivText = "";

	for (var i = 0; i < 40; i++) {
		var tempText = divText;
		tempText = tempText.replace(
			"{weather-class}",
			weatherData.list[i].weather[0].main
		);

		tempText = tempText.replace("{time}", weatherData.list[i].dt_txt);
		tempText = tempText.replace(
			"{temp_max}",
			toCelsius(weatherData.list[i].main.temp_max)
		);
		tempText = tempText.replace(
			"{temp_min}",
			toCelsius(weatherData.list[i].main.temp_min)
		);
		tempText = tempText.replace(
			"{feels_like}",
			toCelsius(weatherData.list[i].main.feels_like)
		);
		tempText = tempText.replace(
			"{pressure}",
			weatherData.list[i].main.pressure * "100"
		);
		tempText = tempText.replace("{speed}", weatherData.list[i].wind.speed);
		tempText = tempText.replace("{deg}", weatherData.list[i].wind.deg);
		tempText = tempText.replace(
			"{icon}",
			weatherData.list[i].weather[0].icon
		);
		tempText = tempText.replace(
			"{main}",
			weatherData.list[i].weather[0].main
		);
		tempText = tempText.replace(
			"{description}",
			weatherData.list[i].weather[0].description
		);
		tempText = tempText.replace(
			"{humidity}",
			weatherData.list[i].main.humidity
		);

		finalDivText += tempText + "\n\n";
	}
	weatherDiv.innerHTML = finalDivText;
	document.getElementById("main-div").style.display = "block";

	// window.alert("bula liya");
}
