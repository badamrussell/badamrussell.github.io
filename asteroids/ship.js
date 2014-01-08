(function(root) {
  var Asteroids = root.Asteroids = ( root.Asteroids || {} );


  var randomRange = function(min, max) {
    var randIndex = Math.floor(Math.random() * Math.abs(max - min));

    return min + randIndex;
  }

  var randomVelocity = function(initialVelocity) {
    return [  ((Math.random()* 2) - 1) * initialVelocity,
              ((Math.random()* 2) - 1) * initialVelocity
            ];
  }


  var Ship = Asteroids.Ship = function(pos) {
    this.rotation = 0;
    this.lengths = [10,20,10];
    this.radius = 10;
    this.angles = [Math.PI * 0.75, 0 ,Math.PI * 1.25];
    Asteroids.MovingObject.call(this, pos, [0,0], Ship.RADIUS)

  }

  Ship.inherits(Asteroids.MovingObject);

  Ship.RADIUS = 10;
  Ship.COLOR = "blue";
  Ship.MAX_SPEED = 6;

  Ship.prototype.power = function() {
    var new_x = Ship.MAX_SPEED * Math.cos(this.rotation);
    var new_y = Ship.MAX_SPEED * Math.sin(this.rotation);

    if( new_x <= Ship.MAX_SPEED && new_x >= -Ship.MAX_SPEED){
      this.vel[0] = new_x;
    }
    if( new_y <= Ship.MAX_SPEED && new_y >= -Ship.MAX_SPEED){
      this.vel[1] = new_y;
    }
  }

  Ship.prototype.velocity = function() {
    return Math.sqrt(Math.pow(this.vel[0],2) + Math.pow(this.vel[1],2));
  }

  Ship.prototype.rotateVelocity = function() {
    var normVel = this.velocity();
    this.vel[0] = normVel * Math.cos(this.rotation);
    this.vel[1] = normVel * Math.sin(this.rotation);
  } 

  Ship.prototype.rotate = function(rotInc) {
    this.rotation += rotInc;
  }

  Ship.prototype.move = function(accelerate, left, right) {
    if (accelerate) {
      this.power();
    } else {
      if (Math.abs(this.vel[0]) > 0.5) {
        if (this.vel[0] > 0) {
          this.vel[0] -= 0.3;
        } else {
          this.vel[0] += 0.3;
        }
      } else {
        this.vel[0] = 0;
      }

      if (Math.abs(this.vel[1]) > 0.5) {
        if (this.vel[1] > 0) {
          this.vel[1] -= 0.3;
        } else {
          this.vel[1] += 0.3;
        }
      } else {
        this.vel[1] = 0;
      }
    }

    if (left) {
      this.rotate(-0.1);
      this.rotateVelocity();
    }

    if (right) {
      this.rotate(0.1);
      this.rotateVelocity();
    }

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }

  Ship.prototype.fire = function() {
    var vel = [Math.cos(this.rotation) + this.vel[0], Math.sin(this.rotation) + this.vel[1]];
    var pos = [ this.pos[0] + (this.lengths[1] * Math.cos(this.rotation)),
                this.pos[1] + (this.lengths[1] * Math.sin(this.rotation))];
    return new Asteroids.Bullet(pos, vel)
  }

  Ship.prototype.drawThruster = function(ctx, shipPoints) {
    var thrustHeight = this.velocity() * 3;
    if (thrustHeight < 3) {

      return;
    }

    thrustHeight += (Math.random() * 2);

    ctx.beginPath();
    ctx.lineTo(shipPoints[shipPoints.length-1][0], shipPoints[shipPoints.length-1][1]);
    
    
    var x = thrustHeight * Math.cos(this.rotation + Math.PI) + this.pos[0];
    var y = thrustHeight * Math.sin(this.rotation + Math.PI) + this.pos[1];

    ctx.lineTo(x, y);
    ctx.lineTo(shipPoints[0][0], shipPoints[0][1]);

    
    ctx.lineWidth = 1;
    ctx.strokeStyle="lightblue";
    

    ctx.stroke();
    ctx.closePath();

  }

  Ship.prototype.drawOnce = function(ctx, color, lineWidth) {

  }

  Ship.prototype.draw = function(ctx) {
    var newPoints = [];

    for (var i=0; i < this.lengths.length; i++) {
      var x = this.lengths[i] * Math.cos(this.rotation + this.angles[i]) + this.pos[0];
      var y = this.lengths[i] * Math.sin(this.rotation + this.angles[i]) + this.pos[1];

      newPoints.push([x,y])
    }

    ctx.beginPath();
    ctx.moveTo(newPoints[0][0], newPoints[0][1]);
    for (var i=1; i < newPoints.length; i++) {
      ctx.lineTo(newPoints[i][0], newPoints[i][1]);
    }
    var c_x = newPoints[0][0] - (newPoints[0][0] - newPoints[newPoints.length-1][0])/2;
    var c_y = newPoints[0][1] - (newPoints[0][1] - newPoints[newPoints.length-1][1])/2;
    
    //ctx.arc(c_x, c_y, 10, Math.PI/2, 3*Math.PI/2, true);
    ctx.lineTo(newPoints[0][0], newPoints[0][1]);

    

    ctx.lineWidth = 2;
    ctx.strokeStyle="lightblue";

    ctx.stroke();
    ctx.closePath();

    //--------------------------
    ctx.beginPath();
    ctx.moveTo(newPoints[0][0], newPoints[0][1]);
    for (var i=1; i < newPoints.length; i++) {
      ctx.lineTo(newPoints[i][0], newPoints[i][1]);
    }
    
    ctx.lineTo(newPoints[0][0], newPoints[0][1]);
    ctx.lineWidth = .5;
    ctx.strokeStyle="white";
    ctx.stroke();
    ctx.closePath();

    this.drawThruster(ctx, newPoints);
  }

  Ship.prototype.warp = function(dimX, dimY) {
    var x = this.pos[0];
    var y = this.pos[1];

    if (x <= 0 || x >= dimX) {
      this.pos[0] = dimX - x;
    }
    if (y <= 0 || y >= dimY) {
      this.pos[1] = dimY - y;
    }
  }

  Ship.prototype.jump = function() {

  }

  Ship.prototype.explode = function() {
    var debris = [];
    

    debris.push(new Asteroids.Debris(this.pos, [randomVelocity(1), randomVelocity(1)], 2, this.lengths[0], "173,216,230"));
    debris.push(new Asteroids.Debris(this.pos, [randomVelocity(1), randomVelocity(1)], 2, this.lengths[1], "173,216,230"));
    debris.push(new Asteroids.Debris(this.pos, [randomVelocity(1), randomVelocity(1)], 2, this.lengths[2], "173,216,230"));

    return debris;
  }



  var randomVector = function(dimX, dimY, maxVelocity) {
    var rand = Math.floor(Math.random() * 4) + 1;

    switch(rand) {
    case 1:
      var velocity = [Math.abs(randomVelocity(maxVelocity)), randomVelocity(maxVelocity)];
      return [[0, Math.random() * dimY], velocity ];
    case 2:
      var velocity = [-Math.abs(randomVelocity(maxVelocity)), randomVelocity(maxVelocity), ];
      return [[dimX, Math.random() * dimY], velocity ];
    case 3:
      var velocity = [randomVelocity(maxVelocity), Math.abs(randomVelocity(maxVelocity))];
      return [[Math.random() * dimX, 0], velocity ];
    case 4:
      var velocity = [randomVelocity(maxVelocity), -Math.abs(randomVelocity(maxVelocity))];
      return [[Math.random() * dimX, dimY], velocity ];
    }
  }


})(this)