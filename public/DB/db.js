async function getData(){
    const request = await fetch('../api/');
    const data = await request.json();

    // add table
    const tbl = document.createElement('table')
    tbl.className = "table table-striped"
    //add table head
    const thead = document.createElement('thead')
    thead.className = "table-dark"
    const topRow = thead.insertRow();
    const columns = ["#", "Latitude", "Longitude", "Date", "City"]
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
    })
    tbl.append(tbody)
    //Add to page
    document.getElementById("list").append(tbl)
}

getData();
