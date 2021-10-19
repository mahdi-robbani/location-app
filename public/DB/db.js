async function createTable(){
    //get data from server and createa  dynamic table
    const request = await fetch('../api/');
    const data = await request.json();
    console.log(data[0])

    // add table
    const tbl = document.createElement('table')
    tbl.className = "table"
    //add table head
    const thead = document.createElement('thead')
    thead.className = "table-dark"
    const topRow = thead.insertRow();
    const columnMap = {
        "#": "_id",
        "Country": "country",
        "Latitude": "lat",
        "Longitude": "lon",
        "Temperature": "temp",
        "Feels Like": "feels",
        "Humidity": "humidity",
        "Weather": "weather",
        "": "empty"
    }
    const columns = Object.keys(columnMap);
    for (colName of columns){
        const topd = topRow.insertCell();
        topd.appendChild(document.createTextNode(colName))
        topd.scope = "col"
    }
    tbl.append(thead)
    //add table body
    const tbody = document.createElement('tbody')
    data.forEach((elem, ind) => {
        tr = tbody.insertRow();
        for (let [colName, dataName] of Object.entries(columnMap)){
            if (dataName !== "empty") {
                const td = tr.insertCell();
                let text;
                if (dataName === "_id"){
                    td.scope = "row"
                    text = ind + 1;
                } else if (dataName === "lat" || dataName === "lon") {
                    text = elem[dataName] ? `${(elem[dataName]).toFixed(2)}°` : 'No Data'
                } else if (dataName === "temp" || dataName === "feels") {
                    text = elem[dataName] ? `${(elem[dataName] - 273.15).toFixed(2)}°C` : 'No Data'
                } else if (dataName === "humidity") {
                    text = elem[dataName] ? `${(elem[dataName])}%` : 'No Data'
                } else {
                    //replace empty inputs with none
                    text = elem[dataName] ? elem[dataName] : 'No Data'
                }
                td.appendChild(document.createTextNode(text))
            } else {
                const emptyTd = tr.insertCell()
                const btn = emptyTd.appendChild(document.createElement("button"))
                btn.textContent = "Delete"
                btn.className = "btn btn-primary"
                btn.onclick = () => { deleteEntry(elem["_id"]) };
            }
        }

    })
    tbl.append(tbody)
    //Add to page
    document.getElementById("list").append(tbl)
}

async function deleteEntry(locationID){
    //send id to server
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({locationID: locationID}),
      };
    const response = await fetch('/delete_location', options);
    const response_data = await response.json();
    console.log(response_data["info"])
    //refresh page
    location.reload();
}

createTable();
