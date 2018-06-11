var blueRole = new Image();
blueRole.src = './img/sprite.png';
var redRole = new Image();
redRole.src = './img/sprite2.png';
function drawRole(Roles){
    ctr.drawImage(blueRole,Roles.Imagex,Roles.Imagey,50,60,Roles.x-20,Roles.y-40,40,60);
}
//以下为角色ctr绘制部分
var blue = {
    x: 130,
    y: 50,
    Imagex:0,
    Imagey:0,//这两个用来控制当前人物是个什么样子
    r: 20,
    vx: 10,
    vy:10,//爬梯速度
    jy: 15,//跳起速度
    jcnt:0,
    jheight:10,//跳起等级，高度=等级*jy;
    towards:0,//1向左,2向右,3为空中跳起,4为空中下落,5为蹲下；我们称之为运动状态,towards1、2不要用
    status:0,//这一部分我们称之为形态状态,对应图片显示各个形态的图片截取位移，其中canvas坐标不变,状态1～4对应奔跑，5对应蹲下
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
var red = {
    x: 130,
    y: 50,
    Imagex:0,
    Imagey:0,//这两个用来控制当前人物是个什么样子
    r: 20,
    vx: 10,
    vy:10,//爬梯速度
    jy: 15,//跳起速度
    jcnt:0,
    jheight:10,//跳起等级，高度=等级*jy;
    towards:0,//1向左,2向右,3为空中跳起,4为空中下落,5为蹲下；我们称之为运动状态,towards1、2不要用
    status:0,//这一部分我们称之为形态状态,对应图片显示各个形态的图片截取位移，其中canvas坐标不变,状态1～4对应奔跑，5对应蹲下
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
        case 87:
            return 'w';
        case 269: //up
            return 'up';
        case 2:
        case 40:
        case 83:
            return 's';
        case 270:
            return 'down';
        case 3:
        case 37:
        case 65:
            return 'a';
        case 271:
            return 'left';
        case 4:
        case 39:
        case 68:
            return 'd';
        case 272:
            return 'right';
        case 339: //exit
        case 240: //back
            return 'back';
        case 191: //反斜杠
            return 'attack';
    }
}



document.onkeydown = function(event){
    var action = getDirection(event);
    clear();
    switch(action){
        case "up": 
        if(judgeUp(blue.x,blue.y)){
            blue.towards = 0;
            blue.y -= 10;
        }else{
            if(blue.towards != 3 && blue.towards !=4){
                blue.jump();               
            }
        }
        break;
        case "down":
        if(judgeDown(blue.x,blue.y)){
            blue.y += 10;
        }else{
            blue.stop = 1;
            blue.Imagey = 200;
            blue.Imagex = 360;
            blue.status = 1;
        }
        break;
        case "left": 
        if(isOnEdge(blue.x,blue.y)){
            blue.Imagey = 110;
            blue.x -=10;
            blue.Imagex += transImage(blue.status)[0];
            blue.status += 1;
            if(blue.status == 5){
                blue.status = 1;
                blue.Imagex = 70;
            }
            blue.towards = 1;
        }else if(blue.towards!=3 && blue.towards!=4 && !judgeUp(blue.x,blue.y)){
            blue.fall()
        }else if (blue.towards == 3){
            var moveleft = setInterval(function(){
                blue.x -= 3;
                if(blue.towards == 0){
                    clearInterval(moveleft);
                    if(!isOnEdge(blue.x,blue.y)){
                        blue.fall();
                    } 
                    return ;
                }
            },10)
        }
        break;
        case "right":
        blue.stop = 1;
        if(isOnEdge(blue.x,blue.y)){
            blue.x += 10;
            blue.Imagex += transImage(blue.status)[0];
            blue.Imagey += transImage(blue.status)[1];
            blue.status += 1;
            if(blue.status == 5){
                blue.status = 1;
                blue.Imagex = 70;
            }
            blue.towards  = 2;
        }else if(blue.towards!=4 && blue.towards!=3 && !judgeUp(blue.x,blue.y)){
            blue.fall();//下落要求不能在阶梯上，不能在跳跃中，不能在下落中（下落只有一个）
        }else if (blue.towards == 3){
            var moveright = setInterval(function(){
                blue.x += 3;
                if(blue.towards == 0){
                    clearInterval(moveright);
                    if(!isOnEdge(blue.x,blue.y)){
                        blue.fall();
                    } 
                    return ;
                }
            },10)
        }
        break;
        default :console.log('hhh');break;
    }
    blue.stop = 0;
}


function render() {
    clear();
    blueRole.onload = drawRole(blue);
    // ctr.fillStyle = blue.color;
    // ctr.beginPath();
    // ctr.arc(blue.x, blue.y, blue.r, 0, 2 * Math.PI);
    // ctr.closePath();
    // ctr.fill();

    
}
setInterval(function () {
    render();
}, 10);//这里可以调高闪营造闪电效果
setInterval(function(){
    if(isOnEdge(blue.x,blue.y) && blue.status <= 4 && blue.status >0 && !blue.stop){
        blue.status = 0;
        blue.Imagex = 0;
        blue.Imagey = 0;
    }
    if(blue.x>canvas.width || blue.x <=0){
        blue.x = 890;
        blue.y = 505;
    }
},800)