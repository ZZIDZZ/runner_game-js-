const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 400;

//global variables
const obstacles = [];
const gravity = 10;
const jumpSpeed = 15;
var shooting = false;
var crouching = false;
var jumpSpeedBuffer;
var onAir = false;
var playerSpeed = 3;
var obstacleInterval = 200;
var groundPos = 300;
var gameOver = false;
var score ={
    value: 0,
    x: 800,
    y: 70,
    fontSize: 40,
};
const playerPos={
    x:100,
    y:220,
    width:50,
    height:80,
}
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
var frame = 0;
var speed;
var airTime;

class Player{
    constructor(){
        this.x = 100;
        this.y = 220;
        this.width = 50;
        this.height = 80;
    }
    draw(){
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }
    jump(){
        if(!onAir){
            airTime = 0;
            onAir = true;
            jumpSpeedBuffer = jumpSpeed;
        }
    }
    crouchCheck(){
        let crouchHeight = playerPos.height - 20;
        if(crouching){
            if(player.height > crouchHeight){
                player.height = crouchHeight;
                player.y = playerPos.y + 20;
            }
        }
        else if(crouching == false){
            player.y = playerPos.y;
            player.height = playerPos.height;
        }
    }
}
const player = new Player();
function handlePlayer(){
    if(crouching){
        let crouchHeight = playerPos.height - 25;
        if(crouching){
            if(player.height > crouchHeight){
                player.height = crouchHeight;
                player.y = playerPos.y + 25;
            }
        }
    }
    else if(!crouching){
        player.y = playerPos.y;
        player.height = playerPos.height;
    }
    if(onAir){
        airTime += 0.06;
        player.y -= jumpSpeedBuffer;
        playerPos.y -= jumpSpeedBuffer
        if(jumpSpeed > (-jumpSpeedBuffer) && player.y + player.height < groundPos){
            jumpSpeedBuffer = jumpSpeed - (gravity*airTime);
        }
        else if(player.y + player.height >= groundPos) {
            onAir = false; 
            // player.y = groundPos - playerPos.height;
            // playerPos.y = groundPos - playerPos.height;
            // player.height = playerPos.height;
        }
    }
    player.draw();
}
class Obstacle{
    constructor(y, width, height){
        this.x  = canvas.width;
        this.y = y;
        this.wid = width;
        this.hei = height;
        this.movement = playerSpeed;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.wid, this.hei);
    }
}

function handleObstacle(){
    for (i = 0; i < obstacles.length; i++){
        obstacles[i].update();
        obstacles[i].draw();
        if(collision(obstacles[i], player)){
            gameOver = true;
        }
        if(obstacles[i].x <= 0 ){
            obstacles.splice(i, 1);
            i--;
        }
    }
    if(frame % obstacleInterval == 0 && !gameOver){
        let randomizer = Math.ceil(Math.random() * 10);
        //60% ground obstacles, 40% air obstacles
        if(randomizer <= 6){
            let randomHeight = 40 + Math.floor(Math.random() * 30);
            let randomWidth = 30 + Math.floor(Math.random() * 30);
            obstacles.push(new Obstacle(groundPos - randomHeight, randomWidth, randomHeight));
        }
        else if(randomizer > 6){
            let randomY = 180 + Math.floor(Math.random() * 30);
            let randomHeight = 30 + Math.floor(Math.random() * 10);
            let randomWidth = 30 + Math.floor(Math.random() * 30);
            obstacles.push(new Obstacle(randomY, randomWidth, randomHeight));
        }
        
        if(obstacleInterval >= 150){
            obstacleInterval -= 1;
        }
        if(player.movement <= 6){
            player.movement += 0.01;
        }
        console.log('dor');
    }
    if (gameOver){
        console.log('gameOver: '+gameOver);
    }
}

class Weapon{
    constructor(projectileType, fireType){
        this.projectileType = projectileType
        this.fireType = fireType;
        this.x = player.x + player.width;
        this.y = player.y + (player.height/2);
    }
    weaponLine(){
        
    }
}
const weapon = new Weapon(1, 1);

