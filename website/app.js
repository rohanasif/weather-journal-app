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
    } catch (error) {
        console.log("error", error);
    }
};

// Function to get the weather data using the lat and long
const getWeatherData = async (weatherURL, coords, key) => {
    const res = await fetch(`${weatherURL}?lat=${coords.lat}&long=${coords.long}&appid=${key}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

generate.addEventListener('click', (e) => {
    e.preventDefault();

    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    if (zip !== "") {
        generate.classList.remove("invalid");
        getWeatherData(weatherURL, getCoords(zipURL, zip, key), key)
            .then(function (data) {
                // add data to POST request
                postData("/add", { temp: data.main.temp, date: newDate, content: content });
            }).then(function () {
                // call updateUI to update browser content
                updateUI()
            }).catch(function (error) {
                console.log(error);
                alert('The zip code is invalid. Try again');

            });
        userInfo.reset();
    } else {
        generate.classList.add('invalid');
    }
})

const retrieveData = async () => {
    const request = await fetch('/all');
    try {
        // Transform into JSON
        const allData = await request.json()
        console.log(allData)
        // Write updated data to DOM elements
        document.getElementById('temp').innerHTML = Math.round(allData.temp) + 'degrees';
        document.getElementById('content').innerHTML = allData.feel;
        document.getElementById("date").innerHTML = allData.date;
    }
    catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}