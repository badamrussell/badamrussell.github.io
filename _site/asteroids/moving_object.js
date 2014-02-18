(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});


 
  var MovingObject = Asteroids.MovingObject = function(pos, vel, radius) {
    this.pos = pos; // [x, y]
    this.vel = vel; // [x, y]

    var offset = 10 + (radius * 2);
  }

  MovingObject.boundsX = [-100, 500+100];
  MovingObject.boundsY = [-100, 500+100];

  MovingObject.prototype.move = function() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    var xDiff = (this.pos[0] - otherObject.pos[0]);
    var yDiff = (this.pos[1] - otherObject.pos[1]);

    var dist = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));

    var totalRadii = this.radius + otherObject.radius;

    return totalRadii > dist;
  }

  MovingObject.prototype.isOffScreen = function(dimX, dimY){
    var xOut = this.pos[0] < MovingObject.boundsX[0] || this.pos[0] > MovingObject.boundsX[1];
    var yOut = this.pos[1] < MovingObject.boundsY[0] || this.pos[1] > MovingObject.boundsY[1];
    
    if( xOut || yOut ){
      return true;
    }
    return false;
  }

  MovingObject.prototype.explode = function() {

  }

})(this);