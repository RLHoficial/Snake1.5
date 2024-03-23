const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasWidth = 400;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * (canvasWidth / box)) * box, y: Math.floor(Math.random() * (canvasHeight / box)) * box };
let score = 0;
let lives = 3; // Vidas extras 

let dx = box;
let dy = 0;
let defaultSpeed = 150; // Velocidad predeterminada

let gameInterval;
let paused = false;
let gameStarted = false;

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("speedButton").addEventListener("click", setSpeed);
document.getElementById("resetButton").addEventListener("click", resetGame); // Agregar evento al nuevo botón

document.addEventListener("keydown", function(event) {
    if (!gameStarted) {
        startGame();
        gameStarted = true;
    }
    
    if (event.keyCode == 32 && !paused) { // Spacebar to pause/unpause the game
        pauseGame();
    } else if (event.keyCode == 38 && dy != box) { // Arrow Up
        dx = 0;
        dy = -box;
    } else if (event.keyCode == 40 && dy != -box) { // Arrow Down
        dx = 0;
        dy = box;
    } else if (event.keyCode == 37 && dx != box) { // Arrow Left
        dx = -box;
        dy = 0;
    } else if (event.keyCode == 39 && dx != -box) { // Arrow Right
        dx = box;
        dy = 0;
    }
});

function startGame() {
    if (lives > 0) {
        clearInterval(gameInterval);
        gameInterval = setInterval(draw, defaultSpeed);
    } else {
        alert("Game Over! Perdiste todas tus vidas :(");
        resetGame();
    }
}

function draw() {
    if (paused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood(food.x, food.y);

    let snakeX = snake[0].x + dx;
    let snakeY = snake[0].y + dy;

    if (snakeX < 0) snakeX = canvasWidth - box;
    if (snakeX >= canvasWidth) snakeX = 0;
    if (snakeY < 0) snakeY = canvasHeight - box;
    if (snakeY >= canvasHeight) snakeY = 0;

    let newHead = { x: snakeX, y: snakeY };

    // Check if the new head collides with the food
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * (canvasWidth / box)) * box, y: Math.floor(Math.random() * (canvasHeight / box)) * box };
    } else {
        snake.pop(); // Remove the tail segment if not eating food
    }

    // Check if the new head collides with the snake body
    //if (collision(newHead, snake)) {
    //    lives--; // Decrement lives
        //clearInterval(gameInterval); // Stop the game
    //    paused = true; // Pause the game
    ///    if (lives > 0) {
    //        alert("You lost a life! Lives remaining: " + lives);
    //        resetSnakePosition(); // Reset snake position
    //        draw();
    //  }
      if (collision(newHead, snake)) {
        lives--; // Decrement lives
        paused = true; // Pause the game
        if (lives > 0) {
            alert(" Acabas de perder una vida, te quedan: " + lives);
        }
    }
    snake.unshift(newHead); // Add the new head to the beginning of the snake array

    document.getElementById("score").innerText = "# " + score;
    }

   


function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = "green"; // Green color for the snake
        ctx.fillRect(snakePart.x, snakePart.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snakePart.x, snakePart.y, box, box);
    });
}

function drawFood(x, y) {
    ctx.fillStyle = "red"; // Red color for the food
    ctx.fillRect(x, y, box, box);
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) { // Start from index 1 to avoid collision with own head
        if (head.x === array[i].x && head.y === array[i].y) {
            return true; // Collision detected
        }
    }
    return false; // No collision detected
}

function pauseGame() {
    paused = !paused;
}

function setSpeed() {
    const newSpeed = parseInt(prompt("Que velocidad deseas(Recuerda 100 + rapido, 200 + lento):"));
    if (!isNaN(newSpeed)) {
        defaultSpeed = newSpeed;
        clearInterval(gameInterval); // Restablecer el intervalo con la nueva velocidad
        startGame(); // Iniciar el juego nuevamente con la nueva velocidad
        alert("Velocidad actualizada¡");
    } else {
        alert("Datos invalidos¡ Ingresa un numero.");
    }
}

function resetSnakePosition() {
    snake = [{ x: 10 * box, y: 10 * box }]; // Reiniciar la posición de la serpiente
    dx = box;
    dy = 0;
}

function resetGame() {
    resetSnakePosition();
    food = { x: Math.floor(Math.random() * (canvasWidth / box)) * box, y: Math.floor(Math.random() * (canvasHeight / box)) * box };
    score = 0;
    lives = 3; // Reiniciar vidas
    paused = false;
    gameStarted = false;
    startGame();
}

function changeDirection(newDx, newDy) {
    if (!gameStarted) {
        startGame();
        gameStarted = true;
    }

    if (paused) return;

    if (dx !== -newDx || dy !== -newDy) {
        dx = newDx;
        dy = newDy;
    }
}
