// weather.js
// Created by: rslarkin

// Function to get Latitude and Longitude from the OpenWeather API

// Declare Variables
const weatherContent = document.querySelector('#weather');
const weatherDetailedContent = document.querySelector('#weatherDetailed');
const weatherContainer = document.querySelector('#visualContainer');
const errorMsg = document.querySelector('#msg');
const titleDiv = document.querySelector('#forecastTitle')
const API_KEY = ''

const getLatLon = (data, zipCode) => {
    // Check to see if an error occurred
    if (data.cod == '400' || data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // Show the initially hidden div
        errorMsg.style.display = 'inline-block'
        errorMsg.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    } else {
        // return an array of the latitude and longitude
        return [data.lat, data.lon];
    }
}

// doesn't do anything
// plan: display Location, State above forecast data, so user sees location
// const getStateFromLatLon = (zipCode) => {
//     const geo = getLatLon(data, zipCode);
//     const limit = 1
//     url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${geo[0]}&lon=${geo[1]}&limit=${limit}&appid=${API_KEY}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data);
//             // Call the getLatLon function which returns an array
//             const geo = getLatLon(data, zipCode);
//         })
// }

// Function to get the current weather given the data and zip code
const getCurrentWeather = (data) => {
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        errorMsg.style.display = 'inline-block'
        errorMsg.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    }
    return data // this function only gets the data and potentially displays an error; another will make use of it.
};

// This function must be used to display the 5 day weather forecast
const getWeeklyWeatherForecast = (data) => {
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        errorMsg.style.display = 'inline-block'
        errorMsg.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    }
    return data // this function only gets the data and potentially displays an error; another will make use of it.
};

getHourlyWeatherForecast = (data) => {
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        errorMsg.style.display = 'inline-block'
        errorMsg.innerHTML = 'Please enter a valid Zip Code';
        return; // exit
    }
    return data // this function only gets the data and potentially displays an error; another will make use of it.
}

