async function getData(){
    const request = await fetch('api/');
    const data = await request.json();

    // data.forEach((elem, ind) => {
    //     console.log(elem, elem)
    // })

    for (item of data){
        //create elements and sub elements
        const root = document.createElement('div')
        const loc = document.createElement('div')
        const city = document.createElement('div')
        const date = document.createElement('div')

        //Add data to elements
        loc.textContent = `Latitude: ${item.latitude}, Longitude: ${item.longitude}`
        cityString = item.city ? item.city : 'None'
        city.textContent = `City: ${cityString}`
        const dateString = new Date(item.date).toLocaleString();
        date.textContent = `Date: ${dateString}`

        //Append sub elements to main element
        root.append(loc, city, date)
        //Add to page
        document.body.append(root)
    }
}

getData();
