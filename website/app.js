/* Global Variables */
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall";
const zipURL = "http://api.openweathermap.org/geo/1.0/zip"
const key = "495c16bf9a0ac87f9a9f64850b6a6cb3";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// Use zipURL to receive long and lat by using zipcode
const userInfo = document.getElementById('userInfo');
const generate = document.getElementById('generate');

// Function to get the coords using the zipcode entered in the form
const getCoords = async (zipURL, zip, key) => {

    // res equals to the result of fetch function
    const res = await fetch(`${zipURL}?zip=${zip}&appid=${key}`);
    try {

        // data equals to the result of fetch function
        const coords = await res.json();
        return coords;
    }
    catch (error) {
        console.log("error", error);
    }
};

// Function to get the weather data using the lat and long
const getWeatherData = async (weatherURL, lat, long, key) => {
    const res = await fetch(`${weatherURL}?lat=${lat}&long=${long}&appid=${key}`);
    try {
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log("error", error);
    }
}