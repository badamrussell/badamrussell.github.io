(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});


  var Debris = Asteroids.Debris = function(pos, initialVelocity, points, length, color) {
    this.points = points || 1;
    this.length = length || 1;
    this.radius = 1;
    this.timeLeft = 2000;
    this.color = color || "255,255,255";

    Asteroids.MovingObject.call(this, randomPosition(pos), randomVelocity(initialVelocity), 1);
  }

  var randomPosition = function(startPos) {
    return [startPos[0] + randomRange(-5,5), startPos[1] + randomRange(-5,5)];
  }

  var randomVelocity = function(initialVelocity) {
    return [Math.floor(((Math.random()* 2) - 1) * 5),
            Math.floor(((Math.random()* 2) - 1) * 5)
            ];
  }

  var randomRange = function(min, max) {
    var randIndex = Math.floor(Math.random() * Math.abs(max - min));

    return min + randIndex;
  }

  Debris.inherits(Asteroids.MovingObject);

  Debris.prototype.draw = function(ctx) {
    ctx.beginPath();

    ctx.moveTo(this.pos[0], this.pos[1])
    ctx.lineTo(this.pos[0]+randomRange(-2,2), this.pos[1]+randomRange(-2,2));
    
    ctx.lineWidth = 1;
    var rgb = this.color + "," + this.timeLeft / 1000;
    //console.log(rgb,this.points, this.length)
    ctx.strokeStyle="rgba(" + rgb + ")";

    if (this.points == 2) {
      var nX = this.pos[0] + this.length * Math.cos(30);
      var nY = this.pos[1] + this.length * Math.sin(30);
      ctx.lineTo(nX, nY);
      ctx.lineWidth = 2;
    }

    
    

    ctx.stroke();
    ctx.closePath();
  }

  Debris.prototype.expired = function() {
    this.timeLeft -= 40;
    return this.timeLeft <= 0;
  }


})(this)