function bresenhamLine(x1, y1, x2, y2){
    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
    // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1;
    // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);
    // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;
    // The line is X-axis dominant
    if (dy1 <= dx1) {
        // Line is drawn left to right
        if (dx >= 0) {
            x = x1; y = y1; xe = x2;
        } else { // Line is drawn right to left (swap ends)
            x = x2; y = y2; xe = x1;
        }
        ctx.fillStyle= 'black';
        ctx.fillRect(x, y, 1, 1); // Draw first pixel
        // Rasterize the line
        for (i = 0; x < xe; i++) {
            x = x + 1;
            // Deal with octants...
            if (px < 0) {
                px = px + 2 * dy1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    y = y + 1;
                } else {
                    y = y - 1;
                }
                px = px + 2 * (dy1 - dx1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            ctx.fillStyle= 'black';
            ctx.fillRect(x, y, 1, 1);
        }
    } else { // The line is Y-axis dominant
        // Line is drawn bottom to top
        if (dy >= 0) {
            x = x1; y = y1; ye = y2;
        } else { // Line is drawn top to bottom
            x = x2; y = y2; ye = y1;
        }
        ctx.fillStyle= 'black';
        ctx.fillRect(x, y, 1, 1); // Draw first pixel
        // Rasterize the line
        for (i = 0; y < ye; i++) {
            y = y + 1;
            // Deal with octants...
            if (py <= 0) {
                py = py + 2 * dx1;
            } else {
                if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
                    x = x + 1;
                } else {
                    x = x - 1;
                }
                py = py + 2 * (dx1 - dy1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            ctx.fillStyle= 'black';
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function handleLine(){
    
    ctx.fillStyle = 'black';
    bresenhamLine(player.x + player.width, (player.y + 30) , mouse.x, mouse.y);
    
    
}

function handleScore(){
    if(frame % 10 == 0){
        score.value += 1;
    }
    ctx.fillStyle = 'black';
    ctx.font = score.fontSize + 'px VT323';
    ctx.fillText('SCORE: ' + score.value, score.x, score.y);
}

function endWindow(){
    ctx.font = '30px VT323';
    ctx.fillText('Game Over. \nPress R to Restart', (canvas.width/2) - 180, (canvas.height/2) - 40);
    
}
// MOUSE, I'M LISTENING TO YOU!!!
// 4 Horsemen of mouse: down, up, move, leave
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    let alpha = Math.atan(e.y/e.x)
    mouse.x =  ((e.x + 500 * Math.cos(alpha))  - canvasPosition.left);
    mouse.y =  ((e.y + (canvas.height-e.y) * Math.sin(alpha))  - canvasPosition.top);
    
});
canvas.addEventListener('mousedown', function(){
    console.log('mouse.x: ' + mouse.x);
    console.log('mouse.y: ' + mouse.y);
    shooting = true;
    console.log('shooting: ' + shooting);
});
canvas.addEventListener('mouseup', function(){
    console.log('mouse.x: ' + mouse.x);
    console.log('mouse.y: ' + mouse.y);
    shooting = false;
    console.log('shooting: ' + shooting);
});

canvas.addEventListener('mouseleave,', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});



if(!gameOver){
    document.onkeydown = function (e) {
        switch (e.key) {
            case 'ArrowUp':
                player.jump();
                console.log('moved up');
                break;
            case 'ArrowDown':
                crouching = true;
                break;
            case 'r':
                if(gameOver == true) window.location.reload();
                break;
        }
    };
}
if(!gameOver){
    document.onkeyup = function (e) {
        switch (e.key) {
            case 'ArrowDown':
                crouching = false;
                break;
            
        }
    };
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, groundPos, canvas.width, canvas.height-groundPos);
    handleObstacle();
    handlePlayer();
    handleScore();
    handleLine();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
    else {
        (endWindow());
    }
}
animate();

function collision(first, second){
    if  (       !(  first.x > second.x + second.width || 
                    first.x + first.wid < second.x ||
                    first.y > second.y + second.height ||
                    first.y  + first.hei < second.y)
        ){
            return true;
        };
};

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})
