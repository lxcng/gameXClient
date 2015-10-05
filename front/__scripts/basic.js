var socket;

var gun;
var renderer;
var stage;
var xmove = 0;
var ymove = 0;
var speed = -10;
var sq2 = Math.sqrt( 2 );
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var centerX = windowWidth / 2;
var centerY = windowHeight / 2;

initNetwork();
init();
animate();

function initNetwork() {
    socket = new WebSocket("ws://178.62.231.240:8000/echo");
    socket.onopen = function() {
        document.title = '+';
        // socket.send("~");
    };
    socket.onclose = function() {
        document.title = '-';


    };    
    socket.onmessage = socketMessage;
}

function socketMessage(evt) {
    var message = evt.data;
    if (message[0] == '#'){
        var xy = message.split('#');
        var xx = parseInt(xy[1]);
        var yy = parseInt(xy[2]);
        var aa = parseFloat(xy[3]) / 1000;
        // gun.rotarion = aa;
        gun.move(xx, yy, aa);
    }
}

function init() {
    stage = new PIXI.Container();

    renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, { transparent: true });
    document.body.appendChild(renderer.view);
    var texture = PIXI.Texture.fromImage("__assets/__sprites/gun.png");
    gun = new PIXI.Sprite(texture);
    gun.anchor.x = 0.5;
    gun.anchor.y = 0.5;
    gun.position.x = 250;
    gun.position.y = 250;
    stage.position.x = centerX - 250;
    stage.position.y = centerY - 250;
    gun.interactive = true;
    gun.scale.x = 0.2;
    gun.scale.y = 0.2;
    gun.vx = 0;
    gun.vy = 0;
    gun.keyW = false;
    gun.keyS = false;
    gun.keyA = false;
    gun.keyD = false;
    gun.mouseX;
    gun.mouseY;
    gun.objMouseAngle = function() {
        var x = this.mouseX;
        var y = this.mouseY;
        var l = Math.sqrt( x * x + y * y);
        var alp = Math.asin( y / l );
        alp = x > 0 ? alp : Math.PI - alp;
        return alp;
    }
    gun.step = function(){
        xmove = this.keyA * 1 + this.keyD * -1;
        ymove = this.keyW * 1 + this.keyS * -1;
        var dx = speed * xmove / ( ymove == 0 ? 1 : sq2);
        var dy = speed * ymove / ( xmove == 0 ? 1 : sq2 );
        this.position.x += dx;
        this.position.y += dy;
        this.parent.position.x -= dx;
        this.parent.position.y -= dy;
    }
    gun.move = function(xx ,yy, aa){
        this.position.x = xx;
        this.position.y = yy;
        this.parent.position.x = centerX - xx;
        this.parent.position.y = centerY - yy;
        this.rotation = aa;
    }
    gun.sendControl = function(){
        var m = "*";
        m += this.keyW ? "t" :"f";
        m += this.keyS ? "t" :"f";
        m += this.keyA ? "t" :"f";
        m += this.keyD ? "t" :"f";
        m += String(this.objMouseAngle() * 1000).slice(0, 4);
        return m;
    }
    gun.on("mousedown", onDown)
    .on("mousemove", onMove);
    bindwasd(gun);

    var ground = PIXI.Texture.fromImage("__assets/__sprites/floor.jpg");
    var g = new PIXI.Sprite(ground);
    g.position.x = -100;
    stage.addChild(g);
    stage.addChild(gun);
}

function onDown (eventData) {
    // gun.scale.x += 0.3;
    // gun.scale.y += 0.3;
}

function bindwasd(object) {
    document.addEventListener( 'keydown', function(event){
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 87: //w
                object.keyW = true;
                break;
            case 83: //s
                object.keyS = true;
                break;
            case 65: //a
                object.keyA = true;
                break;
            case 68: //d
                object.keyD = true;
                break;
        }
        xmove = object.keyA * -1 + object.keyD * 1;
        ymove = object.keyS * -1 + object.keyW * 1;}, false );
    document.addEventListener( 'keyup', function(event){
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 87: //w
                object.keyW = false;
                break;
            case 83: //s
                object.keyS = false;
                break;
            case 65: //a
                object.keyA = false;
                break;
            case 68: //d
                object.keyD = false;
                break;
        }
        xmove = object.keyA * -1 + object.keyD * 1;
        ymove = object.keyS * -1 + object.keyW * 1;}, false );
}

function onMove(eventData)
{
    var newPosition = eventData.data.getLocalPosition(this.parent);
    // this.position.x += this.vx;// newPosition.x;
    // this.position.y += this.vy; //newPosition.y;
    this.mouseX = newPosition.x - this.position.x;
    this.mouseY = newPosition.y - this.position.y;
}

function animate() {
    requestAnimationFrame( animate );
    //gun.move();
    socket.send(gun.sendControl());

    // gun.position.x +=0.5;// newPosition.x;
    //gun.position.y += gun.vy; //newPosition.y;
    //document.title = gun.position.x + " " + gun.position.y;
    //gun.rotation = gun.objMouseAngle();
    renderer.render(stage);
}