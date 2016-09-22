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













