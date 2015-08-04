var container, stats;
var camera, scene, renderer;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX = 0, mouseY = 0;

var cube, triangle;

var step = 5;
var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;

init();
render();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	// camera.position.z = 5;
	camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
	// camera.position.x = 0;
	// camera.position.y = 0;
	camera.position.set( 0, 0, 5 );

	scene = new THREE.Scene();
	// camera.lookAt( scene.position );

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// var geometry = new THREE.BoxGeometry( 30, 30, 30 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );
	// cube.position.x = 0;
	// cube.position.y = 0;
	// cube.position.z = 0;

	var geom = new THREE.Geometry();
	geom.vertices.push( new THREE.Vector3( 20, 0, 0 ) );
	geom.vertices.push( new THREE.Vector3( -20, 20, 0 ) );
	geom.vertices.push( new THREE.Vector3( -20, -20, 0 ) );
	geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geom.computeFaceNormals();
	triangle = new THREE.Mesh( geom, material );
	scene.add( triangle );
	//triangle.rotation.z += 1.57;

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onKeyDown(event) {
	var keyCode = event.keyCode;
	switch (keyCode) {
		case 68: //d
			keyD = true;
			break;
		case 83: //s
			keyS = true;
			break;
		case 65: //a
			keyA = true;
			break;
		case 87: //w
			keyW = true;
			break;
	}
}


function onKeyUp( event ) {
	var keyCode = event.keyCode;
	switch (keyCode) {
		case 68: //d
			keyD = false;
				break;
		case 83: //s
			keyS = false;
			break;
		case 65: //a
			keyA = false;
			break;
		case 87: //w
			keyW = false;
			break;
	}
}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( -event.clientY + windowHalfY );
	// mouseX = ( event.clientX );
	// mouseY = ( event.clientY );

}


function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.left = window.innerWidth / - 2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / - 2;

	// camera.aspect = window.innerWidth / window.innerHeight;
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

function render() {
	requestAnimationFrame( render );

	if ( keyW )
		triangle.position.y += step;
		// triangle.translateY( step );
	if ( keyS )		
		triangle.position.y += -step;
		// triangle.translateY( -step );
	if ( keyA )
		triangle.position.x += -step;
		// triangle.translateX( -step );
	if ( keyD )
		triangle.position.x += step;
		// triangle.translateX( step );
	triangle.rotation.z = objMouseAngle();

	// document.title = triangle.position.x + " " + triangle.position.y+ "|" + mouseX + " " + mouseY;
	//document.title = objMouseAngle();
	renderer.render(scene, camera);
	stats.update();
}