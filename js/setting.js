var lifesfa = document.getElementById('life');
var lifes = lifesfa.children[1];
//上述两行为了改命
var t = 0;
var timer = document.getElementById('timer');
setInterval(function(){
    t+=1;
    timer.innerHTML =  "Time:" +t;
},1000)
var Maxscore = document.getElementById('red');
var storage = window.localStorage;
Maxscore.innerHTML ="最高分：" + storage.getItem('Maxscore');
//以上为基础dom操作
//这里增加一部分考虑，看可不可以通过requestAnimationFrame来做，研究下
var canvas = document.getElementById('myCanvas');
var role = document.getElementById('myRole');
var enemy = document.getElementById('myEnemy');
var ballc = document.getElementById('myBall');
var specc = document.getElementById('mySpecial');
var ctx = canvas.getContext('2d');
var ctr = role.getContext('2d'); //既然不打算用图片只能用两层画布了
var cte = enemy.getContext('2d');//第三层用来放泥潭和小怪物
var ctb = ballc.getContext('2d');//我是真的没有想用第四层，希望以后有好的解决方案
var cts = specc.getContext('2d');//好吧我已经不知羞耻了。。。
canvas.width = document.getElementById('mainStage').clientWidth;
role.width = canvas.width;
enemy.width = canvas.width;
ballc.width = canvas.width;
specc.width = canvas.width;
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,canvas.width,canvas.height);

function drawLadder(x, y, height) {
    var wid = 30;
    var img = new Image();
    img.src = "./img/ladder.png";
    img.onload = function () {
        ctx.drawImage(img, x, y, wid, height);
    }
}


function DrawMap() {
    //地图的绘制尽量控制在宽1064，高661之间
    ctx.fillStyle = "#7f7f7f";
    //一二个参数是起点位置，后两个分别为宽高
    ctx.fillRect(40, 580, 150, 20); //左起始台阶
    ctx.fillRect(60, 450, 150, 20);
    ctx.fillRect(100, 70, 100, 20);
    ctx.fillRect(100, 290, 150, 20);
    ctx.fillRect(210, 185, 150, 20);
    ctx.fillRect(330, 125, 150, 20); //跳跃版
    ctx.fillRect(282, 400, 500, 20); //中间一决斗台
    ctx.fillRect(840, 260, 150, 20);
    ctx.fillRect(730, 200, 150, 20);
    ctx.fillRect(550, 300, 150, 20);
    ctx.fillRect(830, 140, 150, 20);
    ctx.fillRect(874, 430, 100, 20);
    ctx.fillRect(874, 580, 150, 20); //右起始台阶
    //function drawPlatform()
    drawLadder(100, 420, 200);
    drawLadder(150, 280, 200);
    drawLadder(150, 140, 200);
    drawLadder(150, 12, 200);
    drawLadder(940, 225, 245);
    drawLadder(900, 400, 220);
}
DrawMap();

function clear() { // clear canvas function
    ctr.clearRect(0, 0, ctr.canvas.width, ctr.canvas.height);
}

function isOnEdge(x, y) { //判断是否在板块上
    if (x >= 40 && x <= 190 && y >= 560 && y <= 570) {
        return 1;
    } else if (x >= 100 && x <= 200 && y >= 45 && y <= 50) {
        return 1;
    } else if (x >= 60 && x <= 210 && y >= 430 && y <= 440) {
        return 1;
    } else if (x >= 100 && x <= 250 && y >= 270 && y <= 280) {
        return 1;
    } else if (x >= 210 && x <= 350 && y >= 165 && y <= 175) {
        return 1;
    } else if (x >= 330 && x <= 480 && y >= 105 && y <= 115) { //跳跃版
        return 1;
    } else if (x >= 282 && x <= 782 && y >= 380 && y <= 390) {
        return 1;
    } else if (x >= 840 && x <= 990 && y >= 240 && y <= 250) {
        return 1;
    } else if (x >= 730 && x <= 880 && y >= 180 && y <= 190) {
        return 1;
    } else if (x >= 550 && x <= 700 && y >= 280 && y <= 290) {
        return 1;
    } else if (x >= 830 && x <= 980 && y >= 120 && y <= 160) {
        return 1;
    } else if (x >= 874 && x <= 974 && y >= 410 && y <= 420) {
        return 1;
    } else if (x >= 874 && x <= 1024 && y >= 560 && y <= 600) {
        return 1;
    }
    return 0;
}
function judgeUp(x,y){ //判断在某个地点是跳起还是爬梯
    if(x>=110 && x<=130 && y>=440 && y<=560){
        return 1;
    }else if(x>=160 && x<=180 && y>=60 && y<=430){
        return 1;
    }else if(x>=950 && x<=970 && y>=245 && y<=410){
        return 1;
    }else if(x>=910 && x<=930 &&y>=420 && y<=560){
        return 1;
    }
    return 0;
}
function judgeDown(x,y){ //判断在某个地点是下蹲还是下梯，我也不想写两套，可是有视觉误差啊喂。。。
    if(x>=110 && x<=130 && y>=430 && y<=550){
        return 1;
    }else if(x>=160 && x<=180 && y>=50 && y<=420){
        return 1;
    }else if(x>=950 && x<=970 && y>=235 && y<=400){
        return 1;
    }else if(x>=910 && x<=930 &&y>=410 && y<=550){
        return 1;
    }
    return 0;
}
function transImage(status){//根据当前角色的运动状态去改变其在图片中的状态
    var transres = [];
    switch(status){
        case 0 : transres = [70,0];break;
        case 1 : transres = [75,0];break;
        case 2 : transres = [100,0];break;
        case 3 : transres = [110,0];break;
        case 4 : transres = [-110,0];break;
        case 5 : transres = [-245,0];break;
        default:console.log('hhh');break;
    }
    return transres;
}