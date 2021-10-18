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
      //update marker
      geoMarker.setLatLng([latitude, longitude]);
      //update view
      geoMap.setView([latitude, longitude], 10);

      //send get request to server to retreive weather + aq information
      const response = await fetch(`/weather/${latitude}/${longitude}`);
      const json = await response.json();

      //parse weather data
      const weather = json.weather.weather['0'].main
      const temp = (json.weather.main.temp - 273.15)
      const feels = (json.weather.main.feels_like - 273.15)
      const aqResults = json.aq.results
      //parse air quality data
      let aqParam, aqQuality, aqValue, aqUnit;
      if (aqResults.length > 0){
        const measurements = aqResults[0].measurements
        measurements.forEach((elem, ind) => {
          // get values
          const parameter = elem.parameter
          const value = elem.value
          const unit = elem.unit
          
          //insert into table
          const tbody = document.getElementById("locationtablebody")
          const tr = tbody.insertRow();
          const tdName = tr.insertCell();
          tdName.appendChild(document.createTextNode(`${parameter}:`));
          const tdInfo = tr.insertCell();
          tdInfo.appendChild(document.createTextNode(`${value}${unit}`));
        })
      }

      // console.log(aqResults.length)
      // console.log(aqResults)
      //add info to webpage
      document.getElementById('lat').textContent = `${latitude}`;
      document.getElementById('lon').textContent = `${longitude}`;
      document.getElementById('temp').textContent = `${temp.toFixed(2)}°C`;
      document.getElementById('feels').textContent = `${feels.toFixed(2)}°C`;
      document.getElementById('weather').textContent = weather;
      // try{
      //   //get aq data
      //   const aq = json.aq.results[0].measurements[0]
      //   document.getElementById('aq_param').textContent = ` (${aq.parameter}):`;
      //   document.getElementById('aq_quality').textContent = `${aq.value}${aq.unit}`;
      // } catch (error) {
      //   console.error(error);
      //   document.getElementById('aq_quality').textContent = "No Data";
      // }

      //send data to server (store in db)
      const data = {latitude, longitude};
      console.log(data)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      };

      //console.log(aq)
  });
  } else {
    console.log('Geolocation is not available')
  }
}
