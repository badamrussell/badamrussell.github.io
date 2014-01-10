(function(root) {
  var Asteroids = root.Asteroids = ( root.Asteroids || {} );

  var Game = Asteroids.Game = function(ctx, width) {
    this.ctx = ctx;
    this.asteroids = [];
    this.ship = new Asteroids.Ship([width/2,width/2]);
    this.timer;
    this.bullets = [];
    this.debris = [];
    this.background;

    Game.DIM_X = width;
    Game.DIM_Y = width;
  }

  Game.FPS = 48;
  Game.Velocity = .5;
  Game.MaxAsteroids = 15;
  Game.Score = 0;
  Game.State = "play";
  Game.BaseVelocity = .5;
  Game.MaxVelocity = 10;


  Game.prototype.addAsteroids = function(numAsteroids) {
    for (var i=0; i < numAsteroids; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y, Game.Velocity));
    }
  }

  Game.prototype.fireBullet = function() {
    var bullet = this.ship.fire();

    if(bullet) {
      this.bullets.push(bullet);
    }
  }

  Game.prototype.updateScore = function(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: " + Game.Score, 7, 20)
  }

  Game.prototype.displayGameOver = function(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", Game.DIM_X / 2 - 60, Game.DIM_Y / 2);
  }

  Game.prototype.displayPaused = function(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", Game.DIM_X / 2 - 40, Game.DIM_Y / 2);
    ctx.fillText("PRESS 'P' TO PLAY", Game.DIM_X / 2 - 92, Game.DIM_Y / 2 + 30);
  }

  Game.prototype.draw = function() {
    this.ctx.clearRect(0,0,Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(this.background, 0, 0);

    if (Game.State == "play") {
      this.ship.draw(this.ctx);
    }

    for(var i=0; i < this.bullets.length; i++) {
      this.bullets[i].draw(this.ctx);
    }

    for(var i=0; i < this.asteroids.length; i++) {
      this.asteroids[i].draw(this.ctx);
    }

    for(var i=0; i < this.debris.length; i++) {
      this.debris[i].draw(this.ctx);
    }

    this.updateScore(this.ctx);

    if (Game.State == "over") {
      this.displayGameOver(ctx);
    }
  }

  Game.prototype.move = function() {
    if (Game.State == "play") {
      this.ship.move(key.isPressed("up"), key.isPressed("left"), key.isPressed("right"));
      this.ship.warp(Game.DIM_X,Game.DIM_Y);
    } else if (Game.State == "paused") {
      return;
    }

    for(var i = this.bullets.length-1; i >= 0; i--) {
      if( this.bullets[i].isOffScreen(Game.DIM_X, Game.DIM_Y)){
        this.bullets.splice(i, 1);
      } else {
        this.bullets[i].move();
      }
    }

    for(var i=0; i < this.asteroids.length; i++) {
      if( this.asteroids[i].isOffScreen(Game.DIM_X, Game.DIM_Y)){
        this.asteroids[i] = Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y, Game.Velocity)
      } else {
        this.asteroids[i].move();
      }
    }

    for(var i=this.debris.length-1; i >= 0; i--) {
      if(this.debris[i].expired()){
        this.debris.splice(i, 1);
      } else {
        this.debris[i].move();
      }
    }
  }

  Game.prototype.removeAsteroids = function() {
    for (var b=this.bullets.length-1; b >=0 ; b--) {
     var hitAsteroids = this.bullets[b].hitAsteroids(this.asteroids);

     if (hitAsteroids.length > 0) {
        var newAsteroids = [];

        for (var a = hitAsteroids.length-1; a >=0 ; a--) {
          var asteroidIndex = hitAsteroids[a];

          newAsteroids = newAsteroids.concat(this.asteroids[asteroidIndex].explode(Game.Velocity));
          var newDebris = this.asteroids[asteroidIndex].makeDebris();

          //this.debris.concat(newDebris);
          for (var k=0; k < newDebris.length; k++) {
            this.debris.push(newDebris[k]);
          }

          Game.Score += this.asteroids[asteroidIndex].points;
          this.asteroids.splice(asteroidIndex, 1);
        }
        this.bullets.splice(b, 1);
        this.asteroids = this.asteroids.concat(newAsteroids);
        if (this.asteroids.length < Game.MaxAsteroids) {
          this.addAsteroids(Game.MaxAsteroids - this.asteroids.length);
        }

        Game.Velocity = Game.Score / 500;
        if ( Game.Velocity < Game.BaseVelocity ) {
          Game.Velocity = Game.BaseVelocity;
        } else if (Game.Velocity > Game.MaxVelocity) {
          Game.Velocity = Game.MaxVelocity;
        }
     }
    }
  }

  Game.prototype.step = function() {
    if (Game.State == "paused") {
      return false;
    }

    if (Game.State == "play") {
      var asteroidIndex = this.checkCollisions();

      if (asteroidIndex != false){
        var shipDebris = this.ship.explode();

        var newAsteroids = this.asteroids[asteroidIndex].explode(Game.Velocity);
        var newDebris = this.asteroids[asteroidIndex].makeDebris();
        this.asteroids.splice(asteroidIndex, 1);
        this.asteroids = this.asteroids.concat(newAsteroids);


        this.debris = this.debris.concat(newDebris);
        this.debris = this.debris.concat(shipDebris);
        Game.State = "over";
      } else {

      }
    }
    this.move();
    this.removeAsteroids()
    this.draw();

    if (Game.State == "start") {
      this.togglePause(ctx);
    }
  }

  Game.prototype.togglePause = function() {
    if (Game.State == "play" || Game.State == "start") {
      Game.State = "paused";
      window.clearInterval(this.timer);
      this.displayPaused(ctx);
      this.timer = null;
    } else if (Game.State == "paused") {
      Game.State = "play";
      var performStep = this.step.bind(this);
      this.timer = window.setInterval( performStep , Game.FPS );
    }
  }

  Game.prototype.bindKeyHandlers = function(keyValue, keyAction) {
    if (this.keysBound) { return false; }
    var that = this;
    var b_toggle = this.togglePause.bind(this);
    key('up', function(){ return false; });
    key('right', function(){ return false; });
    key('left', function(){ return false; });
    key('space', function(){ if (Game.State == "play") {that.fireBullet(); return false; } });
    key('p', b_toggle );
    this.keysBound = true;
    //key('g', function(){ console.log("PRESSED G"); });
  }

  Game.prototype.start = function() {
    this.bindKeyHandlers();

    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = 'asteroids/img/background.png';
    this.background = img;


    this.addAsteroids(Game.MaxAsteroids);
    var performStep = this.step.bind(this);

    this.timer = window.setInterval( performStep , Game.FPS );
    Game.State = "start";
  }

  Game.prototype.checkCollisions = function() {
    for(var i = 0; i < this.asteroids.length; i++){
      if (this.ship.isCollidedWith(this.asteroids[i])){
        return i;
      }
    }
    return false;
  }

  Game.prototype.stop = function() {
    clearInterval(this.timer);
  }

  Game.prototype.restart = function() {
    clearInterval(this.timer);

    this.asteroids = [];
    this.ship = new Asteroids.Ship([Game.DIM_X/2,Game.DIM_Y/2]);
    this.bullets = [];
    this.debris = [];
    this.background;
    Game.Velocity = .5;
    Game.MaxAsteroids = 15;
    Game.Score = 0;

    this.start();
  }


})(this)