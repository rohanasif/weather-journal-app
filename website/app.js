/* Global Variables */
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall";
const zipURL = "http://api.openweathermap.org/geo/1.0/zip"
const key = "125f42aff073c9c5f0887b46a4dca02d&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

// Use zipURL to receive lon and lat by using zipcode
const userInfo = document.getElementById("userInfo");
const generate = document.getElementById("generate");

generate.addEventListener("click", (e) => {
    e.preventDefault();

    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    if (zip !== "") {
        generate.classList.remove("invalid");
        getCoords(zipURL, zip, key)
            .then(coords => getWeatherData(weatherURL, coords, key))
            .then(function (data) {
                postData("/add", { temp: data.temp, date: newDate, feelings: feelings });
            }).then(function () {
                receiveData()
            }).catch(function (error) {
                console.log(error);
                alert("Invalid zipcode");

            });
        userInfo.reset();
    }
    else {
        generate.classList.add("invalid");
    }

})

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

// Function to get the weather data using the lat and lon
const getWeatherData = async (weatherURL, coords, key) => {
    const res = await fetch(`${weatherURL}?lat=${coords.lat}&lon=${coords.lon}&appid=${key}`);
    try {
        const data = await res.json();

        return data;
    }
    catch (error) {
        console.log("error", error);
    }
}

// Function to POST data
const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            feelings: data.feelings
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};
// Function to receive data
const receiveData = async () => {
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