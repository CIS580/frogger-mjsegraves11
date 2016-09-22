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

