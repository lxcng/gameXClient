#pragma strict

//var speed = 0.3;
//var force = 10;
var MaxSpeed  = 1;
//private var prevh = 0;
//private var prevv = 0;
//GetComponent.<Rigidbody2D>().drag = 10;


function Update () {
	var h = Input.GetAxis("Horizontal");
	var v = Input.GetAxis("Vertical");	
	var vel = Vector2(h , v);
	if (vel.magnitude <= 1)
		GetComponent.<Rigidbody2D>().velocity = vel * MaxSpeed;
	else
		GetComponent.<Rigidbody2D>().velocity = vel.normalized * MaxSpeed;
	ToMouseAngle();
}

function ToMouseAngle(){
	var mouseposition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	//var mp = Vector2(mouseposition.x, mouseposition.y);
	var o = GetComponent.<Rigidbody2D>().position;
	var p = Vector2(mouseposition.x - o.x, mouseposition.y - o.y);
	var angle = Vector2.Angle(Vector2.right, p);
	
	GetComponent.<Rigidbody2D>().rotation = angle * Mathf.Sign(p.y);
	//var dx = m.x - o.x;
	//var dy = m.y - o.y;
	//Debug.Log(mp + " " + o + " " + angle);

}