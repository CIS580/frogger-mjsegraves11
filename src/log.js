"use strict";

module.exports = exports = Log;

function Log(position, speed) {
	this.x = position.x;
	this.y = position.y;
	this.speed = speed;
}

Log.prototype.update = function(elapsedTime) {
	this.y -= 1 * this.speed;
	if(this.y <= -200) {
		this.y = 480;
	}
}

Log.prototype.render = function(time, ctx) {
	ctx.fillStyle = "Brown";
	ctx.fillRect(this.x, this.y, 40, 200)
}