"use strict";

module.exports = exports = Car;

function Car(position, state, speed) {
	this.x = position.x;
	this.y = position.y;
	this.state = state;
	this.speed = speed;
	this.width = 60;
	this.height = 104;
	this.spritesheetUp = new Image();
	this.spritesheetUp.src = encodeURI('assets/car_up.png');
	this.spritesheetDown = new Image();
	this.spritesheetDown.src = encodeURI('assets/car_down.png');
}

Car.prototype.update = function(elapsedTime) {
	switch(this.state) {
		case "up":
			this.y -= 1 * this.speed;
			if(this.y <= -104) {
				this.y = 480;
			}
			break;
		case "down":
			this.y += 1 * this.speed;
			if(this.y >= 480) {
				this.y = -104;
			}
			break;
	}
}

Car.prototype.render = function(time, ctx) {
	switch(this.state) {
		case "up":
			ctx.drawImage(
				// image
				this.spritesheetUp,
				// source rectangle
				0, 0, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case "down":
			ctx.drawImage(
				// image
				this.spritesheetDown,
				// source rectangle
				0, 0, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
	}
}