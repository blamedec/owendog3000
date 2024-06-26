const gameContainer = document.getElementById('gameContainer');
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');

let score = 0;
let characterWidth = 50;
let characterHeight = 50;
let characterSpeed = 20;
let gameInterval;
let timerInterval;
let spawnInterval = 2000; // Initial spawn interval
let fallSpeed = 5; // Initial fall speed
let timeLeft = 60;

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);
document.addEventListener('keydown', handleKeyDown);

function handleTouch(event) {
    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    let newLeft = touchX - characterWidth / 2;
    let newTop = touchY - characterHeight / 2;
    
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft > window.innerWidth - characterWidth) {
        newLeft = window.innerWidth - characterWidth;
    }

    if (newTop < 0) {
        newTop = 0;
    } else if (newTop > window.innerHeight - characterHeight) {
        newTop = window.innerHeight - characterHeight;
    }

    character.style.left = `${newLeft}px`;
    character.style.top = `${newTop}px`;
}

function handleKeyDown(event) {
    const left = parseInt(character.style.left || '50%');
    const top = parseInt(character.style.top || '50%');
    
    if (event.key === 'ArrowLeft') {
        let newLeft = left - characterSpeed;
        if (newLeft < 0) {
            newLeft = 0;
        }
        character.style.left = `${newLeft}px`;
    } else if (event.key === 'ArrowRight') {
        let newLeft = left + characterSpeed;
        if (newLeft > window.innerWidth - characterWidth) {
            newLeft = window.innerWidth - characterWidth;
        }
        character.style.left = `${newLeft}px`;
    } else if (event.key === 'ArrowUp') {
        let newTop = top - characterSpeed;
        if (newTop < 0) {
            newTop = 0;
        }
        character.style.top = `${newTop}px`;
    } else if (event.key === 'ArrowDown') {
        let newTop = top + characterSpeed;
        if (newTop > window.innerHeight - characterHeight) {
            newTop = window.innerHeight - characterHeight;
        }
        character.style.top = `${newTop}px`;
    }
}

function spawnHotdog() {
    const hotdog = document.createElement('div');
    hotdog.classList.add('hotdog');
    hotdog.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
    hotdog.style.top = '0px';
    gameContainer.appendChild(hotdog);

    moveHotdog(hotdog);
}

function moveHotdog(hotdog) {
    let hotdogFallSpeed = fallSpeed + Math.random() * 3; // Add variability to fall speed
    let hotdogInterval = setInterval(() => {
        const hotdogTop = parseInt(hotdog.style.top);
        if (hotdogTop > window.innerHeight) {
            hotdog.remove();
            clearInterval(hotdogInterval);
        } else {
            hotdog.style.top = `${hotdogTop + hotdogFallSpeed}px`;
            if (isCatch(hotdog)) {
                score++;
                scoreElement.innerText = `Score: ${score}`;
                hotdog.remove();
                clearInterval(hotdogInterval);

                // Increase difficulty
                if (spawnInterval > 500) {
                    spawnInterval -= 150; // Decrease spawn interval more significantly
                }
                fallSpeed += 2; // Increase the fall speed more aggressively

                // Update the spawn interval
                clearInterval(gameInterval);
                gameInterval = setInterval(spawnHotdog, spawnInterval);
            }
        }
    }, 100);
}

function isCatch(hotdog) {
    const hotdogRect = hotdog.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    return !(
        hotdogRect.top > characterRect.bottom ||
        hotdogRect.bottom < characterRect.top ||
        hotdogRect.right < characterRect.left ||
        hotdogRect.left > characterRect.right
    );
}

function startGame() {
    score = 0;
    timeLeft = 60;
    spawnInterval = 2000; // Reset spawn interval
    fallSpeed = 5; // Reset fall speed
    scoreElement.innerText = `Score: ${score}`;
    timerElement.innerText = `Time: ${timeLeft}s`;
    startButton.style.display = 'none';
    character.style.left = '50%';
    character.style.top = '50%';
    gameInterval = setInterval(spawnHotdog, spawnInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerElement.innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert('Game Over! Your score is: ' + score);
    startButton.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    startButton.style.display = 'block';
});