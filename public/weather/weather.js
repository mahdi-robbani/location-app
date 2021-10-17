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
      const weather = json.weather['0'].main
      //add info to webpage
      document.getElementById('lat').textContent = latitude;
      document.getElementById('lon').textContent = longitude;
      document.getElementById('weather').textContent = weather;
  });
  } else {
    console.log('Geolocation is not available')
  }
}
