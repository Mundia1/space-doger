const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const highScoreMenu = document.getElementById("highScoreMenu");
const gameOverScore = document.getElementById("gameOverScore");
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const difficultySelect = document.getElementById("difficulty");

// Game variables
let player = { x: 180, y: 500, width: 40, height: 40 };
let asteroids = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;
let gameStarted = false;
let difficulty = "medium";

// Difficulty settings
const difficultySettings = {
    easy: { spawnRate: 0.03, baseSpeed: 1, maxAsteroids: 5 },
    medium: { spawnRate: 0.05, baseSpeed: 2, maxAsteroids: 8 },
    hard: { spawnRate: 0.07, baseSpeed: 3, maxAsteroids: 12 }
};

// Mouse control
canvas.addEventListener("mousemove", (e) => {
    if (!gameOver && gameStarted) {
        const rect = canvas.getBoundingClientRect();
        player.x = e.clientX - rect.left - player.width / 2;
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }
});

// Asteroid creation
function spawnAsteroid() {
    if (asteroids.length >= difficultySettings[difficulty].maxAsteroids) return;
    let asteroid = {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: difficultySettings[difficulty].baseSpeed + Math.random() * 3
    };
    asteroids.push(asteroid);
}

// Collision detection
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Game loop
function update() {
    if (!gameStarted || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (placeholder: green rectangle)
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Spawn asteroids
    if (Math.random() < difficultySettings[difficulty].spawnRate) spawnAsteroid();

    // Update and draw asteroids (placeholder: gray rectangles)
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        asteroid.y += asteroid.speed;

        ctx.fillStyle = "gray";
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);

        // Check collision
        if (checkCollision(player, asteroid)) {
            gameOver = true;
            console.log("Boom! Game Over");
            gameOverScreen.classList.remove("hidden");
            gameOverScore.textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreDisplay.textContent = highScore;
                highScoreMenu.textContent = highScore;
            }
            return; // Stop loop on game over
        }

        // Remove off-screen asteroids
        if (asteroid.y > canvas.height) asteroids.splice(i, 1);
    }

    // Update score
    score += 1;
    scoreDisplay.textContent = score;

    requestAnimationFrame(update);
}

// Start game
function startGame() {
    difficulty = difficultySelect.value;
    menu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameStarted = true;
    score = 0;
    asteroids = [];
    player.x = 180;
    console.log("Background hum started");
    update();
}

// Restart game
function restartGame() {
    gameOverScreen.classList.add("hidden");
    gameOver = false;
    score = 0;
    asteroids = [];
    player.x = 180;
    scoreDisplay.textContent = score;
    console.log("Background hum started");
    update();
}

// Back to menu
function backToMenu() {
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    menu.classList.remove("hidden");
    gameStarted = false;
    gameOver = false;
    score = 0;
    asteroids = [];
    scoreDisplay.textContent = score;
}

// Event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
menuBtn.addEventListener("click", backToMenu);

// Initial setup
highScoreDisplay.textContent = highScore;
highScoreMenu.textContent = highScore;