document.querySelector('#getWeather').addEventListener('click', () => {
    weatherContent.innerHTML = ''; // clear out prior results
    weatherDetailedContent.innerHTML = ''; // clear out prior results
    errorMsg.innerHTML = ''; // clear errors
    titleDiv.innerHTML = '' // clear
    let zipCode = document.querySelector('#zip').value;

    // First call the geolocation API to get the latitude and longitude of the zip code
    let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call the getLatLon function which returns an array
            const geo = getLatLon(data, zipCode);

            // current weather data
            currentURL = `http://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`;
            // 7 day forecast
            weeklyURL = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${geo[0]}&lon=${geo[1]}&cnt=7&appid=${API_KEY}&units=imperial`;
            // 24 hour forecast
            dailyURL = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${geo[0]}&lon=${geo[1]}&cnt=24&appid=${API_KEY}&units=imperial`;

            fetch(weeklyURL)
                .then(response => response.json())
                .then(data => {
                    // Call getWeeklyWeather function
                    return getWeeklyWeatherForecast(data, geo[0], geo[1]);
                })
                .then(weeklyData => {
                    // call the weeklyWeather handler
                    handleWeeklyData(weeklyData,geo[0],geo[1]);
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });
            fetch(dailyURL)
                .then(response => response.json())
                .then(data => {
                    // Call getHourlyWeather function
                    return getHourlyWeatherForecast(data, geo[0], geo[1]);
                })
                .then(hourlyData => {
                    // call the hourlyWeather handler
                    handleHourlyData(hourlyData,geo[0],geo[1])
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });
            fetch(currentURL)
                .then(response => response.json())
                .then(data => {
                    // Call getCurrentWeather function
                    return getCurrentWeather(data,geo[0],geo[1]);
                })
                .then(currentData => {
                    // call the currentWeather handler
                    handleCurrentData(currentData,geo[0],geo[1])
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`);
                });   
        }).catch((e) => {
            console.log(`This error occurred: ${e}`);
        });
});
// not currently used
// planned to use for current temp, code uses general temp from weeklyData atm
// const handleCurrentData = (data) => {
    // const div = document.createElement('div');
    // div.innerHTML = data[0]
    // document.body.append(div)
    // console.log(data)
// }

// used only for canvasJS
const handleHourlyData = (data) => {
    dailyPlotPoints = []
    dailyPlotImages = []
    data.list.forEach((e, i) => {
        let date = new Date(data.list[i].dt * 1000);
        let timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric' });
        dailyPlotPoints.push({ label: timeStr, y: Math.floor(data.list[i].main.temp), name: data.list[i].weather[0].description, pop: (data.list[i].pop * 100) })
        dailyPlotImages.push(`http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`)
    })
    generateChart(dailyPlotPoints, dailyPlotImages)
}
// very messy, needs cleaned up
const handleWeeklyData = (data) => {
    data.list.forEach((e, i) => {
        console.log(e)
        let date = new Date(data.list[i].dt * 1000);
        let dateStr = date.toLocaleDateString('en-US');
        let timeStr = date.toLocaleTimeString('en-US');
        let dateDayStr = date.toLocaleDateString('en-US', { weekday: 'long' });
        const forecastBlock = document.createElement('div'); // create div for forecast
        forecastBlock.classList.add('border-y', 'border-x-2', 'flex', 'justify-center', 'text-start');
        const forecastDate = document.createElement('div'); // create div for date
        if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            forecastDate.innerHTML = `<b>${dateDayStr}</b>`;
            forecastBlock.classList.add('border-r-0')
        } else {
            forecastDate.innerText = dateDayStr;
        }
        const forecastTemp = document.createElement('div'); // create div for actual data from API
        forecastTemp.innerHTML = `${parseInt(data.list[i].temp.max)}&deg; / ${parseInt(data.list[i].temp.min)}&deg;`;
        const forecastIcon = document.createElement('div'); // create div for icon for easy responsive design
        const icon = document.createElement('img'); // create img element for icon
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`); // set the src attribute using the data from the API
        icon.setAttribute('alt', data.list[i].weather[0].description); // set the img alt text using data from API
        forecastBlock.append(forecastDate, forecastTemp, forecastIcon);
        forecastIcon.append(icon);
        forecastBlock.classList.add('py-2')
        forecastDate.classList.add('content-center', 'w-1/5', 'text-left')
        forecastTemp.classList.add('content-center', 'w-1/5', 'text-center')
        forecastIcon.classList.add('content-center', 'w-1/5', 'flex', 'justify-center', 'items-center')
        weatherContent.classList.add('border-y', 'shadow-[0px_0px_5px_2px_#0891b2]')
        weatherContent.style.clipPath = 'inset(-20px 0 -20px -20px)'
        
        weatherContent.append(forecastBlock);

        // weatherDetailedContent content

        let sunriseDate = new Date(data.list[i].sunrise * 1000);
        let sunsetDate = new Date(data.list[i].sunset * 1000);
        let sunriseTimeStr = sunriseDate.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });
        let sunsetTimeStr = sunsetDate.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });

        const detailedDiv = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.classList.add('text-xl', 'font-bold')

        const feelsLike = document.createElement('div');
        feelsLike.innerHTML = `Feels like: ${Math.round(data.list[i].feels_like.eve)}°`
        feelsLike.classList.add('mt-4', 'mb-2')
        const feelsLikeIcon = document.createElement('img');
        feelsLikeIcon.setAttribute('src', 'img/feels_like.svg');
        feelsLikeIcon.setAttribute('width', 35);
        feelsLikeIcon.classList.add('mx-auto');
        feelsLikeIcon.setAttribute('alt', 'icon for feels like temp');
        feelsLike.insertAdjacentElement('afterbegin', feelsLikeIcon);

        const sunriseSunsetDiv = document.createElement('div');

        const sunrise = document.createElement('div');
        sunrise.innerHTML = `Sunrise<br> ${sunriseTimeStr}`;
        sunrise.classList.add('mr-4', 'inline-block');
        const sunriseIcon = document.createElement('img');
        sunriseIcon.setAttribute('src', 'img/sunrise.svg');
        sunriseIcon.setAttribute('width', 35);
        sunriseIcon.setAttribute('alt', 'icon for sunrise');
        sunriseIcon.classList.add('mx-auto');

        const sunset = document.createElement('div');
        sunset.innerHTML = `Sunset<br> ${sunsetTimeStr}`;
        sunset.classList.add('ml-4', 'inline-block');
        const sunsetIcon = document.createElement('img');
        sunsetIcon.setAttribute('src', 'img/sunset.svg');
        sunsetIcon.setAttribute('width', 35);
        sunsetIcon.setAttribute('alt', 'icon for sunset');
        sunsetIcon.classList.add('mx-auto');

        sunrise.insertAdjacentElement('afterbegin', sunriseIcon)
        sunset.insertAdjacentElement('afterbegin', sunsetIcon)
        sunriseSunsetDiv.append(sunrise, sunset)
        sunriseSunsetDiv.classList.add('my-2')

        const precipitation = document.createElement('div');
        precipitation.innerHTML = `${Math.floor(data.list[i].pop * 100)}% chance of rain`
        precipitation.classList.add('my-2')
        const precipitationIcon = document.createElement('img');
        precipitationIcon.setAttribute('src', 'img/umbrella.svg');
        precipitationIcon.setAttribute('width', 35);
        precipitationIcon.setAttribute('alt', 'icon for rain chance');
        precipitationIcon.classList.add('mx-auto');
        precipitation.insertAdjacentElement('afterbegin', precipitationIcon);

        const humidity = document.createElement('div');
        humidity.innerHTML = `Humidity: ${data.list[i].humidity}%`;
        humidity.classList.add('my-2')
        const humidityIcon = document.createElement('img');
        humidityIcon.setAttribute('src', 'img/humidity.svg');
        humidityIcon.setAttribute('width', 35);
        humidityIcon.setAttribute('alt', 'icon for humidity');
        humidityIcon.classList.add('mx-auto');
        humidity.insertAdjacentElement('afterbegin', humidityIcon);

        const windDirection = document.createElement('div');
        windDirection.innerHTML = '<i class="fa-solid fa-location-arrow -rotate-45"></i>';
        windDirection.style.transform = `rotate(${data.list[i].deg}deg)`;
        windDirection.classList.add('inline-block')

        const windText = document.createElement('div');
        windText.innerHTML = `${Math.floor(data.list[i].speed)} mph winds`;
        windText.classList.add('ml-1', 'my-2', 'inline-block')

        const overallTemp = document.createElement('div');
        overallTemp.classList.add('mt-2', 'mb-4', 'flex', 'flex-row', 'flex-wrap', 'justify-center')
        const morningTemp = document.createElement('div');
        morningTemp.classList.add('w-2/5', 'mb-2')
        const dayTemp = document.createElement('div');
        dayTemp.classList.add('w-2/5', 'mb-2')
        const eveningTemp = document.createElement('div');
        eveningTemp.classList.add('w-2/5')
        const nightTemp = document.createElement('div');
        nightTemp.classList.add('w-2/5')
        morningTemp.innerHTML = `Morning: ${Math.floor(data.list[i].temp.morn) + '°'}`
        dayTemp.innerHTML = `Afternoon: ${Math.floor(data.list[i].temp.day) + '°'}`
        eveningTemp.innerHTML = `Evening: ${Math.floor(data.list[i].temp.eve) + '°'}`
        nightTemp.innerHTML = `Overnight: ${Math.floor(data.list[i].temp.night) + '°'}`
        overallTemp.append(morningTemp, dayTemp, eveningTemp, nightTemp)

        currentTime = new Date()

        if (currentTime >= new Date().setHours(18, 0, 0, 0)) {
            eveningTemp.classList.add('font-semibold')
        } else if (currentTime >= new Date().setHours(12, 0, 0, 0)) {
            dayTemp.classList.add('font-semibold')
        } else if (currentTime >= new Date().setHours(6, 0, 0, 0)) {
            morningTemp.classList.add('font-semibold')
        } else if (currentTime >= new Date().setHours(0, 0, 0, 0)) {
            nightTemp.classList.add('font-semibold')
        }

        detailedDiv.append(h3, feelsLike, precipitation, humidity, windDirection, windText, sunriseSunsetDiv, overallTemp)
        detailedDiv.setAttribute('id', dateDayStr)

        if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            detailedDiv.classList.add('block')
            h3.innerText = "Today";
        } else {
            detailedDiv.classList.add('hidden')
            h3.innerText = dateDayStr;
        }

        weatherDetailedContent.append(detailedDiv)
        weatherDetailedContent.classList.add('border-r-2', 'border-y-2', 'shadow-[0px_0px_5px_2px_#0891b2]')
        weatherDetailedContent.style.clipPath = 'inset(-20px -20px -20px 0)'

    })
    const weeklyH2 = document.createElement('h2')
    weeklyH2.innerText = '7 Day Forecast'
    titleDiv.classList.add('font-bold', 'mt-[17rem]', 'pb-2', 'text-3xl', 'shadow-[0px_0px_5px_2px_#0891b2]', 'border-x-2', 'border-t-2')
    titleDiv.style.clipPath = 'inset(-20px -20px 0 -20px)'
    titleDiv.append(weeklyH2)
    const weeklyWeather = document.getElementById('weeklyForecast')
    weeklyWeather.insertAdjacentElement('beforebegin', titleDiv)
}

