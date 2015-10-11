var container, stats;
var camera, scene, renderer;
var vision = 1000;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX = 0, mouseY = 10;

var cube, triangle;
var collidablelist = [];

var velocity = 5;
var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var xmove = 0;
var ymove = 0;
var xvelocity = 0;
var yvelocity = 0;



init();
render();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	var arh = window.innerWidth / ( window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth );
	var arv = window.innerHeight / ( window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth );
	camera = new THREE.OrthographicCamera( arh * vision / - 2, arh * vision / 2, arv * vision / 2, arv * vision / - 2, - 500, 1000 );
	camera.position.set( 0, 0, 5 );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	var geometry = new THREE.BoxGeometry( 710, 10, 30 );	
	var wallmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var wall = new THREE.Mesh( geometry, wallmaterial );	
	wall.position.set( -5, 305, 0 );
	scene.add( wall );
	collidablelist.push( wall );

	geometry = new THREE.BoxGeometry( 710, 10, 30 );	
	wallmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	wall = new THREE.Mesh( geometry, wallmaterial );	
	wall.position.set( 5, -305, 0 );
	scene.add( wall );
	collidablelist.push( wall );

	geometry = new THREE.BoxGeometry( 10, 710, 30 );	
	wallmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	wall = new THREE.Mesh( geometry, wallmaterial );	
	wall.position.set( 305, 5, 0 );
	scene.add( wall );
	collidablelist.push( wall );

	geometry = new THREE.BoxGeometry( 10, 710, 30 );	
	wallmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	wall = new THREE.Mesh( geometry, wallmaterial );	
	wall.position.set( -305, -5, 0 );
	scene.add( wall );
	collidablelist.push( wall );



	var geom = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
	var triangleVertecies = [
		new THREE.Vector3( 20, 0, 1 ),
		new THREE.Vector3( -20, 20, 1 ),
		new THREE.Vector3( -20, -20, 1 ),
		new THREE.Vector3( 20, 0, 0 ),
		new THREE.Vector3( -20, 20, 0 ),
		new THREE.Vector3( -20, -20, 0 ),	]
	for ( var i in triangleVertecies )
		geom.vertices.push( triangleVertecies[i] );
	geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geom.faces.push( new THREE.Face3( 3, 5, 4 ) );
	geom.faces.push( new THREE.Face3( 0, 3, 4 ) );
	geom.faces.push( new THREE.Face3( 0, 4, 1 ) );
	geom.faces.push( new THREE.Face3( 0, 2, 3 ) );
	geom.faces.push( new THREE.Face3( 2, 5, 3 ) );
	geom.faces.push( new THREE.Face3( 2, 1, 4 ) );
	geom.faces.push( new THREE.Face3( 4, 5, 2 ) );
	geom.computeFaceNormals();
	triangle = new THREE.Mesh( geom, material );
	// triangle.position.set( 0, 0, 0 );
	scene.add( triangle );

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onKeyDown(event) {
	var keyCode = event.keyCode;
	switch (keyCode) {
		case 87: //w
			keyW = true;
			break;
		case 83: //s
			keyS = true;
			break;
		case 65: //a
			keyA = true;
			break;
		case 68: //d
			keyD = true;
			break;
	}
	xmove = keyA * -1 + keyD * 1;
	ymove = keyS * -1 + keyW * 1;
}


function onKeyUp( event ) {
	var keyCode = event.keyCode;
	switch (keyCode) {
		case 87: //w
			keyW = false;
			break;
		case 83: //s
			keyS = false;
			break;
		case 65: //a
			keyA = false;
			break;
		case 68: //d
			keyD = false;
			break;
	}
	xmove = keyA * -1 + keyD * 1;
	ymove = keyS * -1 + keyW * 1;
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( -event.clientY + windowHalfY );
}


function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	var arh = window.innerWidth / ( window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth );
	var arv = window.innerHeight / ( window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth );

	camera.left = arh * vision / - 2;
	camera.right = arh * vision / 2;
	camera.top = arv * vision / 2;
	camera.bottom = arv * vision / - 2;

	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function objMouseAngle() {
	var x = mouseX - triangle.position.x;
	var y = mouseY - triangle.position.y;
	var l = Math.sqrt( x * x + y * y);
	var alp = Math.asin( y / l );
	alp = x > 0 ? alp : Math.PI - alp;
	return alp;
}

function triangleStep() {
	var normal = checkCollision();
	if ( normal != null ){
		var moveVector = new THREE.Vector3( xmove, ymove, 0 ).normalize();
		var collisionVelocity = moveVector.add( normal );
		if ( collisionVelocity.length() < 1 ) {
			collisionVelocity = collisionVelocity.multiplyScalar( velocity );
			triangle.position.x += collisionVelocity.x;
			triangle.position.y += collisionVelocity.y;
		} else {
			triangle.position.x += velocity * xmove / ( ymove == 0 ? 1 : Math.sqrt( 2 ) );
			triangle.position.y += velocity * ymove / ( xmove == 0 ? 1 : Math.sqrt( 2 ) );
		}
	} else {
		triangle.position.x += velocity * xmove / ( ymove == 0 ? 1 : Math.sqrt( 2 ) );
		triangle.position.y += velocity * ymove / ( xmove == 0 ? 1 : Math.sqrt( 2 ) );
	}
	triangle.rotation.z = objMouseAngle();	
}

function checkCollision() {
	var originPoint = triangle.position.clone();
	var normals = [];
	for (var vertexIndex = 0; vertexIndex < triangle.geometry.vertices.length / 2; vertexIndex++)
	{		
		var localVertex = triangle.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( triangle.matrix );
		var directionVector = globalVertex.sub( triangle.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidablelist );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			normals.push( collisionResults[0].face.normal );
			// document.title = "!!!";
	}	
	if ( normals.length != 0 ){
		var result = normals[0];
		for ( var i = 1; i < normals.length; i++ )
			result.addVectors( result, normals[i]);
		return result.normalize();
	}
}

function render() {
	requestAnimationFrame( render );

	triangleStep();


	// document.title = false * 10;//xmove + " " + ymove;
	//document.title = objMouseAngle();
	renderer.render(scene, camera);
	stats.update();
}