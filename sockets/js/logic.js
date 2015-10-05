var socket;
var s = "";

init();

function init() {
	document.addEventListener( 'keydown', onKeyDown, false );
	socket = new WebSocket("ws://178.62.231.240:8000/echo");
	socket.onopen = function() {	document.getElementById('text').value += "opened\n";	};
	socket.onclose = function() {	document.getElementById('text').value += "closed\n";	};
	socket.onmessage = socketMessage; //function() {  document.getElementById('text').value += evt.data + '\n';   };
    document.getElementById('text').value += "qwerty\n"
}

function socketMessage(evt) {
document.getElementById('text').value += evt.data + '\n';  
    var message = evt.data;
    if (message[0] == '#'){
        var xy = message.split('#')
        var xx = parseInt(xy[1])
        var yy = parseInt(xy[2])
    }
}

function onKeyDown(event) {
	var k = event.keyCode
	if (k == 32) // SPACE
	{
		socket.send("*ffff0000");
	}
}
