const gameContainer = document.getElementById('gameContainer');
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const leaderboardElement = document.getElementById('leaderboard');

let score = 0;
let characterWidth = 50;  // Width of the character
let characterHeight = 50; // Height of the character
let characterSpeed = 20;  // Speed at which the character moves when an arrow key is pressed
let gameInterval;
let timerInterval;
let timeLeft = 60;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);
document.addEventListener('keydown', handleKeyDown);

function handleTouch(event) {
    const touch = event.touches[0];
    const touchX = touch.clientX;
    
    // Calculate the new position for the character
    let newLeft = touchX - characterWidth / 2;
    
    // Ensure the character stays within the game boundaries
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft > window.innerWidth - characterWidth) {
        newLeft = window.innerWidth - characterWidth;
    }

    // Update the character's position
    character.style.left = `${newLeft}px`;
}

function handleKeyDown(event) {
    const left = parseInt(character.style.left || '50%');
    
    if (event.key === 'ArrowLeft') {
        // Move character to the left
        let newLeft = left - characterSpeed;
        if (newLeft < 0) {
            newLeft = 0;
        }
        character.style.left = `${newLeft}px`;
    } else if (event.key === 'ArrowRight') {
        // Move character to the right
        let newLeft = left + characterSpeed;
        if (newLeft > window.innerWidth - characterWidth) {
            newLeft = window.innerWidth - characterWidth;
        }
        character.style.left = `${newLeft}px`;
    }
}

function spawnHotdog() {
    const hotdog = document.createElement('div');
    hotdog.classList.add('hotdog');
    hotdog.style.left = `${Math.random() * (window.innerWidth - 30)}px`; // Adjust based on hotdog width
    hotdog.style.top = '0px';
    gameContainer.appendChild(hotdog);

    moveHotdog(hotdog);
}

function moveHotdog(hotdog) {
    let hotdogInterval = setInterval(() => {
        const hotdogTop = parseInt(hotdog.style.top);
        if (hotdogTop > window.innerHeight - characterHeight - 150) { // Adjust this value to match the new bottom value
            if (isCatch(hotdog)) {
                score++;
                scoreElement.innerText = `Score: ${score}`;
            }
            hotdog.remove();
            clearInterval(hotdogInterval);
        } else {
            hotdog.style.top = `${hotdogTop + 5}px`;
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
    scoreElement.innerText = `Score: ${score}`;
    timerElement.innerText = `Time: ${timeLeft}s`;
    gameInterval = setInterval(spawnHotdog, 2000);
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
    const playerName = prompt('Game Over! Enter your name:');
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    leaderboardElement.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.innerText = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(entryElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayLeaderboard();
    startGame();
});
