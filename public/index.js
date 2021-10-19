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
      const apiResponse = await fetch(`/weather/${latitude}/${longitude}`);
      const apiData = await apiResponse.json();

      //parse data
      const weather = apiData.weather
      const aqArray = apiData.aq.results

      //add weather+location data to table
      addStaticData(latitude, longitude, weather)
      //add air quality data to table
      addDynamicData(aqArray)


      //send data to server (store in db)
      const data = {latitude, longitude, weather, aqArray};
      console.log(data)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      };
      const dbResponse = await fetch('/weather', options);
      const dbJson = await dbResponse.json();
      console.log(dbJson)
  });
  } else {
    console.log('Geolocation is not available')
  }
}

function addStaticData(latitude, longitude, data){
  //parse data
  const weather = data.weather['0'].main;
  const temp = (data.main.temp - 273.15);
  const feels = (data.main.feels_like - 273.15);
  const humidity = data.main.humidity;
  
  //add info to webpage
  document.getElementById('lat').textContent = `${latitude}`;
  document.getElementById('lon').textContent = `${longitude}`;
  document.getElementById('temp').textContent = `${temp.toFixed(2)}°C`;
  document.getElementById('feels').textContent = `${feels.toFixed(2)}°C`;
  document.getElementById('humid').textContent = `${humidity}%`;
  document.getElementById('weather').textContent = weather;
}

function addDynamicData(data){
  //delete old table
  const oldTableBody = document.getElementById("location-table-body")
  oldTableBody.remove()

  //create new table
  const tbody = document.createElement("tbody")
  tbody.id = "location-table-body"

  //insert first row
  const tr1 = tbody.insertRow()
  const td1 = tr1.insertCell()
  td1.appendChild(document.createTextNode("Air Quality:"))
  
  // insert air quality data if available
  if (data.length > 0){
    const measurements = data[0].measurements;
    measurements.forEach((elem, ind) => {
      // get values
      const parameter = elem.parameter
      const value = elem.value
      const unit = elem.unit
      //add rows
      const tr = tbody.insertRow();
      const tdName = tr.insertCell();
      tdName.appendChild(document.createTextNode(`${parameter}:`));
      const tdInfo = tr.insertCell();
      tdInfo.appendChild(document.createTextNode(`${value}${unit}`));
    })
  } else{
    const td2 = tr1.insertCell()
    td2.appendChild(document.createTextNode("No Data"))
  }

  //insert into main table
  const tbl = document.getElementById("location-table")
  tbl.appendChild(tbody)
}