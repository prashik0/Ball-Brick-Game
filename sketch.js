var ball_x, ball_y, ball_dx, ball_dy, ball_radius;
var paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx;

var brickRows = 5, brickColumns = 6, brickWidth = 55, brickHeight = 20, brickPadding = 4, brickOffsetTop = 39, brickOffsetLeft = 25;

var score = 0, lives = 3;

var bricks = [];
// var brickColors = ["rgb(88, 24, 69)", "rgb(144, 12, 63)", "rgb(199, 0, 57)","rgb(255, 87, 51)", "rgb(255, 195, 0 )", "rgb(218, 247, 166)"];

for(var r = 0; r < brickRows; ++r){
  bricks[r] = [];
  for(var c = 0; c < brickColumns; ++c) bricks[r][c] = {x: 0, y: 0, hidden: 0};
}



function setup() {
  createCanvas(400, 400);
  ball_x = (width / 2);
  ball_y = (height / 2);
  ball_radius = 15 / 2;
  ball_dx = 2;
  ball_dy = 2; 
  
  paddle_width = 70;
  paddle_height = 12; 
  paddle_x = (width / 2) - (paddle_width / 2);
  paddle_y = height - paddle_height - ball_radius;
  paddle_dx = 5;
  fill("white");
}

function draw() {
  if(score == brickRows * brickColumns){
    clear();
    background("rgba(0,255,0, 0.25)");
    textSize(40);
    fill('blue');
    let gameOver = "BEST SCORE!!";
    text(gameOver, (width / 2) - 133, (height / 2)); 
  }
  else if(lives == 0){
    clear();
    background("rgba(0,255,0, 0.25)");
    textSize(40);
    fill("red");
    let gameOver = "GAME OVER!!";
    text(gameOver, (width / 2) - 133, (height / 2)); 
  }
  else{
    clear();
    background("rgba(0,255,0, 0.25)");
    checkCollisions(ball_x, ball_y);
    createBricks();


    if(ball_x >= width - ball_radius) ball_dx = -ball_dx;
    if(ball_x <= ball_radius) ball_dx = -ball_dx;
    if(ball_y <= ball_radius) ball_dy = -ball_dy;


    if(keyIsDown(LEFT_ARROW)) paddle_x = paddle_x - paddle_dx;
    if(keyIsDown(RIGHT_ARROW)) paddle_x = paddle_x + paddle_dx;

    
    var X = paddle_x;
    var Y = paddle_y;
    var topLeftX = X - (ball_radius / 2);
    var topLeftY = Y - (ball_radius / 2);
    var bottomRightX = topLeftX + paddle_width + 2 * (ball_radius / 2);
    var bottomRightY = height - ball_radius;  
    

    if(ball_x <= paddle_x && (paddle_x - ball_x <= ball_radius) && (paddle_y - ball_y <= ball_radius)){
      ball_dy = -ball_dy;
      ball_dx = -ball_dx;
    }
    else if(ball_x >= (paddle_x + paddle_width) && (ball_x - (paddle_x + paddle_width) <= ball_radius) && (paddle_y - ball_y <= ball_radius)){
      ball_dy = -ball_dy;
      ball_dx = -ball_dx;
    }  
    else if(ball_x <= bottomRightX && ball_x >= topLeftX && ball_y >= topLeftY && ball_y <= bottomRightY){
      ball_dy = -ball_dy;
    } 
    else if(ball_y >= height - ball_radius){
        ball_x = width / 2;
        ball_y = height / 2;
        --lives;
    }    
    
    fill("pink");
    circle(ball_x, ball_y, ball_radius * 2);
    fill("white");
    rect(paddle_x, paddle_y, paddle_width, paddle_height);
    

    ball_x = ball_x + ball_dx;
    ball_y = ball_y + ball_dy;

    fill('blue');
    textSize(20);
    var totalScore = "Score: "+ score;
    text(totalScore, 10, 25);

    fill("red");
    var remLives = "Lives: "+ lives
    text(remLives, 325, 25);    
  }
}

function createBricks() {
  for(var r = 0; r < brickRows; r++) {
    for(var c = 0; c < brickColumns; c++) {
      if(bricks[r][c].hidden == 0){
        var brickX = brickOffsetLeft + c * (brickPadding + brickWidth);
        var brickY = brickOffsetTop + r * (brickPadding + brickHeight);
        
        fill("rgb(255, 96, 52)");
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;

        rect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}



function increaseSpeed(){
  if(ball_dx < 0) ball_dx += -1;
  else ball_dx += 1;
  if(ball_dy < 0) ball_dy += -1;
  else ball_dy += 1;
}

function checkCollisions(XX, YY){
  for(var r = 0; r < brickRows; r++) {
    for(var c = 0; c < brickColumns; c++) {
      var X = bricks[r][c].x;
      var Y = bricks[r][c].y;
      var topLeftX = X - ball_radius;
      var topLeftY = Y - ball_radius;
      var hidden = bricks[r][c].hidden;
      var bottomRightX = topLeftX + brickWidth + 2 * ball_radius;
      var bottomRightY = topLeftY + brickHeight + 2 * ball_radius;
      
      if(XX <= bottomRightX && XX >= topLeftX && YY >= topLeftY && YY <= bottomRightY && hidden == 0){
        ++score;
        bricks[r][c].hidden = 1;
        ball_dy = -ball_dy;
        if(score == 20) increaseSpeed();
        else if(score == 10)increaseSpeed();
      } 
    }
  }  
}