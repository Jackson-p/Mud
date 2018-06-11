var special ={
    x:1000*Math.random(),
    y:1000*Math.random(),
    blstatus:0 //决定它是心的话就加条命，如果是轮机的话就清空，分别是1、2
}
var specialImg = new Image();
function drawSpecial(){
    cts.clearRect(0, 0, cts.canvas.width, cts.canvas.height);
    special.x = 1000* Math.random();
    special.y = 1000* Math.random();
    var selec = Math.floor(10*Math.random());
    if(selec<5){
        specialImg.src = './img/heart.png';
        special.blstatus = 1;
    }else{
        specialImg.src = './img/cleaner.png';
        special.blstatus = 2;
    }
    specialImg.onload=function(){
        cts.drawImage(specialImg,special.x,special.y,40,40);
    }
}
function isGetted(){
    if(Math.abs(blue.x - special.x) <= 50 && Math.abs(blue.y - special.y) <=40 ){
        cts.clearRect(0, 0, cts.canvas.width, cts.canvas.height);
        special.x =-200;
        special.y =-200;//吃掉了就从页面上扔出去
        console.log(special.blstatus)
        if(special.blstatus == 1){
            blue.life += 1;
            console.log(blue.life);
        }else if(special.blstatus == 2){
            balls = [];
        }
    }
}
setInterval(function(){
    drawSpecial();
},10000);
setInterval(function(){
    isGetted();
},50)
