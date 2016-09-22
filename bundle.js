(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var level = 1;
var score = 0;
var speed = 1;
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var firstCars = [];
//var secondCars = [];
//var thirdCars = [];
//var fourthCars = [];

for(var i=0; i<1; i++) {
  var car = new Car({x: 180, y: -104}, "down", speed);
  firstCars.push(car);
}
for(var i=0; i<2; i++) {
  var car = new Car({x: 240, y: 480 - (i * 240)}, "up", speed);
  firstCars.push(car);
}
for(var i=0; i<2; i++) {
  var car = new Car({x: 420, y: -104 + (i*292)}, "down", speed);
  firstCars.push(car);
}
for(var i=0; i<3; i++) {
  var car = new Car({x: 480, y: 480 - (i * 170)}, "up", speed);
  firstCars.push(car);
}

var log1 = new Log({x: 70, y: 480}, speed);
var log2 = new Log({x: 610, y: 480}, 1.5 * speed);


/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  //frog
  player.update(elapsedTime, {x: log1.x, y: log1.y, speed: log1.speed}, {x: log2.x, y: log2.y, speed: log2.speed});
  firstCars.forEach(function(car) {
    player.collide({x: car.x, y: car.y});
  });
  if(!player.alive) {
    player.x = 0;
    player.lives--;
    if(player.lives == 0) {
      player.x = 0;
      player.lives = 3;
      score = 0;
      log1.speed -= 0.5 * (level-1);
      log2.speed -= 0.5 * (level-1);
      firstCars.forEach(function(car) {
        car.speed -= 0.5 * (level-1);
      });
      level = 1;
    }
    player.alive = true;
  }
  if(player.completedLevel) {
    score += 100 * level;
    level += 1;
    log1.speed += 0.5;
    log2.speed += 0.5;
    firstCars.forEach(function(car) {
      car.speed += 0.5;
    });
    player.x = 0;
    player.completedLevel = false;

  }
  //obsticles
  firstCars.forEach(function(car) {
    car.update(elapsedTime);
  });

  //logs
  log1.update(elapsedTime);
  log2.update(elapsedTime);
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //background
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(60, 0, 60, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(180, 0, 120, canvas.height);
  ctx.fillRect(420, 0, 120, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(600, 0, 60, canvas.height);

  //logs
  log1.render(elapsedTime, ctx);
  log2.render(elapsedTime, ctx);

  //frog
  player.render(elapsedTime, ctx);

  //obsticles
  firstCars.forEach(function(car) {
    car.render(elapsedTime, ctx);
  });

  ctx.fillStyle = "black";
  ctx.font = "15px Arial";
  ctx.fillText("Level " + level, 5, 30);
  ctx.fillText("Score: " + score, 665, 30);
  ctx.fillText("Lives:" + player.lives, 5, 465);
}

window.onkeydown = function(event) {
  event.preventDefault();
  if(!player.moving) {
    switch(event.keyCode){
      case 38:
        player.frame = 0;
        player.state = "up";
        break;
      case 39:
        player.frame = 0;
        player.state = "jump";
        break;
      case 40:
        player.frame = 0;
        player.state = "down";
        break;
    }
  }
}


},{"./car.js":2,"./game.js":3,"./log.js":4,"./player.js":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/12;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.moving = false;
  this.x = position.x;
  this.y = position.y;
  this.width  = 60;
  this.height = 60;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite1.png');
  this.timer = 0;
  this.frame = 0;
  this.alive = true;
  this.completedLevel = false;
  this.lives = 3;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time,log1,log2) {
  if(this.x >=660) {
    this.completedLevel = true;
  }
  if(this.x >= log1.x-20 && this.x+this.width < log1.x+60) {
    if(this.y > log1.y && this.y+this.height < log1.y+200) {
      this.y -= log1.speed;
    }
    else {
      this.alive = false;
    }
  }
  if(this.x >= log2.x-20 && this.x+this.width < log2.x+60) {
    if(this.y > log2.y && this.y+this.height < log2.y+200) {
      this.y -= log2.speed;
    }
    else {
      this.alive = false;
    }
  }
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > 1000/4) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    // TODO: Implement your player's update by state
    case "jump":
      this.moving = true;
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        this.x += 15;
        if(this.frame > 3) {
          this.frame = 0;
          this.state = "idle";
          this.moving = false;
        }
      }
      break;
    case "up":
      this.moving = true;
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        this.y -= 4;
        if(this.frame > 3) {
          this.frame = 0;
          this.state = "idle";
          this.moving = false;
        }
      }
      break;
    case "down":
      this.moving = true;
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        this.y += 4;
        if(this.frame > 3) { 
          this.frame = 0;
          this.state = "idle";
          this.moving = false;
        }
      }
      break;
  }
}

Player.prototype.collide = function(car) {
  /*if(this.x >= car.x-5 && this.x + this.width <= car.x+65) {
    if(this.y >= car.y && this.y + this.height <= car.y+104) {
      this.alive = false;
    }
  }*/
  var collides = !(this.x + this.width-1 < car.x ||
                   this.x+1 > car.x + 60 ||
                   this.y + this.height-1 < car.y ||
                   this.y+1 > car.y + 104);
  if(collides) {
    this.state = "idle"
    this.moving = false;
    this.alive = false;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "jump":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "up":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "down":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
  }
}














},{}]},{},[1]);
