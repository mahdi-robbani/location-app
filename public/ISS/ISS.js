//create map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const issMap = L.map('issMap', {minZoom: 2}).setView([0, 0], 2);
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
//create position array
let posArr = [];

// data url
const issApiUrl = "https://api.wheretheiss.at/v1/satellites/25544"

//create async function to get data
let firstTime = true;
async function getData(){
    const response = await fetch(issApiUrl);
    const data = await response.json();
    // get desired features from json
    const {latitude, longitude, velocity} = data;
    //update marker
    issMarker.setLatLng([latitude, longitude]);
    // update and draw line
    posArr.push([latitude, longitude]);
    L.polygon(posArr).addTo(issMap);
    //replace spans with data
    document.getElementById('lat').textContent = latitude.toFixed(4);
    document.getElementById('lon').textContent = longitude.toFixed(4);
    document.getElementById('vel').textContent = `${velocity.toFixed(2)} mph`;
    //update view
    if (firstTime) {
        issMap.setView([latitude, longitude], 5);
        firstTime = false;
    }
}

//first run
getData();
// repeat function every 5 seconds
setInterval(() => { 
    getData();
    console.log("Updated")
}, 1000);