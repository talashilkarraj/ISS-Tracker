var mymap = new L.map('data').setView([18.977320, 73.100452], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/rajt/cknhqnmuo5mwf17s7fiou4l5u/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q'
}).addTo(mymap);

const iss = L.marker([0, 0]).addTo(mymap);

async function FlightData(){
	// const flightData =  await fetch("https://api.wheretheiss.at/v1/satellites/25544")
	const flightData =  await fetch("https://api.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NBYPR8-4GD9VB-EKEH92-4OD7", 
	
	{	
		header:{
		"origins": "http://localhost:5500",
		"Access-Control-Allow-Origin" :"http://127.0.0.1:5500",
		"Access-Control-Allow-Credentials" : "true",
		"Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"},
	})
	//const flightData =  await fetch("http://api.aviationstack.com/v1/airports?access_key=7c2627d5608f52825657011739068187")
	var data1  = await flightData.json();
	// var i;
	console.log(data1)
	console.log("Lat: " ,data1.positions[0].satlatitude,"\nLng: ",data1.positions[0].sataltitude);
	iss.setLatLng([data1.positions[0].satlatitude,data1.positions[0].sataltitude])

	
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.error(err);
// })


}
FlightData()
// Access-Control-Allow-Origin: http://example.com:8080
// https://api.aviationstack.com/v1/routes?access_key=7c2627d5608f52825657011739068187