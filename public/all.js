async function getData(){
    const request = await fetch('api/');
    const data = await request.json();

    // add table
    const tbl = document.createElement('table')
    //add top row
    const topRow = tbl.insertRow();
    const columns = ["Latitude", "Longitude", "Date", "City"]
    for (colName of columns){
        const topd = topRow.insertCell();
        topd.appendChild(document.createTextNode(colName))
    }

    // add remaining rows
    data.forEach((elem, ind) => {
        tr = tbl.insertRow();
        for (dataName in elem){
            //ignore id column
            if (dataName !== "_id"){
                const td = tr.insertCell();
                //replace empty inputs with none
                const text = elem[dataName] ? elem[dataName] : 'None'
                td.appendChild(document.createTextNode(text))
            }
        }
    })
    //Add to page
    document.body.append(tbl)
}

getData();
