var cw = enemy.width,
    ch = enemy.height = window.innerHeight,
    points = [],
    tick = 0,
    opt = {
      count: 5,
      range: {
        x: 20,
        y: 20
      },
      duration: {
        min: 10,
        max: 40
      },
      thickness: .5,
      strokeColor: '#444',
      level: .1,
      curved: true
    },
    rand = function(min, max){
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    },
    ease = function (t, b, c, d) {
	    if ((t/=d/2) < 1) return c/2*t*t + b;
	    return -c/2 * ((--t)*(t-2) - 1) + b;
    };

cte.lineJoin = 'round';
cte.lineWidth = opt.thickness;
cte.strokeStyle = opt.strokeColor;

var Point = function(config){
  this.anchorX = config.x;
  this.anchorY = config.y;
  this.x = config.x;
  this.y = config.y;
  this.setTarget();  
};

Point.prototype.setTarget = function(){
  this.initialX = this.x;
  this.initialY = this.y;
  this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
  this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
  this.tick = 0;
  this.duration = rand(opt.duration.min, opt.duration.max);
}
  
Point.prototype.update = function(){
  var dx = this.targetX - this.x;
  var dy = this.targetY - this.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  
  if(Math.abs(dist) <= 0){
    this.setTarget();
  } else {       
    var t = this.tick;
    var b = this.initialY;
    var c = this.targetY - this.initialY;
    var d = this.duration;
    this.y = ease(t, b, c, d);
    
    b = this.initialX;
    c = this.targetX - this.initialX;
    d = this.duration;
    this.x = ease(t, b, c, d);
  
    this.tick++;
  }
};
    
Point.prototype.render = function(){
  cte.beginPath();
  cte.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
  cte.fillStyle = '#000';
  cte.fill();
};

var updatePoints = function(){
  var i = points.length;
  while(i--){
    points[i].update();
  }
};

var renderPoints = function(){
  var i = points.length;
  while(i--){
    points[i].render();
  }
};

var renderShape = function(){
  cte.beginPath();
  var pointCount = points.length;
  cte.moveTo(points[0].x, points[0].y);	  
  var i;
  for (i = 0; i < pointCount - 1; i++) {
    var c = (points[i].x + points[i + 1].x) / 2;
    var d = (points[i].y + points[i + 1].y) / 2;
    cte.quadraticCurveTo(points[i].x, points[i].y, c, d);
  }
  cte.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
  cte.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
  cte.closePath();   
  cte.fillStyle = 'hsl('+(tick/2)+', 80%, 60%)';
  cte.fill();  
  cte.stroke();
};

var clearen = function(){//这里命名会和一开始在第二层定义的clear冲突
  cte.clearRect(0, 0, cw, ch);
};

var loop = function(){
  window.requestAnimFrame(loop, enemy);
  tick++;
  clearen();
  updatePoints();
  renderShape();
  //renderPoints();
};

var i = opt.count + 2;
var spacing = (cw + (opt.range.x * 2)) / (opt.count-1);
while(i--){
  points.push(new Point({
    x: (spacing * (i - 1)) - opt.range.x,
    y: ch - (ch * opt.level)
  }));
}

window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

loop();


