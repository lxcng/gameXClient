var socket, socket_control, socket_update;

var renderer;
var stage;
var body_map = new Map();

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var centerX = windowWidth / 2;
var centerY = windowHeight / 2;

var keyW = false;
var keyS = false;
var keyA = false;
var keyD = false;
var angle = 0.0;
var controls_update = false;

var player;

var state = 0;

var id;

var qwerty;

initNetwork();
init();
animate();

function initNetwork() {
    socket = new WebSocket("ws://178.62.231.240:8000/sock");
    socket.onopen = function() {
        document.title += '+c';
        id = Date.now();
        socket.send("#" + id)
    };
    socket.onclose = function() { document.title += '-c'; };    
    socket.onmessage = socketUpdate;

    // var socket1 = new WebSocket("ws://178.62.231.240:8000/connect");
    // socket1.onopen = function() {
    //     document.title += '+!';
    // };
    // socket1.onclose = function() { document.title += '-!'; };    
    // socket1.onmessage = function(evt) {
    //     var mess = evt.data;
    //     document.title = mess;
    // };

}

function Body(id, x, y, a) {
    this.id = id;    
    var texture = PIXI.Texture.fromImage("__assets/__sprites/gun.png");
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.scale.x = 0.2;
    this.sprite.scale.y = 0.2;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.rotation = a;
    this.update = function(x, y, a) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = -a;        
    }
    this.delete = function() {
        stage.removeChild(this.sprite);

    }
    stage.addChild(this.sprite);
}

function socketUpdate(evt) {
    var message = evt.data;
    if (message[0] == '^') {
        var args = message.split('^');
            // qwerty = evt.data;
        var ids = new Set();
        for (var i = 1; i < args.length; i += 4) {
            var body = body_map.get(args[i]);
            ids.add(args[i]);
            var x = parseFloat(args[i + 1]);
            var y = parseFloat(args[i + 2]);
            var a = parseFloat(args[i + 3]);
            if (args[i] == id){
                stage.position.x = centerX - x;
                stage.position.y = centerY - y;
            }
            if (body){
                body.update(x, y, a);
            } else {
                body = new Body(args[i], x, y, a);
                body_map.set(args[i], body);
            }
        }
        for (var k of body_map.keys()){
            if (!ids.has(k)){
                var body = body_map.get(k);
                body_map.delete(k);
                body.delete();                
            }
        }
    }
    // else {

    // }
    return 0;
}

function socketControl() {
    var m = "*" + id + "*";
    m += keyW ? "t" :"f";
    m += keyS ? "t" :"f";
    m += keyA ? "t" :"f";
    m += keyD ? "t" :"f";
    m += String(angle * 1000).slice(0, 4);
    socket.send(m);
    return m;
}

function init() {
    stage = new PIXI.Container();
    renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, { transparent: true });
    document.body.appendChild(renderer.view);

    var ground = PIXI.Texture.fromImage("__assets/__sprites/floor.jpg");
    var g = new PIXI.Sprite(ground);

    stage.addChild(g);
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    window.onbeforeunload = function (evt) {
        socket.send('~' + id);
        // socket.onclose
        socket.close();
        return message;
    }

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}


function onDocumentMouseMove( event ) {
    var x = event.clientX - centerX;
    var y = centerY - event.clientY;
    var l = Math.sqrt( x * x + y * y);
    var alp = Math.acos( x / l );
    alp = y > 0 ? alp : 2 * Math.PI - alp;
    angle = alp;
    // document.title = x + " " + y + " " + alp;
    socketControl();
    return alp
}

function onKeyDown(event){
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: //w
            // controls_update = keyW;
            keyW = true;
            break;
        case 83: //s
            // controls_update = keyS;
            keyS = true;
            break;
        case 65: //a
            // controls_update = keyA;
            keyA = true;
            break;
        case 68: //d
            // controls_update = keyD;
            keyD = true;
            break;
    }
    // if (controls_update) {document.title += '/';
    //     socketControl();
    //     controls_update = false;
    // }
} 

function onKeyUp(event){
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: //w
            // controls_update = keyW;
            keyW = false;
            break;
        case 83: //s
            // controls_update = keyS;
            keyS = false;
            break;
        case 65: //a
            // controls_update = keyA;
            keyA = false;
            break;
        case 68: //d
            // controls_update = keyD;
            keyD = false;
            break;
    }
    // if (controls_update) {document.title += '/';
    //     socketControl();
    //     controls_update = false;
    // }
}

function animate() {
    requestAnimationFrame( animate );
    socketControl();
    renderer.render(stage);
}