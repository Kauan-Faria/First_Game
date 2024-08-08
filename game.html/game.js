const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10,
    image: new Image()
};

spaceship.image.src = 'imagens/nave2.webp'
let asteroidImage = new Image();
asteroidImage.src = 'imagens/asteroid.webp';

let asteroids = [];
let score = 0;
let gameOver = false;
let lastTimestamp = 0;
let nextLevel = 10;

document.addEventListener('keydown', moveSpaceship);

function moveSpaceship(e) {
    if (e.key === 'ArrowLeft' && spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
    }
    if (e.key === 'ArrowRight' && spaceship.x < canvas.width - spaceship.width) {
        spaceship.x += spaceship.speed;
    }
    if (e.key === 'ArrowUp' && spaceship.y > 0) {
        spaceship.y -= spaceship.speed;
    }
    if (e.key === 'ArrowDown' && spaceship.y < canvas.height - spaceship.height) {
        spaceship.y += spaceship.speed;
    }
}

function createAsteroid() {
    let radius = Math.random() * 25 + 10;  // Tamanho dos asteroides variando de 10 a 35 pixels
    let x = Math.random() * (canvas.width - 2 * radius) + radius; // Garantir que o asteroide apareça totalmente dentro do canvas
    asteroids.push({
        x: x,
        y: 0,
        radius: radius,
        speed: Math.random() * 3 + 2
    });
}
function drawSpaceship() {
    ctx.drawImage(spaceship.image, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.drawImage(asteroidImage, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, asteroid.radius * 2, asteroid.radius * 2);
    });
}

function updateAsteroids() {
    asteroids.forEach(asteroid => {
        asteroid.y += asteroid.speed;
    });

    asteroids = asteroids.filter(asteroid => asteroid.y - asteroid.radius < canvas.height);
}

function detectCollision() {
    for (let asteroid of asteroids) {
        let distX = asteroid.x - (spaceship.x + spaceship.width / 2);
        let distY = asteroid.y - (spaceship.y + spaceship.height / 2);
        let distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < asteroid.radius + Math.max(spaceship.width, spaceship.height) / 2) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 10, 20);
}

function updateScore(delta) {
    score += delta / 1000;
}

function levelUp() {
    if (Math.floor(score) > nextLevel) {
        nextLevel += 10;
        spaceship.speed += 1;
    }
}

function gameLoop(timestamp) {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        updateScore(delta);
        drawSpaceship();
        drawAsteroids();
        updateAsteroids();
        detectCollision();
        drawScore();
        levelUp();

        if (Math.random() < 0.02) {
            createAsteroid();
        }

        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
    }
}

spaceship.image.onload = () => {
requestAnimationFrame(gameLoop);

};