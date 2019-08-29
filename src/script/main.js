export default function game() {

    // variables' declaration

    const startGame = document.getElementById('start'); // new game button
    const canvas = document.getElementById('canvas');
    const credit = document.getElementById('credit_menu');
    canvas.style.width = '800';
    canvas.style.height = '600';
    canvas.style.backgroundImage = 'url(../images/bg3.jpg)';
    const ctx = canvas.getContext('2d');
    let x = canvas.width / 2; // initial ball trajectory on the X axis
    let y = canvas.height - 20; // initial ball trajectory on the Y axis
    let dx = 5;// ball speed on the X axis(px/frame)
    let dy = -5; // ball speed on the Y axis(px/frame)
    const ballRadius = 10; // px
    const paddleHeight = 10;
    const paddleWidth = 100;
    let paddleX = (canvas.width - paddleWidth) / 2;// initial paddle position on the X axis
    // initial paddle keypress
    let rightPress = false;
    let leftPress = false;
    const brickRows = 7;
    const brickColumns = 7;
    const brickWidth = 75;
    const brickHeight = 15;
    const brickPadding = 5;
    const brickMarginTop = 55;
    const brickMarginLeft = 45;
    let score = 0;
    let lives = 3;
    // building the bricks
    const bricks = [];
    for (let c = 0; c < brickColumns; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRows; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
    }

    //game audio

    const audioMenu = new Audio('../audio/menu.mp3');
    audioMenu.loop = true;
    const audioGame = new Audio('../audio/game.mp3');
    audioGame.loop = true;

    //  functions' declaration

    function drawBall() {
        ctx.beginPath()
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#F57C00'
        ctx.fill()
        ctx.closePath()
    }

    function drawPaddle() {
        ctx.beginPath()
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
        ctx.fillStyle = '#AB0B00'
        ctx.fill()
        ctx.closePath()
    }

    function drawBricks() {
        for (let c = 0; c < brickColumns; c++) {
            for (let r = 0; r < brickRows; r++) {
                if (bricks[c][r].status == 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickMarginLeft
                    const brickY = (r * (brickHeight + brickPadding)) + brickMarginTop
                    bricks[c][r].x = brickX
                    bricks[c][r].y = brickY

                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.fillStyle = '#9E9E9E'
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }
    }

    // off-wall bounce, paddle shift speed and lives counter
    function bumpAndLives() {
        x += dx
        y += dy

        // off-wall bounce
        if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
            dx = -dx
        }
        if (y + dy < ballRadius) {
            dy = -dy
        }
        // paddle bounce and lives counter
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy
            } else {
                lives--
                if (!lives) {
                    return
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 20;
                    dx = 5;
                    dy = -5;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        // paddle shift
        if (rightPress && paddleX < canvas.width - paddleWidth) {
            paddleX += 8
        } else if (leftPress && paddleX > 0) {
            paddleX -= 8
        }
    }

    // lose and win screen
    function lose() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#AB0B00'
        ctx.font = '64px ARCADE'
        ctx.fillText('Wasted!', 130, 250)
        ctx.font = '14px ARCADE'
        ctx.fillText('Press [r] to start again or [esc] to quit', 45, 380)
    }

    function win() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#AB0B00'
        ctx.font = '64px ARCADE'
        ctx.fillText('You won!', 100, 230)
        ctx.font = '14px ARCADE'
        ctx.fillText('Press [r] to start again or [esc] to quit', 45, 380)
    }


    // game rendering and restart\quit
    function draw() {
        if (lives === 0) {
            lose()
            return
        } else if (score === brickColumns * brickRows) {
            win()
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawBricks()
        drawBall()
        drawPaddle()
        collisionDetection()
        drawScore()
        drawLives()
        bumpAndLives()
        requestAnimationFrame(draw)
    }

    // blocks' destruction and score count
    function collisionDetection() {
        for (let c = 0; c < brickColumns; c++) {
            for (let r = 0; r < brickRows; r++) {
                let b = bricks[c][r]
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy
                        b.status = 0
                        score++
                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = '12px ARCADE'
        ctx.fillStyle = '#AB0B00'
        ctx.fillText('score: ' + score, 15, 25)
    }

    function drawLives() {
        ctx.font = '12px ARCADE'
        ctx.fillStyle = '#54FF00'
        ctx.fillText('lives: ' + lives, canvas.width - 105, 25)
    }

    function keyDownHandler(e) {
        if (e.key == 'Right' || e.key == 'ArrowRight') {
            rightPress = true
        }
        if (e.key == 'Left' || e.key == 'ArrowLeft') {
            leftPress = true
        }
        if (e.keyCode === 82) {
            lives = 4
            score = 0
            for (let c = 0; c < brickColumns; c++) {
                bricks[c] = []
                for (let r = 0; r < brickRows; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 }
                }
            }
            draw()
        }
    }


    function keyUpHandler(e) {
        if (e.key == 'Right' || e.key == 'ArrowRight') {
            rightPress = false
        }
        if (e.key == 'Left' || e.key == 'ArrowLeft') {
            leftPress = false
        }
        if (e.keyCode === 27) {
            document.location.reload()
            audioGame.pause()
            audioMenu.play()
        }
        if (event.keyCode === 9) {
            audioMenu.play()
        }
    }



    // event listeners
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);



    // start game by pressing Enter or mouseclick & hide main menu & hide cursor
    startGame.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            document.getElementById('page').style.display = 'none'
            document.getElementById('canvas_container').style.height = '100vh'
            document.getElementById('canvas_container').style.cursor = 'none'
            canvas.style.display = 'block'
            draw()
            audioMenu.pause()
            audioGame.play()
        }
    });

    startGame.addEventListener('click', function () {
        document.getElementById('page').style.display = 'none'
        document.getElementById('canvas_container').style.height = '100vh'
        document.getElementById('canvas_container').style.cursor = 'none'
        canvas.style.display = 'block'
        draw()
        audioMenu.pause()
        audioGame.play()
    });

    credit.addEventListener('click', function () {
        document.getElementById('page').style.display = 'none'
        document.getElementById('credit_container').style.height = '100vh'
        document.getElementById('credit').style.display = 'block'
        document.getElementById('neon-wrapper').style.display = 'inline-flex'
    });
    
    credit.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            document.getElementById('page').style.display = 'none'
            document.getElementById('credit_container').style.height = '100vh'
            document.getElementById('credit').style.display = 'block'
            document.getElementById('neon-wrapper').style.display = 'inline-flex'
        }
    });

}




