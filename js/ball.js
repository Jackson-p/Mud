var balls = [];
const colors = ["#33B5E5","#0099CC","AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];
function ball (posx, posy, useCache){
    this.vx = 5;
    this.vy = 7;
    this.posx = posx;
    this.posy = posy;
    this.cacheCanvas = document.createElement("canvas");
	this.cacheCtb = this.cacheCanvas.getContext("2d");
	this.cacheCanvas.width = 20;//球的半径默认为10
    this.cacheCanvas.height = 20;
    this.useCache = useCache;
    if(useCache){
        this.cache();
    }
}
ball.prototype = {
    paint:function(ctb){
        if(!this.useCache){
            ctb.save();//用来保存canvas画笔当前的状态
            var colorTemp = colors[Math.floor(10*Math.random())];
            ctb.fillStyle = colorTemp;
            ctb.beginPath();
            ctb.arc(this.posx, this.posy, 10, 0, 2 * Math.PI);
            ctb.closePath();
            ctb.fill();
            ctb.restore();//用来恢复canvas画笔原来的状态，使变化受控
        }else {
            ctb.drawImage(this.cacheCanvas,this.posx-10,this.posy-10);
        }
    },
    cache:function(){
        this.cacheCtb.save();
        //for(let i = 0,len = balls.length ;i<len;i++)
        var colorTemp = colors[Math.floor(10*Math.random())];
        this.cacheCtb.fillStyle = colorTemp;
        this.cacheCtb.beginPath();
        this.cacheCtb.arc(10, 10, 10, 0, 2 * Math.PI);
        this.cacheCtb.closePath();
        this.cacheCtb.fill();
        this.cacheCtb.restore();
    },
    move:function(){
        this.posx += this.vx;
        this.posy += this.vy;
        if(Math.abs(this.posx - blue.x) <= 20 && Math.abs(this.posy - blue.y) <=10 ){
            blue.life--;
            lifes.innerHTML = "X"+blue.life;
            if(blue.life<=0){
                clearInterval(updateHandler);
                if(!storage.getItem('Maxscore')){
                    storage.setItem('Maxscore',t);
                }else if(t>storage.getItem('Maxscore')){
                    storage.setItem('Maxscore',t);
                }
                alert('游戏结束！您的得分为'+t);
                location.reload();
                // balls = [];
                // t=1;
                // blue.x = 130;
                // blue.y = 40;
                // blue.life = 1;
                // lifes.innerHTML = "X"+blue.life;
            }
        }
        if(blue.y>710){
            blue.y = -1000;
            clearInterval(updateHandler);
            setTimeout(function(){
                alert('游戏结束！您的得分为'+t);
                location.reload();
            },1000);
            
            if(!storage.getItem('Maxscore')){
                storage.setItem('Maxscore',t);
            }else if(t>storage.getItem('Maxscore')){
                storage.setItem('Maxscore',t);
            }
            //因为加载github的静态页面需要一定时间，用reload()的手段确实也是很不友好
            // balls = [];
            // t=1;
            // blue.x = 130;
            // blue.y = 40;
            // blue.life = 1;
            // lifes.innerHTML = "X"+blue.life;
        }
        if(this.posx <=0 || this.posx >= ballc.width){
            // if(this.vx<10){
            //     this.vx = -this.vx+10;
            // }else{
            //     this.vx = -(this.vx-10);
            // }   
            // this.ax = -this.ax;
            this.vx = -this.vx;
        }
        if(balls.length >0 && (this.posy >=ballc.height || this.posy <=0)){
            this.vy = -this.vy;
        }
        this.paint(ctb);
    }
}

function addBall(){
    var selx = Math.random()*1000;
    var sely = Math.random()*1000;
    balls.push(new ball(selx,sely,true));
}
function update(){
    ctb.clearRect(0, 0, ctb.canvas.width, ctb.canvas.height);
    if(balls.length <= 0){
        return;
    }
    for(let i = 0,len = balls.length;i<len;i++){
        //balls[i].vx += balls[i].ax;
        //balls[i].vy += balls[i].ay;
        if(!balls[i]){
            return;
        }
        balls[i].move();
    }
}
var updateHandler = setInterval(function(){
    update();
    stats.update();
},50);
// function loop(){
//     update();
//     stats.update();
//     RAF(function(){
//         loop();
//     })
// }
// loop();
setInterval(function(){
    addBall();
},4000);