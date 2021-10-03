let firstTime = true;

//create async function to get data
async function getData(url, map, marker){
    const response = await fetch(url);
    const data = await response.json();
    // get desired features from json
    const {latitude, longitude, velocity} = data;
    //replace spans with data
    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);
    document.getElementById('vel').textContent = velocity.toFixed(0);
    //update view
    if (firstTime) {
        map.setView([latitude, longitude], 5);
        firstTime = false;
    }
    
    //update marker
    marker.setLatLng([latitude, longitude]);
}

//creare map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const issMap = L.map('issMap').setView([0, 0], 2);
const tileOptions = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
const tiles = L.tileLayer(tileUrl, tileOptions)
tiles.addTo(issMap)

//set up icon
const issIcon = L.icon({
    iconUrl: 'iss256.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16],
});

//create marker
let issMarker = L.marker([0, 0], {icon: issIcon}).addTo(issMap);

const issApiUrl = "https://api.wheretheiss.at/v1/satellites/25544"
//first run
getData(issApiUrl, issMap, issMarker)
// repeat function every 5 seconds
setInterval(() => { 
    getData(issApiUrl);
    console.log("Updated")
}, 1000);