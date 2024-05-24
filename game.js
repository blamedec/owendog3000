const gameContainer = document.getElementById('gameContainer');
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');

let score = 0;
let characterWidth = 50;  // Width of the character
let characterDirection = 'right';

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);

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
        if (hotdogTop > window.innerHeight - 150) {
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

setInterval(spawnHotdog, 2000);
