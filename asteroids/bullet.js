(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, shipVel) {
    var speed = Math.sqrt(Math.pow(shipVel[0],2) + Math.pow(shipVel[1],2));
    this.radius = 1;
    if (speed != 0) {
      var vel = [];
      vel[0] =  Bullet.VELOCITY * (shipVel[0] / speed);
      vel[1] =  Bullet.VELOCITY * (shipVel[1] / speed);
      return Asteroids.MovingObject.call(this, [pos[0],pos[1]], vel, 1);
    }
  }

  Bullet.VELOCITY = 10;

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.draw = function(ctx) {
    //ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      1.5,
      0,
      Math.PI * 2,
      false
    );

    // ctx.lineWidth = 1;
    // ctx.strokeStyle="white";

    // ctx.stroke();


    ctx.fillStyle = "rgb(135,206,250)";
    // ctx.fillStyle = "rgb(218,165,32)";
    ctx.fill();


   // ctx.fill();
  }

  Bullet.prototype.hitAsteroids = function(asteroids) {
    var collidedAsteroids = [];

    for(var i=0; i < asteroids.length; i++) {
      if (this.isCollidedWith(asteroids[i]) ) {
        collidedAsteroids.push(i);
      }
    }

    return collidedAsteroids;
  }

})(this)