#pragma strict

var Target : Transform;
var Distance  = -10;
//var lift = 1.5;

function Update () {
	GetComponent.<Transform>().position = Target.position + Vector3(0, 0, Distance);
	//GetComponent.<Transform>().LookAt(Target);
}