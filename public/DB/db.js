async function getData(){
    const request = await fetch('../api/');
    const data = await request.json();

    // add table
    const tbl = document.createElement('table')
    tbl.className = "table"
    //add table head
    const thead = document.createElement('thead')
    thead.className = "table-dark"
    const topRow = thead.insertRow();
    const columns = ["#", "Latitude", "Longitude", "Date", "City", ""]
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
        for (dataName in elem){
            const td = tr.insertCell();
            let text;
            if (dataName === "_id"){
                td.scope = "row"
                text = ind + 1;
            }
            else{
                //replace empty inputs with none
                text = elem[dataName] ? elem[dataName] : 'None'
            }
            td.appendChild(document.createTextNode(text))
        }
        const emptyTd = tr.insertCell()
        const btn = emptyTd.appendChild(document.createElement("button"))
        btn.textContent = "Delete"
        btn.className = "btn btn-primary"
        btn.onclick = () => { deleteEntry(elem["_id"]) };
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
}

getData();
