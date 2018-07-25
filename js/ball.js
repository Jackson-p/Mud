var balls = [];
const colors = ["#33B5E5","#0099CC","AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];
function ball (posx,posy){
    this.vx = 5;
    this.vy = 7;
    this.ax = 1*Math.random();
    this.ay = 1*Math.random();
    this.posx = posx;
    this.posy = posy;
}
function addBall(){
    var selx = Math.random()*1000;
    var sely = Math.random()*1000;
    balls.push(new ball(selx,sely));
}
function renderBall(posx,posy){
    ctb.clearRect(0, 0, ctb.canvas.width, ctb.canvas.height);
    for(let i = 0,len = balls.length ;i<len;i++){
        var colorTemp = colors[Math.floor(10*Math.random())];
        ctb.fillStyle = colorTemp;
        ctb.beginPath();
        ctb.arc(balls[i].posx, balls[i].posy, 10, 0, 2 * Math.PI);
        ctb.closePath();
        ctb.fill();
    }
}
function update(){
    if(t<0){
        t=1;
    }
    for(let i = 0,len = balls.length;i<len;i++){
        //balls[i].vx += balls[i].ax;
        //balls[i].vy += balls[i].ay;
        balls[i].posx += balls[i].vx;
        balls[i].posy += balls[i].vy;
        if(Math.abs(balls[i].posx - blue.x) <= 10 && Math.abs(balls[i].posy - blue.y) <=10 ){
            blue.life--;
            lifes.innerHTML = "X"+blue.life;
            if(blue.life<=0){
                alert('游戏结束！您的得分为'+t);
                if(!storage.getItem('Maxscore')){
                    storage.setItem('Maxscore',t);
                }else if(t>storage.getItem('Maxscore')){
                    storage.setItem('Maxscore',t);
                }
                //location.reload();
                //因为加载github的静态页面需要一定时间，用reload()的手段确实也是很不友好
                balls = [];
                t=1;
                blue.x = 130;
                blue.y = 40;
            }
        }
        if(blue.y>710){
            alert('游戏结束！您的得分为'+t);
            if(!storage.getItem('Maxscore')){
                storage.setItem('Maxscore',t);
            }else if(t>storage.getItem('Maxscore')){
                storage.setItem('Maxscore',t);
            }
            //location.reload();
            //因为加载github的静态页面需要一定时间，用reload()的手段确实也是很不友好
            balls = [];
            t=1;
            blue.x = 130;
            blue.y = 40;
        }
        if(balls[i].posx <=0 || balls[i].posx >= ballc.width){
            // if(balls[i].vx<10){
            //     balls[i].vx = -balls[i].vx+10;
            // }else{
            //     balls[i].vx = -(balls[i].vx-10);
            // }   
            // balls[i].ax = -balls[i].ax;
            balls[i].vx = -balls[i].vx;
        }
        if(balls[i].posy >=ballc.height || balls[i].posy <=0){
            // if(balls[i].vy<10){
            //     balls[i].vy = -balls[i].vy+10;
            // }else{
            //     balls[i].vy = -(balls[i].vy-10);
            // }
            //balls[i].ay = -balls[i].ay;
            balls[i].vy = -balls[i].vy;
        }
    }
}
setInterval(function(){
    update();
    renderBall();
},50);
setInterval(function(){
    addBall();
    
},4000);