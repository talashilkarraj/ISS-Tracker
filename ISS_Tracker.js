import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

var mymap = new L.map('data').setView([18.977320, 73.100452],3.5);

L.tileLayer('https://api.mapbox.com/styles/v1/rajt/cknhqnmuo5mwf17s7fiou4l5u/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmFqdCIsImEiOiJja25oOWRzdnEydzV5Mm9tcWc0bW00NmZqIn0.c-KeDVJ13PSoL_4qe3j-9Q'
}).addTo(mymap);

const sat = L.marker([0, 0]).addTo(mymap);
let X, Y, Z;

const Api_url = "https://api.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NBYPR8-4GD9VB-EKEH92-4OD7"
async function FlightData(){
	const flightData =  await fetch(Api_url,
	{	
		header:{
		"origins": "http://localhost:5500",
		"Access-Control-Allow-Origin" :"http://127.0.0.1:5500",
		"Access-Control-Allow-Credentials" : "true",
		"Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"},
	})
	const data1  = await flightData.json();
	console.log(data1)
	console.log("Lat: ",data1.positions[0].satlatitude,"\nLng: ",data1.positions[0].satlongitude);
	sat.setLatLng([data1.positions[0].satlatitude,data1.positions[0].satlongitude]);
    sat.bindPopup("ISS Live Location"+"\nLatitude: "+ String(data1.positions[0].satlatitude)+"\nLongitude: "+String(data1.positions[0].satlongitude));

    window.location2 = function(){
        var theta = (Math.PI/180)*(data1.positions[0].satlatitude)+Math.PI/2;
        var phi = (Math.PI/180)*(data1.positions[0].satlongitude)+Math.PI;
        var x = -200*Math.sin(theta)*Math.cos(phi);
        var z = 200*Math.sin(theta)*Math.sin(phi);
        var y = 200*Math.cos(theta);
        console.log(data1.positions[0].satlatitude);

        X=x;
        Y=y;
        Z=z;
        console.log(x, y, z);
        return {x,y,z};
    }
    let {x,y,z} = location2();
    X=x;Y=y;Z=z;
    
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,10,3000);
    camera.position.set( 0, 0, 400 );

    const scene = new THREE.Scene();

    //antilias is true for removing visual distortions
    const renderer = new THREE.WebGLRenderer( { antialias:true } );

    const ambientLight = new THREE.AmbientLight( 0x404040, 4 ); //Color, Intensity
    const pointLight = new THREE.PointLight( 0xfffff2, 3 , 300 ); //Color, Intensity, Distance
    ambientLight.position.set( 0, 30, 0 );
    pointLight.position.set(0, 0, -270);
    scene.add( ambientLight );
    pointLight.castShadow = true;
    scene.add( pointLight );
    var example = new THREE.Object3D();


    let earth, meshu;
    function init(){
        // const axesHelper = new THREE.AxesHelper( 200 );
        // scene.add( axesHelper );
        //controls are used for handling the objects using mouse
        renderer.setSize(window.innerWidth,window.innerHeight);
        let controls = new OrbitControls( camera, renderer.domElement );

        // controls.minDistance  = 30; //60 units radius for min pan of camera
         controls.maxDistance  = 450; //75 units radius for max pan of camera

        // controls.maxPolarAngle = Math.PI/2; 
        // controls.minPolarAngle = Math.PI/2;

        //Earth's Globe
        let geometry = new THREE.SphereGeometry( 150, 52, 52 );
        const texture = new THREE.TextureLoader().load( 'textures/earthmap.jpg' );
        texture.flipY = true;
        const displacementMap = new THREE.TextureLoader().load("textures/gebco_bathy.5400x2700_8bit.jpg")
        const material = new THREE.MeshPhongMaterial( { map: texture } );
        material.displacementMap =  displacementMap;
        material.displacementScale = 25;
        material.shininess = 5;

        earth = new THREE.Mesh( geometry, material );
        earth.rotateOnWorldAxis( new THREE.Vector3( 0, 0, 1 ),0.3857178);
        //earth.rotateY(-1.5708);
        //Earth's axis tilt is 22.1deg = 0.3857178rad (approx.)
        scene.add( earth );

        //star-field
        let geometryu = new THREE.SphereGeometry(500,52,52);
        let textureu = new THREE.TextureLoader().load("textures/galaxy_starfield.png");
        let materialu = new THREE.MeshPhongMaterial({map: textureu, side: THREE.DoubleSide});
        meshu = new THREE.Mesh(geometryu, materialu);
        scene.add( meshu );
    
        const loader = new GLTFLoader();

        let threedobject = loader.load( 
            'ISS_stationary.glb', 
            function ( gltf ) {  
            example = gltf.scene; 

            example.scale.set(0.3,0.3,0.3);
            example.position.set(X, -Y, Z);
            //console.log(x,y,z)
            earth.add(example);

            },(xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },

            (error) => {
                console.log(error);
            }
        );

        scene.add( threedobject );
        document.body.appendChild( renderer.domElement );
    }


    function animate(){
        window.addEventListener('resize', () => {window.location.reload()} );
        let b = 0;
        earth.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), b += 0.00132 );
        //meshu.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), b += 0.000001 );
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
    }

    init();
    //setInterval(FlightData, 5000)
    animate();
}

FlightData();
