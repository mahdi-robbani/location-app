//create map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const geoMap = L.map('geoMap', {minZoom: 2}).setView([0, 0], 2);
const tileOptions = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
const tiles = L.tileLayer(tileUrl, tileOptions)
tiles.addTo(geoMap)
// //set up icon
// const geoIcon = L.icon({
//     iconUrl: 'geo256.png',
//     iconSize: [50, 32],
//     iconAnchor: [25, 16],
// });
//create marker
let geoMarker = L.marker([0, 0]).addTo(geoMap);

function geolocate(){
  if('geolocation' in navigator) {
    console.log('Geolocation is available')
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords
      //console.log(position.coords.latitude, position.coords.longitude);
      document.getElementById('lat').textContent = latitude;
      document.getElementById('lon').textContent = longitude;
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
      fetch('/api', options);
      console.log("Sent data to server")
  });
  } else {
    console.log('Geolocation is not available')
  }
}