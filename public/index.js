//create map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const issMap = L.map('issMap', {minZoom: 2}).setView([0, 0], 2);
const tileOptions = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
const tiles = L.tileLayer(tileUrl, tileOptions)
tiles.addTo(issMap)
// //set up icon
// const issIcon = L.icon({
//     iconUrl: 'iss256.png',
//     iconSize: [50, 32],
//     iconAnchor: [25, 16],
// });
//create marker
let issMarker = L.marker([0, 0]).addTo(issMap);

function geolocate(){
  if('geolocation' in navigator) {
    console.log('Geolocation is available')
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords
      //console.log(position.coords.latitude, position.coords.longitude);
      document.getElementById('lat').textContent = position.coords.latitude;
      document.getElementById('lon').textContent = position.coords.longitude;
  });
  } else {
    console.log('Geolocation is not available')
  }
}