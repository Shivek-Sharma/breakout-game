const closeBtn = document.getElementById('close-btn');
const rulesBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');

//create canvas context
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 8;
const brickColumnCount = 5;

//ball properties
const ball = {
    x: canvas.width / 2,    //x-axis position
    y: canvas.height / 2,   //y-axis position
    size: 10,

    //for animation
    speed: 4,
    dx: 4,  //move 4 px in x direction
    dy: -4  //move -4 px in y direction
};

//paddle properties
const paddle = {
    x: canvas.width - 110,
    y: canvas.height - 25,
    width: 80,
    height: 10,

    //for animation
    speed: 6,
    dx: 0
};

//brick properties
const brickInfo = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 40,
    offsetY: 60,
    visible: true
};

//create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;

        bricks[i][j] = { x, y, ...brickInfo };
    }
}

//draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

//draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

//draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//draw score on canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 130, 35);
}

//move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    //wall detection
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

//move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //wall collison (left/right)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; //ball.dx = ball.dx * -1
    }

    //wall collison (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    //paddle collision
    if (
        ball.x - ball.size >= paddle.x && //left paddle side check
        ball.x + ball.size <= paddle.x + paddle.width && //right paddle side check
        ball.y + ball.size >= paddle.y //top paddle side check
    ) {
        ball.dy = paddle.speed * -1;
    }

    //brick collison
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size >= brick.x && //left brick side check
                    ball.x + ball.size <= brick.x + brick.width && //right brick side check
                    ball.y + ball.size >= brick.y && //top brick side check
                    ball.y - ball.size <= brick.y + brick.height //bottom brick side check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    //lose if ball hit the bottom wall
    if (ball.y + ball.size > canvas.height) {
        alert(`Sorry! You lost. Your score: ${score}`);
        window.location.reload();
    }
}

function increaseScore() {
    score++;

    if (score === (brickRowCount * brickColumnCount)) {
        alert("Congrats! You won :)");
        window.location.reload();
    }
}

//draw everyting on canvas
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawScore();
    drawPaddle();
    drawBricks();
}

//update canvas drawings and animations
function update() {
    movePaddle();
    moveBall();

    draw();

    requestAnimationFrame(update);
}

update();

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

//rules button event listeners
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
});

//keyboard event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);