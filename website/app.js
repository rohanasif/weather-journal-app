/* Global Variables */
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall";
const zipURL = "http://api.openweathermap.org/geo/1.0/zip"
const key = "495c16bf9a0ac87f9a9f64850b6a6cb3";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// Use zipURL to receive long and lat by using zipcode
const userInfo = document.getElementById("userInfo");
const generate = document.getElementById("generate");

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
const getWeatherData = async (weatherURL, coords, key) => {
    const res = await fetch(`${weatherURL}?lat=${coords['lat']}&long=${coords['long']}&appid=${key}`);
    try {
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log("error", error);
    }
}

generate.addEventListener("click", (e) => {
    e.preventDefault();

    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    if (zip !== "") {
        generate.classList.remove("invalid");
        getCoords(zipURL, zip, key)
            .then(coords => getWeatherData(weatherURL, coords, key))
            .then(function (data) {
                // add data to POST request
                postData("/add", { temp: kelvinToCelsius(data.main.temp), date: newDate, feelings: feelings });
            }).then(function () {
                // call updateUI to update browser content
                updateUI()
            }).catch(function (error) {
                console.log(error);
                alert("The zip code is invalid. Try again");

            });
        userInfo.reset();
    }
    else {
        generate.classList.add("invalid");
    }

})

/* Function to POST data */
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

const updateUI = async () => {
    const request = await fetch("/all");
    try {
        const allData = await request.json();
        console.log(allData);
        // update new entry values
        if (allData.date !== undefined && allData.temp !== undefined && allData.feelings !== undefined) {
            document.getElementById("date").innerHTML = allData.date;
            document.getElementById("temp").innerHTML = allData.temp + " degree C";
            document.getElementById("feelings").innerHTML = allData.feelings;
        }
    } catch (error) {
        console.log("error", error);
    }
};

// helper function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return "below absolute zero (0 K)";
    } else {
        return (kelvin - 273.15).toFixed(2);
    }
}