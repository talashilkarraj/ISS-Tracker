var mymap = new L.map('data').setView([18.977320, 73.100452], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/rajt/cknhqnmuo5mwf17s7fiou4l5u/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q'
}).addTo(mymap);

const sat = L.marker([0, 0]).addTo(mymap);

async function FlightData(){
	// const flightData =  await fetch("https://api.wheretheiss.at/v1/satellites/25544")
	//const flightData =  await fetch("https://api.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NBYPR8-4GD9VB-EKEH92-4OD7", 
	const flightData =  await fetch("https://api.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NBYPR8-4GD9VB-EKEH92-4OD7",
	{	
		header:{
		"origins": "http://localhost:5500",
		"Access-Control-Allow-Origin" :"http://127.0.0.1:5500",
		"Access-Control-Allow-Credentials" : "true",
		"Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"},
	})
	var data1  = await flightData.json();
	console.log(data1)
	console.log("Lat: " ,data1.positions[0].satlatitude,"\nLng: ",data1.positions[0].satlongitude);
    // const iss = L.marker([0, 0]).addTo(mymap);
	sat.setLatLng([data1.positions[0].satlatitude,data1.positions[0].satlongitude])
	
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.error(err);
// })

}
FlightData()
setInterval(FlightData, 1000)


