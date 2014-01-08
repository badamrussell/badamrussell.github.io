(function(root) {
  var Asteroids = root.Asteroids = ( root.Asteroids || {} );

  

  var randomRadius = function(size) { 
    var radius;
    if (size == 1) {
      radius = randomRange(5,9);
    } else if (size == 2) {
      radius = randomRange(18,26);
    } else {
      radius = randomRange(40, 56);
    }
    // 5 - small
    // 20 - medium
    // 40 - large
    return radius;//5 + Math.floor(Math.random() * 40);
  }

  var assignPoints = function(size) {
    if (size == 1) {
      return 100;
    } else if (size == 2) {
      return 50;
    } else {
      return 20;
    }
  }
  var randomRange = function(min, max) {
    var randIndex = Math.floor(Math.random() * (Math.abs(max - min)+1));
    return min + randIndex;
  }

  var Asteroid = Asteroids.Asteroid = function(pos, vel, size) {
    this.size = size || randomRange(1,3);
    this.radius = randomRadius(this.size);
    this.shape = randomShape(this.radius, pos);
    this.points = assignPoints(this.size);
    Asteroids.MovingObject.call(this, pos, vel, this.radius);
  }

  Asteroid.inherits(Asteroids.MovingObject)


  Asteroid.randomAsteroid = function(dimX, dimY, velocity) {

    var startVector = randomVector(dimX, dimY, randomRange(2,5) + velocity);
    var startPosition = startVector[0];
    var startVelocity = startVector[1];

    //console.log("RANDOM Start: ",startPosition[0],startPosition[1], startVelocity[0],startVelocity[1]);
    return new Asteroid(
      startPosition,
      startVelocity
    )
  }


  var randomVelocity = function(maxVelocity) {
    return ((Math.random() * 2) - 1) * maxVelocity;
  }

  var randomVector = function(dimX, dimY, maxVelocity) {
    var rand = Math.floor(Math.random() * 4) + 1;

    switch(rand) {
    case 1:
      var velocity = [Math.abs(randomVelocity(maxVelocity)), randomVelocity(maxVelocity)];
      return [[-50, Math.random() * dimY], velocity ];
    case 2:
      var velocity = [-Math.abs(randomVelocity(maxVelocity)), randomVelocity(maxVelocity), ];
      return [[dimX+50, Math.random() * dimY], velocity ];
    case 3:
      var velocity = [randomVelocity(maxVelocity), Math.abs(randomVelocity(maxVelocity))];
      return [[Math.random() * dimX, -50], velocity ];
    case 4:
      var velocity = [randomVelocity(maxVelocity), -Math.abs(randomVelocity(maxVelocity))];
      return [[Math.random() * dimX, dimY+50], velocity ];
    }
  }

  var randomShape = function(radius, basePoint) {
    var numPoints = 8;
    var angle = 0;
    var randAdjust = 1 + randomRange(0,3);
    var angleInc = (2*Math.PI) / numPoints;
    var points = []
    var x;
    var y;

    for (var i = 0; i < numPoints; i++) {
      x = Math.floor(radius * Math.cos(angle));
      y = Math.floor(radius * Math.sin(angle));

      points.push([x,y]);

      if (points.length % 3 == 1 && randAdjust > 0) {
        x = Math.floor(randomRange(8,radius) * Math.cos(angle + angleInc/2));
        y = Math.floor(randomRange(8,radius) * Math.sin(angle + angleInc/2));

        points.push([x,y]);
        randAdjust -= 1;
      }

      //console.log(x,y,angle,angleInc,radius);
      angle += angleInc;
    }

    return points;
  }

  Asteroid.prototype.drawOnce = function(ctx, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(this.shape[0][0] + this.pos[0], this.shape[0][1] + this.pos[1]);

    for (var i=1; i < (this.shape.length); i++) {
      var x = this.shape[i][0] + this.pos[0];
      var y = this.shape[i][1] + this.pos[1];
      ctx.lineTo(x,y);
    }

    ctx.lineTo(this.shape[0][0] + this.pos[0], this.shape[0][1] + this.pos[1]);

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle=color;

    ctx.stroke();
    ctx.closePath();
  }

  Asteroid.prototype.draw = function(ctx) {
    this.drawOnce(ctx, "yellow", 1.5);
    this.drawOnce(ctx, "white", 1);
  }

  Asteroid.prototype.explode = function(minVelocity) {
    var chunks = [];
    var baseVelocity = minVelocity + 6;
    var dir = 1;

    if (this.size > 1) {
      var vel = [-dir*randomVelocity(baseVelocity), dir*randomVelocity(baseVelocity)];
      for (var i=0; i < this.size-1; i++) {
        chunks.push(new Asteroid( [this.pos[0],this.pos[1]], vel, this.size-1 ));
        vel = [vel[1],vel[0]];
      }
    }

    return chunks;
  }

  Asteroid.prototype.makeDebris = function() {
    var debris = [];
    var numDebris = 20;

    for (var i=1; i < numDebris; i++) {
      debris.push(new Asteroids.Debris(this.pos,this.vel,1,1,"238,221,130"));
    }

    return debris;
  }
  
})(this)