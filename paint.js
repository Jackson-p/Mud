var roleImg = new Image();
roleImg.src = './img/sprite.png';
function drawRole(Roles){
    ctr.drawImage(roleImg,Roles.Imagex,Roles.Imagey,50,60,Roles.x-20,Roles.y-40,40,60);
}
//以下为角色ctr绘制部分
var ball = {
    x: 880,
    y: 560,
    Imagex:0,
    Imagey:0,//这两个用来控制当前人物是个什么样子
    r: 20,
    vx: 10,
    vy:10,//爬梯速度
    jy: 15,//跳起速度
    jcnt:0,
    jheight:10,//跳起等级，高度=等级*jy;
    towards:0,//1向左,2向右,3为空中跳起,4为空中下落,5为蹲下；我们称之为运动状态,towards1、2不要用
    status:0,//这一部分我们称之为形态状态,对应图片显示各个形态的图片截取位移，其中canvas坐标不变,
    stop:1,//让角色立刻停下来
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



document.onkeydown = function(event){
    var action = getDirection(event);
    clear();
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
            ball.towards = 1;
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
        ball.stop = 1;
        if(isOnEdge(ball.x,ball.y)){
            ball.x += 10;
            ball.Imagex += transImage(ball.status)[0];
            ball.status += 1;
            if(ball.status == 5){
                ball.status = 1;
                ball.Imagex = 80;
            }
            ball.towards  = 2;
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
        default :console.log('hhh');break;
    }
    ball.stop = 0;
    console.log(ball.towards);
}


function render() {
    clear();
    roleImg.onload = drawRole(ball);
    // ctr.fillStyle = ball.color;
    // ctr.beginPath();
    // ctr.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    // ctr.closePath();
    // ctr.fill();

    
}
setInterval(function () {
    render();
}, 5);
setInterval(function(){
    if(isOnEdge(ball.x,ball.y) && ball.status <= 4 && ball.status >0 && !ball.stop){
        ball.status = 0;
        ball.Imagex = 0;
    }
},1000)