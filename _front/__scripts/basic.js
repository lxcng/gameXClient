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
var click = false;
var controls_update = false;

var player;

var state = 0;

var id;

var qwerty;

initNetwork();
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );
    window.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'click', onClick, false);
init();
animate();

function initNetwork() {
    socket = new WebSocket("ws://178.62.231.240:8000/sock");
    socket.onopen = function() {
        document.title += '+c';
        id = Date.now();
        socket.send("#" + id)
        // animate();
    };
    socket.onclose = function() { document.title += '-c'; };    
    socket.onmessage = socketUpdate;
}

function Body(id, x, y, a) {
    this.id = id;    
    var texture = PIXI.Texture.fromImage("__assets/__sprites/gun1.png");
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
        this.sprite.rotation = a;        
    }
    this.delete = function() {
        stage.removeChild(this.sprite);
    }
    stage.addChild(this.sprite);
}

function Bullet(id, x, y, a) {
    this.id = id;    
    var texture = PIXI.Texture.fromImage("__assets/__sprites/noj.png");
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.scale.x = 0.2;
    this.sprite.scale.y = 0.2;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.rotation = a - Math.PI / 2;
    this.update = function(x, y, a) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = a + Math.PI / 2;       
    }
    this.delete = function() {
        stage.removeChild(this.sprite);
    }
    stage.addChild(this.sprite);
}

function Door(id, x, y, a, w, h) {
    this.id = id;    
    var texture = PIXI.Texture.fromImage("__assets/__sprites/door_wood.png");
    this.sprite = new PIXI.TilingSprite(texture, w, h);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    // this.sprite.scale.x = 0.2;
    // this.sprite.scale.y = 0.2;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    // this.sprite.rotation = a - Math.PI / 2;
    this.update = function(x, y, a) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = a;      
    }
    this.delete = function() {
        stage.removeChild(this.sprite);
    }
    stage.addChild(this.sprite);
}

function Wall(id, x, y, a, w, h) {
    this.id = id;    
    var texture = PIXI.Texture.fromImage("__assets/__sprites/brick_wall.png");
    this.sprite = new PIXI.TilingSprite(texture, w, h);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    // this.sprite.scale.x = 0.2;
    // this.sprite.scale.y = 0.2;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    // this.sprite.rotation = a - Math.PI / 2;
    this.update = function(x, y, a) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = a + Math.PI / 2;      
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
        for (var i = 1; i < args.length; i += 5) {
            var body = body_map.get(args[i]);
            ids.add(args[i]);
            var typ = args[i + 1];
            var x = parseFloat(args[i + 2]);
            var y = parseFloat(args[i + 3]);
            // var a = toRadians(parseInt(args[i + 4]));
            var a = parseFloat(args[i + 4]);
            if (args[i] == id){
                stage.position.x = centerX - x;
                stage.position.y = centerY - y;
            }
            if (body){
                body.update(x, y, a);
            } else {
                // if (args[i].substring(0, 6) == "bullet") {
                //     bullet = new Bullet(args[i], x, y, a);
                //     body_map.set(args[i], bullet);
                // } else {
                switch(typ){
                    case '0':
                        body = new Body(args[i], x, y, a);
                        body_map.set(args[i], body);
                        break;
                    case '2':
                        body = new Bullet(args[i], x, y, a);
                        body_map.set(args[i], body);
                        break;
                    case '3':
                        body = new Door(args[i], x, y, a, 10, 90);
                        body_map.set(args[i], body);
                        break;
                }
                    
                // }
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
    m += click ? "t" : "f";
    // m += String(parseInt(toDegrees(angle)));
    m += String(angle);
    if (click)
        click = false;
    socket.send(m);
    return m;
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function init() {
    stage = new PIXI.Container();
    renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, { transparent: true });
    document.body.appendChild(renderer.view);

    var ground = PIXI.Texture.fromImage("__assets/__sprites/floor.jpg");
    var g = new PIXI.Sprite(ground);
    g.position.x = -256;
    g.position.y = -256;

    stage.addChild(g);
    // document.addEventListener( 'keydown', onKeyDown, false );
    // document.addEventListener( 'keyup', onKeyUp, false );
    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'click', onClick, false);

    window.onbeforeunload = function (evt) {
        socket.send('~' + id);
        // socket.onclose
        socket.close();
        return message;
    }

    // var bull = new Bullet('123', 0, 0, 0);
    // body_map.set('123', bull);

    // var graphics = new PIXI.Graphics();
    // graphics.beginFill(0xFFFF00);
    // graphics.lineStyle(5, 0xFF0000);
    // graphics.drawRect(0, 0, 300, 200);
    // stage.addChild(graphics);
    // graphics.drawRect(100, 0, 100, 100);

    var texture = PIXI.Texture.fromImage("__assets/__sprites/brick_wall.png");
    wall = new Wall("wall1", -281, 0, 0.0, 50, 612)
    wall = new Wall("wall1", 0, -281, 0.0, 512, 50)
    wall = new Wall("wall1", 0, 281, 0.0, 512, 50)
    wall = new Wall("wall1",  281, 178, 0.0, 50, 256)
    wall = new Wall("wall1",  281, -178, 0.0, 50, 256)
    // var tilingSprite = new PIXI.TilingSprite(texture, 50, 612);
    // tilingSprite.position.x = -306;
    // tilingSprite.position.y = -306;
    // stage.addChild(tilingSprite);

    // tilingSprite = new PIXI.TilingSprite(texture, 50, 612);
    // tilingSprite.position.x = 256;
    // tilingSprite.position.y = -306;
    // stage.addChild(tilingSprite);

    // tilingSprite = new PIXI.TilingSprite(texture, 512, 50);
    // tilingSprite.position.x = -256;
    // tilingSprite.position.y = -306;
    // stage.addChild(tilingSprite);

    // tilingSprite = new PIXI.TilingSprite(texture, 512, 50);
    // tilingSprite.position.x = -256;
    // tilingSprite.position.y = 256;
    // stage.addChild(tilingSprite);
}


function onDocumentMouseMove( event ) {
    var x = event.clientX - centerX;
    var y = centerY - event.clientY;
    var l = Math.sqrt( x * x + y * y);
    var alp = Math.acos( x / l );
    alp = y > 0 ? alp : 2 * Math.PI - alp;
    angle = alp;
    // document.title = x + " " + y + " " + alp;
    // socketControl();
    return alp
}

function onClick( event ){
    click = true;
    // document.title += ' pew';
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