// Select necessary elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const gameOverModal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');
const scoreSpan = document.getElementById('score');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const congratulationMessage = document.getElementById('congratulationMessage'); // Add congratulatory message element

// Game variables
let snake;
let food;
let direction;
let score;
let highScore = 0; // Track high score
let gameInterval;
let isGamePaused = false;
let gameSpeed = 100; // Initial game speed (time in milliseconds per frame)
let initialSpeed = 100; // Starting speed
let acceleration = 5; // Time (ms) by which to decrease the interval when snake eats food
let lastSpeedIncreaseTime = 0; // Last time the speed was increased
let speedIncreaseInterval = 5000; // Time interval (ms) after which speed increases

// Initial game state
function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = createFood();
    direction = 'RIGHT';
    score = 0;
    updateScore();

    // Reset game speed
    gameSpeed = initialSpeed;

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

// Show congratulatory message smoothly (no shake)
function showCongratulatoryMessage() {
    congratulationMessage.classList.add('show'); // Add the show class to fade it in
    setTimeout(() => {
        congratulationMessage.classList.remove('show'); // Remove the class after 3 seconds
    }, 3000); // Hide after 3 seconds
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
    if (isGamePaused) return; // Skip the game loop if the game is paused

    // Gradually increase speed over time (after a fixed interval)
    const currentTime = Date.now();
    if (currentTime - lastSpeedIncreaseTime > speedIncreaseInterval) {
        if (gameSpeed > 20) { // Don't decrease speed beyond a certain point
            gameSpeed -= acceleration; // Speed up
            lastSpeedIncreaseTime = currentTime;
            clearInterval(gameInterval); // Clear the previous game loop interval
            gameInterval = setInterval(gameLoop, gameSpeed); // Restart the game loop with new speed
        }
    }

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
        score += 1; // Increase score by 1 (instead of 10)
        updateScore();
        food = createFood(); // Create new food

        // Check for new high score
        if (score > highScore) {
            highScore = score;
            showCongratulatoryMessage(); // Show congratulatory message when new high score is achieved
        }
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
    gameInterval = setInterval(gameLoop, gameSpeed); // Run game loop every 100 ms
}

// Pause the game
function pauseGame() {
    isGamePaused = true;
}

// Resume the game
function resumeGame() {
    isGamePaused = false;
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    initGame();
    updateScore();
}

// Button events
startBtn.addEventListener('click', function() {
    startGame();
    startBtn.disabled = true; // Disable start button after starting
});

pauseBtn.addEventListener('click', function() {
    if (isGamePaused) {
        resumeGame(); // If game is paused, resume it
        pauseBtn.textContent = 'Pause';
    } else {
        pauseGame(); // Pause the game
        pauseBtn.textContent = 'Resume';
    }
});

stopBtn.addEventListener('click', function() {
    stopGame(); // Stop the game
    startBtn.disabled = false; // Enable start button again
    pauseBtn.textContent = 'Pause'; // Reset pause button text
});

// Control the snake using keyboard (PC)
document.addEventListener('keydown', function(event) {
    // Arrow key movement
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }

    // Enter key handling for starting the game or restarting after Game Over
    if (event.key === 'Enter') {
        if (gameOverModal.style.display === 'block') {
            gameOverModal.style.display = 'none'; // Hide the game over modal
            initGame(); // Reset the game
            startGame(); // Start the game again
            startBtn.disabled = true; // Disable start button
        } else if (startBtn.disabled === false) {
            startGame(); // Start the game if it's not started yet
            startBtn.disabled = true; // Disable start button after starting
        }
    }
});

// Mobile Controls: Arrow buttons on the screen
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

// Function to request fullscreen
function requestFullscreen() {
    if (gameCanvas.requestFullscreen) {
        gameCanvas.requestFullscreen();
    } else if (gameCanvas.mozRequestFullScreen) { // Firefox
        gameCanvas.mozRequestFullScreen();
    } else if (gameCanvas.webkitRequestFullscreen) { // Chrome, Safari, Opera
        gameCanvas.webkitRequestFullscreen();
    } else if (gameCanvas.msRequestFullscreen) { // IE/Edge
        gameCanvas.msRequestFullscreen();
    }
}

// Call this function when the game starts
startBtn.addEventListener('click', function() {
    requestFullscreen(); // Request fullscreen when the game starts
    startGame();
    startBtn.disabled = true;
});

// Initialize the game
initGame();
