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

//user openweather API
const apiURl = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`