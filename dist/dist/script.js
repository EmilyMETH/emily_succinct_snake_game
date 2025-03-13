// Snake Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const rankElement = document.getElementById('rank');

const scale = 20; // Size of each snake segment
const rows = 20; // Number of rows in the grid
const columns = 20; // Number of columns in the grid

canvas.width = columns * scale; // Increase canvas width
canvas.height = rows * scale; // Increase canvas height

let snake, food, direction, score, gameInterval, gameRunning, paused, currentSpeed, rank;

function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ]; // Initial snake
    direction = 'RIGHT'; // Initial direction
    score = 0; // Score
    food = createFood(); // Food spawn
    currentSpeed = 150; // Initial game speed (slow)
    rank = 1; // Initial rank
    paused = false; // Game is not paused initially
    gameRunning = true;
    updateScore();
    updateRank();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, currentSpeed); // Game speed: 150ms per frame
}

function gameLoop() {
    if (!gameRunning) return;

    if (paused) return; // If the game is paused, stop the loop here

    clearCanvas();
    moveSnake();
    checkCollisions();
    drawSnake();
    drawFood();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { ...snake[0] };

    // Update direction
    switch (direction) {
        case 'UP':
            head.y -= 1;
            break;
        case 'DOWN':
            head.y += 1;
            break;
        case 'LEFT':
            head.x -= 1;
            break;
        case 'RIGHT':
            head.x += 1;
            break;
    }

    snake.unshift(head); // Add new head to snake body

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        rank = Math.floor(score / 5) + 1; // Increase rank for every 5 points
        currentSpeed = Math.max(50, 150 - (score * 2)); // Gradually increase speed
        food = createFood(); // New food spawn
        updateScore();
        updateRank();
    } else {
        snake.pop(); // Remove the last tail segment if no food is eaten
    }
}

function checkCollisions() {
    const head = snake[0];

    // Check for wall collisions
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
        gameOver();
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function drawSnake() {
    ctx.fillStyle = '#e63e8f'; // Pink snake color
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * scale, snake[i].y * scale, scale, scale);
    }
}

function drawFood() {
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

function createFood() {
    let foodX = Math.floor(Math.random() * columns);
    let foodY = Math.floor(Math.random() * rows);
    return { x: foodX, y: foodY };
}

function updateScore() {
    scoreElement.innerText = `Score: ${score}`;
}

function updateRank() {
    rankElement.innerText = `Rank: ${rank}`;
}

function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('Game Over!');
}

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
}

function togglePause() {
    paused = !paused;
    if (!paused) {
        gameInterval = setInterval(gameLoop, currentSpeed); // Restart the game loop if resumed
    } else {
        clearInterval(gameInterval); // Pause the game loop
    }
}

function restartGame() {
    clearInterval(gameInterval); // Stop current game loop
    initGame(); // Restart the game
}

// Event listeners
document.addEventListener('keydown', changeDirection);
document.getElementById('pauseButton').addEventListener('click', togglePause);
document.getElementById('startButton').addEventListener('click', restartGame);

// Start the game
initGame();
