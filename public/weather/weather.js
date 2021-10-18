//create map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const geoMap = L.map('geoMap', {minZoom: 2}).setView([0, 0], 2);
const tileOptions = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
const tiles = L.tileLayer(tileUrl, tileOptions)
tiles.addTo(geoMap)
//create marker
let geoMarker = L.marker([0, 0]).addTo(geoMap);

function geolocate(){
  if('geolocation' in navigator) {
    console.log('Geolocation is available')
    navigator.geolocation.getCurrentPosition( async (position) => {
      const {latitude, longitude} = position.coords
      //console.log(position.coords.latitude, position.coords.longitude);
      //update marker
      geoMarker.setLatLng([latitude, longitude]);
      //update view
      geoMap.setView([latitude, longitude], 10);
      //send data to server
      const data = {latitude, longitude};
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      };
      //send get request to server to retreive weather information
      const response = await fetch(`/weather/${latitude}/${longitude}`);
      const json = await response.json();
      console.log(json)
      //get weather data
      const weather = json.weather.weather['0'].main
      const temp = (json.weather.main.temp - 273.15).toFixed(2)
      const feels = (json.weather.main.feels_like - 273.15).toFixed(2)
      //add info to webpage
      document.getElementById('lat').textContent = `${latitude}`;
      document.getElementById('lon').textContent = `${longitude}`;
      document.getElementById('temp').textContent = `${temp}°C`;
      document.getElementById('feels').textContent = `${feels}°C`;
      document.getElementById('weather').textContent = weather;
      try{
        //get aq data
        const aq = json.aq.results[0].measurements[0]
        document.getElementById('aq_param').textContent = ` (${aq.parameter}):`;
        document.getElementById('aq_quality').textContent = `${aq.value}${aq.unit}`;
      } catch (error) {
        console.error(error);
        document.getElementById('aq_quality').textContent = "No Data";
      }

      //console.log(aq)
  });
  } else {
    console.log('Geolocation is not available')
  }
}