// canvasJS
const generateChart = (data) => {
    // dynamically set min and max data point
    let min = data[0].y;
    let max = data[0].y;
    data.forEach((i) => {
        if (i.y > max) {
            max = i.y;
        }
        if (i.y < min) {
            min = i.y;
        }
    });
    //Create Chart
    let chart = new CanvasJS.Chart("visualContainer", {
        //Chart Options - Check https://canvasjs.com/docs/charts/chart-options/
        height: 270,
        title: {
            text: "24 Hour Forecast",
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontColor: 'black',
            fontSize: 30
        },
        axisY: {
            suffix: "°F",
            // make sure the Y axis is 10 higher than actual data and 10 lower than actual data
            maximum: Math.ceil((max)/10)*10+10,
            minimum: Math.floor((min)*.1)*10-10,
            gridThickness: 0
        },
        toolTip: {
            shared: true,
            content: '{name} <br> <b>Temperature:</b> {y}°F <br> {pop}% of rain'
        },
        data: [{
            type: "line", // line chart
            indexLabelFormatter: formatter,
            dataPoints: data
        }]
    });
    //Render Chart
    chart.render();

    const creditsEdit = document.getElementsByClassName('canvasjs-chart-credit')[0]
    creditsEdit.innerText = 'Powered by CanvasJS.com'
    const canvasEdit = document.getElementsByClassName('canvasjs-chart-canvas')[0]
    canvasEdit.classList.add('border-2', 'shadow-[0px_0px_5px_2px_#0891b2]')


    const addImages = (chart) => {
        const container = document.querySelector('#visualContainer').getElementsByClassName('canvasjs-chart-container')[0]
        container.classList.add('top-4')
        for (let i = 0; i < chart.data[0].dataPoints.length; i++) {
            const chartIcon = document.createElement('img')
            chartIcon.setAttribute('src', dailyPlotImages[i])
            chartIcon.setAttribute('alt', dailyPlotPoints[i].name)
            container.append(chartIcon)

            const positionImage = (image, i) => {
                const imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x);
                const imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
                image.style.left = (imageCenter - 20) + "px";
                image.style.top = (imageTop) + "px";
                image.classList.add('absolute')
            }
            positionImage(chartIcon, i)
        }
    }
    addImages(chart);
}

// part of canvasJS
const formatter = (e) => {
    return e.dataPoint.y + "°";
}

// not functional yet
// const backgroundUpdater = () => {
//     let light = 'bg-white'
//     let dark = 'bg-zinc-900'
//     let grayscale = 'grayscale'
//     let day = 'bg-gradient-to-b from-cyan-500 to-slate-300'
//     let dayBG = 'cyan-500'
//     let evening = 'bg-gradient-to-b from-gray-900 to-zinc-600'
//     let eveningBG = 'gray-900'
// }