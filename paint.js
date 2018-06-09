//这里增加一部分考虑，看可不可以通过requestAnimationFrame来做，研究下
var canvas = document.getElementById('myCanvas');
var role = document.getElementById('myRole');
var timer;
var ctx = canvas.getContext('2d');
var ctr = role.getContext('2d'); //既然不打算用图片只能用两层画布了
canvas.width = document.getElementById('mainStage').clientWidth;
role.width = document.getElementById('mainStage').clientWidth;

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
    ctx.fillStyle = "#000000";
    //一二个参数是起点位置，后两个分别为宽高
    ctx.fillRect(40, 580, 150, 20); //左起始台阶
    ctx.fillRect(60, 450, 150, 20);
    ctx.fillRect(100, 70, 100, 20);
    ctx.fillRect(100, 290, 150, 20);
    ctx.fillRect(210, 185, 150, 20);
    ctx.fillRect(330, 125, 150, 20);//跳跃版
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

//以下为角色ctr绘制部分
function clear() { // clear canvas function
    ctr.clearRect(0, 0, ctr.canvas.width, ctr.canvas.height);
}
// window.requestAnimFrame = (function() {
// 	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
// 		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
// 			return window.setTimeout(callback, 1000 / 60);
// 		};
// })();
//以上为requesetAnimationFrame兼容性处理及画布基本内容
function isOnEdge(x,y){//判断是否在板块上
    if(x>=40 && x<=190 && y>=560 && y<=570){
        return 1;
    }else if(x>=100 && x<=200 && y>=40 && y<=50){
        return 1;
    }else if(x>=60 && x<=210 && y>=430 && y<=440){
        return 1;
    }else if(x>=100 && x<=250 && y>=270 && y<=280){
        return 1;
    }else if(x>=210 && x<=350 && y>=165 && y<=175){
        return 1;
    }else if(x>=330 && x<=480 && y>=105 &&y<=115){//跳跃版
        return 1;
    }else if(x>=282 && x<=782 && y>=380 && y<=390){
        return 1;
    }else if(x>=840 && x<=990 && y>=240 && y<=250){
        return 1;
    }else if(x>=730 && x<=880 && y>=180 &&y<=190){
        return 1;
    }else if(x>=550 && x<=700 && y>=280 && y<=290){
        return 1;
    }else if(x>=830 && x<=980 && y>=120 && y<=160){
        return 1;
    }else if(x>=874 && x<=974 && y>=410 && y<=420){
        return 1;
    }else if(x>=874 && x<=1024 && y>=560 && y<=600){
        return 1;
    }
    return 0;
}
var ball = {
    x: 880,
    y: 560,
    r: 20,
    vx: 10,
    vy:10,//爬梯速度
    jy: 15,//跳起速度
    jcnt:0,
    jheight:10,//跳起等级，高度=等级*jy;
    towards:0,//1向左，2向右,3为空中跳起,4为空中下落
    color: "#005588",
    jump : function(){
        var self = this;//终于自己也是碰到这档子问题了，闭包带来的this混乱
        self.towards = 3;//跳起来的过程中无法做下坠运动
        var jumpTimer = setInterval(function(){
            if(self.jcnt<5 && self.jcnt>=0){
                self.y -= self.jy;
                self.jcnt++;
            }
            
            else if(self.jcnt >= self.jheight/2 && self.jcnt < self.jheight){
                self.y += self.jy;
                self.jcnt++;
                if(isOnEdge(self.x,self.y)){
                    clearInterval(jumpTimer);
                    self.jcnt = 0;
                    self.towards = 0;
                    return;
                }
            }else if(self.jcnt == self.jheight){
                clearInterval(jumpTimer);
                self.jcnt = 0;
                self.towards = 0;
                return;
            }
        },50);
    },
    fall:function(){
        var self = this;
        self.towards = 4;
        var fallTimer = setInterval(function(){
            self.y +=5;
            if(isOnEdge(self.x,self.y)){
                self.towards = 0;
                clearInterval(fallTimer);
                return;
            }
        },10)
    }
}

function getDirection(event){
    var keyCode =  event.keyCode || event.which;
    switch(keyCode){
        case 1:
        case 38:
        case 269: //up
            return 'up';
            break;
        case 2:
        case 40:
        case 270:
            return 'down';
            break;
        case 3:
        case 37:
        case 271:
            return 'left';
            break;
        case 4:
        case 39:
        case 272:
            return 'right';
            break;
        case 339: //exit
        case 240: //back
            return 'back';
            break;
        case 191: //反斜杠
            return 'attack';
            break;
    }
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


document.onkeydown = function(event){
    var action = getDirection(event);
    switch(action){
        case "up": 
        if(judgeUp(ball.x,ball.y)){
            ball.towards = 0;
            ball.y -= 10;
        }else{
            if(ball.towards != 3 && ball.towards !=4){
                ball.jump();
            }
        }
        break;
        case "down": ball.y += 10;break;
        case "left": 
        if(isOnEdge(ball.x,ball.y)){
            ball.x -=10;
            ball.towards = 0;
        }else if(ball.towards!=3 && ball.towards!=4 && !judgeUp(ball.x,ball.y)){
            ball.fall()
        }else if (ball.towards == 3){
            var moveleft = setInterval(function(){
                ball.x -= 3;
                if(ball.towards == 0){
                    clearInterval(moveleft);
                    if(!isOnEdge(ball.x,ball.y)){
                        ball.fall();
                    } 
                    return ;
                }
            },10)
        }
        break;
        case "right":
        if(isOnEdge(ball.x,ball.y)){
            ball.x += 10;
            ball.towards  = 0;
        }else if(ball.towards!=4 && ball.towards!=3 && !judgeUp(ball.x,ball.y)){
            ball.fall();//下落要求不能在阶梯上，不能在跳跃中，不能在下落中（下落只有一个）
        }else if (ball.towards == 3){
            var moveright = setInterval(function(){
                ball.x += 3;
                if(ball.towards == 0){
                    clearInterval(moveright);
                    if(!isOnEdge(ball.x,ball.y)){
                        ball.fall();
                    } 
                    return ;
                }
            },10)
        }
        break;
        default :console.log('hhh');
    }
}


function render(ctr) {
    clear();
    ctr.fillStyle = ball.color;
    ctr.beginPath();
    ctr.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctr.closePath();
    ctr.fill();
    
}
setInterval(function () {
    render(ctr);
}, 10);