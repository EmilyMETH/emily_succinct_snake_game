const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const gameOverModal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');
const scoreSpan = document.getElementById('score');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const congratulationMessage = document.getElementById('congratulationMessage');

let snake;
let food;
let direction;
let score;
let highScore = 0;
let gameInterval;
let isGamePaused = false;
let gameSpeed = 400;
let initialSpeed = 400;
let acceleration = 150;
let lastSpeedIncreaseTime = 0;
let speedIncreaseInterval = 20000;
let maxSpeed = 20;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = createFood();
    direction = 'RIGHT';
    score = 0;
    updateScore();
    gameSpeed = initialSpeed;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    snake.forEach((segment) => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function updateScore() {
    scoreSpan.textContent = score;
}

function createFood() {
    let x = Math.floor(Math.random() * (gameCanvas.width / 20));
    let y = Math.floor(Math.random() * (gameCanvas.height / 20));
    return { x, y };
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= gameCanvas.width / 20 || snake[0].y < 0 || snake[0].y >= gameCanvas.height / 20) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function showCongratulatoryMessage() {
    congratulationMessage.classList.add('show');
    setTimeout(() => {
        congratulationMessage.classList.remove('show');
    }, 3000);
}

function gameOver() {
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameOverModal.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    initGame();
    startGame();
});

function gameLoop() {
    if (isGamePaused) return;

    const currentTime = Date.now();

    if (currentTime - lastSpeedIncreaseTime >= speedIncreaseInterval) {
        if (gameSpeed > maxSpeed) {
            gameSpeed -= acceleration;
            lastSpeedIncreaseTime = currentTime;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
            console.log("New Speed:", gameSpeed);
        }
    }

    const newHead = { ...snake[0] };
    switch (direction) {
        case 'UP':
            newHead.y -= 1;
            break;
        case 'DOWN':
            newHead.y += 1;
            break;
        case 'LEFT':
            newHead.x -= 1;
            break;
        case 'RIGHT':
            newHead.x += 1;
            break;
    }
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 1;
        updateScore();
        food = createFood();
        if (score > highScore) {
            highScore = score;
            showCongratulatoryMessage();
        }
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        gameOver();
    }

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    snake.forEach((segment) => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function startGame() {
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function pauseGame() {
    isGamePaused = true;
}

function resumeGame() {
    isGamePaused = false;
}

function stopGame() {
    clearInterval(gameInterval);
    initGame();
    updateScore();
}

startBtn.addEventListener('click', function() {
    startGame();
    startBtn.disabled = true;
});

pauseBtn.addEventListener('click', function() {
    if (isGamePaused) {
        resumeGame();
        pauseBtn.textContent = 'Pause';
    } else {
        pauseGame();
        pauseBtn.textContent = 'Resume';
    }
});

stopBtn.addEventListener('click', function() {
    stopGame();
    startBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
    if (event.key === 'Enter') {
        if (gameOverModal.style.display === 'block') {
            gameOverModal.style.display = 'none';
            initGame();
            startGame();
            startBtn.disabled = true;
        } else if (!startBtn.disabled) {
            startGame();
            startBtn.disabled = true;
        }
    }
});

const upButton = document.getElementById('upBtn');
const downButton = document.getElementById('downBtn');
const leftButton = document.getElementById('leftBtn');
const rightButton = document.getElementById('rightBtn');

upButton.addEventListener('click', function() {
    if (direction !== 'DOWN') {
        direction = 'UP';
    }
});

downButton.addEventListener('click', function() {
    if (direction !== 'UP') {
        direction = 'DOWN';
    }
});

leftButton.addEventListener('click', function() {
    if (direction !== 'RIGHT') {
        direction = 'LEFT';
    }
});

rightButton.addEventListener('click', function() {
    if (direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

initGame();
