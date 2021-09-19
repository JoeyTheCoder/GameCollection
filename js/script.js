// Game Elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hitSound = new Audio('../sounds/hitSound.wav');
const scoreSound = new Audio('../sounds/scoreSound.wav');
const wallHitSound = new Audio('../sounds/wallHitSound.wav');
const netWidth = 4;
const netHeight = canvas.height;
const paddleWidth = 10;
const paddleHeight = 80;
let upArrowPressed = false;
let downArrowPressed = false;

// Element Functions

const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#FFF"
  };

  const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
  };
  const ai = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
  };
  
  // ball
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    color: '#FFF',
    velocityX: 5,
    velocityY: 5,
    
  };

  function drawNet() {
    // set the color of net
    ctx.fillStyle = net.color;
  
    // syntax --> fillRect(x, y, width, height)
    ctx.fillRect(net.x, net.y, net.width, net.height);
  }
  
  // function to draw score
  function drawScore(x, y, score) {
    ctx.fillStyle = '#fff';
    ctx.font = '35px sans-serif';
  
    // syntax --> fillText(text, x, y)
    ctx.fillText(score, x, y);
  }
  
  // function to draw paddle
  function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  
  // function to draw ball
  function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // π * 2 Radians = 360 degrees
    ctx.closePath();
    ctx.fill();
  }

// Render Canvas
function render() {
    // set a style
    ctx.fillStyle = "#000"; /* whatever comes below this acquires black color (#000). */
    // draws the black board
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw net
    drawNet();
    // draw user score
    drawScore(canvas.width / 4, canvas.height / 6, user.score);
    // draw ai score
    drawScore(3 * canvas.width / 4, canvas.height / 6, ai.score);
    // draw user paddle
    drawPaddle(user.x, user.y, user.width, user.height, user.color);
    // draw ai paddle
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);
    // draw ball
    drawBall(ball.x, ball.y, ball.radius, ball.color);
  }

window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    switch(event.keyCode) {
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
}

function update() {
    // move the paddle
    if (upArrowPressed && user.y > 0) {
        user.y -= 8;
    } else if (downArrowPressed && (user.y < canvas.height - user.height)) {
        user.y += 8;
    }
  
    // check if ball hits top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        //play wallHitSound
        wallHitSound.play();
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x + ball.radius >= canvas.width) {
        //play scoreSound
        scoreSound.play();
        //Score ++
        user.score += 1;
        reset();
    }

    if (ball.x - ball.radius <= 0){
        //play Score Sound
        scoreSound.play();
        ai.score += 1;
        reset();
    }
  
    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  
    // ai paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;
    // collision detection on paddles
  let player = (ball.x < canvas.width /2) ? user: ai;

  if (collisionDetect(player, ball)){
      hitSound.play();
      let angle = 0;
      if (ball.y < (player.y + player.height /2)){
          angle = -1 *Math.PI /4;
      }else if (ball.y > (player.y + player.height / 2)) {
        // if it hit the bottom of paddle
        // then angle will be Math.PI / 4 = 45deg
        angle = Math.PI / 4;
      }
      ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
      ball.velocityY = ball.speed * Math.sin(angle);
  
      // increase ball speed
      ball.speed += 0.2;
  }
  }

  function reset(){
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 7

      ball.velocityX = -ball.velocityX;
      ball.velocityY = -ball.velocityY;
  }

  function collisionDetect(player, ball) {
      player.top = player.y;
      player.right = player.x + player.width;
      player.bottom = player.y + player.height;
      player.left = player.x;
    
      ball.top = ball.y - ball.radius;
      ball.right = ball.x + ball.radius;
      ball.bottom = ball.y + ball.radius;
      ball.left = ball.x - ball.radius;

      return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
  }

function gameLoop(){
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);