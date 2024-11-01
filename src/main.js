const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var btnload = document.getElementById('btnload');

let pathName = path.join(__dirname, 'Files');

btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;
    fs.writeFile(file, contents, function(err) {
        if(err) {
            return console.log(err);
        }
        alert(fileName.value + " text file was created");
        console.log("The file was created");
    });
});

btnRead.addEventListener('click', function() {
    const storedWeatherData = JSON.parse(localStorage.getItem("weatherData"));

    if (storedWeatherData) {
        const weatherText = `
            Recommendation: ${storedWeatherData.recommendation}

            Location: ${storedWeatherData.location}
            ${storedWeatherData.currentTemp}
            ${storedWeatherData.forecastTemp}
            ${storedWeatherData.conditions}
            ${storedWeatherData.windSpeed}
            ${storedWeatherData.humidity}
            ${storedWeatherData.rainChance}
            ${storedWeatherData.localTime} // Display local time
        `;
        fileContents.value = weatherText.trim();
    } else {
        alert("No weather data found in localStorage. Please fetch weather data from the Weather Page.");
    }
});

btnload.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    fs.readFile(file, function(err, data) {
        if (err) {
            return console.log(err);
        }
        fileContents.value = data;
        console.log("The file was read!");
    });
});

btnDelete.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    fs.unlink(file, function(err) {
        if (err) {
            return console.log(err);
        }
        fileName.value = "";
        fileContents.value = "";
        console.log("The file was deleted!");
    });
});

btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    let newContents = fileContents.value;

    fs.writeFile(file, newContents, function(err) {
        if (err) {
            return console.log(err);
        }
        alert(fileName.value + " text file was updated");
        console.log("The file was updated!");
    });
});
