// Select necessary elements
const playMobileBtn = document.getElementById('playMobileBtn');
const startBtn = document.getElementById('startBtn');
const gameOverModal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');
const scoreSpan = document.getElementById('score');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

let snake;
let food;
let direction;
let score;
let gameInterval;

// Initial game state
function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = createFood();
    direction = 'RIGHT';
    score = 0;
    updateScore();

    // Clear canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the snake
    snake.forEach((segment) => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    // Draw food
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

// Update the score
function updateScore() {
    scoreSpan.textContent = score;
}

// Create food in random position
function createFood() {
    let x = Math.floor(Math.random() * (gameCanvas.width / 20));
    let y = Math.floor(Math.random() * (gameCanvas.height / 20));
    return { x: x, y: y };
}

// Detect collision
function checkCollision() {
    // Check wall collision
    if (snake[0].x < 0 || snake[0].x >= gameCanvas.width / 20 || snake[0].y < 0 || snake[0].y >= gameCanvas.height / 20) {
        return true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameOverModal.style.display = 'block'; // Show the modal
}

// Restart the game
restartBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    initGame();
    startGame();
});

// Game loop function
function gameLoop() {
    // Move the snake
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

    snake.unshift(newHead); // Add new head to the snake

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        updateScore();
        food = createFood(); // Create new food
    } else {
        snake.pop(); // Remove last segment
    }

    if (checkCollision()) {
        gameOver(); // End game if collision
    }

    // Clear canvas and redraw snake and food
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    snake.forEach((segment) => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

// Start the game
function startGame() {
    gameInterval = setInterval(gameLoop, 100); // Run game loop every 100 ms
}

// Button events
startBtn.addEventListener('click', function() {
    startGame();
});

playMobileBtn.addEventListener('click', function() {
    startGame();
    playMobileBtn.style.display = 'none'; // Hide play button after game starts
});
