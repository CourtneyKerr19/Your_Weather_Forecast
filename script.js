
const apiKey = "c58deec9381a085ee7a2e646e341e9e6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric7q=memphis";

async function checkWeather(){
    const response = await fetch(apiUrl + `&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);
}

checkWeather();