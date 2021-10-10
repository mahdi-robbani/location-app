async function getData(){
    const request = await fetch('api/');
    const data = await request.json();
    console.log(data);
}

getData();
