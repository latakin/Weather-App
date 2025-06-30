//const openEndpoint = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,daily&appid={API key}"
const apiKey = 'f24906418cd485dfa82a5fe992122486';
 document.addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundImage = 'url("images/sunrise.jpg")';
    document.querySelector('#button').addEventListener('click', () => {

        const cityInput = document.getElementById('city');
        
        const cityName = cityInput.value;
        const symbol = "\u00B0";

        const result = document.querySelector('#results'); 
        result.classList.add('open');
        if(!cityName) {
            result.innerHTML = `
            <h3> City Not Found </h3>
            `
        } else { 
            
            fetchImage(cityName);
            fetchlat(cityName)
            .then(({latitude, longitude}) => {
                return fetchReport(latitude, longitude)
            })
            .then((data) => {
                console.log(data)
                const degK = data.current.temp;
                const degC = Math.round(degK - 273);
                const degF = Math.round((degC * ( 9/5)  + 32));
                const description = data.current.weather[0].description;
                console.log(description);
                console.log(`${degC} ${symbol}`);
                let cityNameCase = cityName.toUpperCase();
                result.innerHTML = `
                    <body>
                        <h1 class="cityname"> ${cityNameCase} </h1>
                        <h2 class="temp">${degC} ${symbol}C / ${degF}${symbol}F</h2>
                        <h3 class="desc">${description} </h3>
                    </body>`
                cityInput.value = "";
            })
            .catch( error => {
                result.innerHTML = `
                <h3>Enter a valid city name</h3>
                `
            })
        }
            });
    });
 
 

 const fetchlat = (cityName) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
    
    return fetch(url)
    .then((response) => {
        if(!response.ok) {
            return null;
        }
        return response.json()})
    .then((data) => {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        
        return { latitude, longitude};
        
    })
    .catch( (error )=> {
        console.error("Error fetching data: ", error)
        
    }
    )

 }
 const fetchReport = (latitude, longitude) => {
            const openUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily&appid=${apiKey}`
            
            return fetch(openUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`)
                }
               return response.json()})
            .then((data) => {
                console.log(data)
                return data;
            })
            .catch( error => {
                console.error("Error fetching data: ", error)
    }
    )
        }   

 
const fetchImage = (cityName) => {
    const unsplashAccessKey = 'KVLFg-cWeXe1L4al_tdN5efR2gcmvJGksMByesxRoms'
    const url = `https://api.unsplash.com/search/photos?query=${cityName}&per_page=1&client_id=${unsplashAccessKey}`;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const imageUrl = data.results[0].urls.regular;
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    } )
    .catch( error => {
        console.error("Error fetching image :", error)
        document.body.style.backgroundImage ='url("images/cloudy-sky.jpg")';
    })
}

