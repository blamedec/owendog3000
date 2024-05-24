const gameContainer = document.getElementById('gameContainer');
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');

let score = 0;
let characterDirection = 'right';

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);

function handleTouch(event) {
    const touch = event.touches[0];
    const middleX = window.innerWidth / 2;
    
    if (touch.clientX < middleX) {
        character.style.left = '25%';
        character.style.backgroundImage = "url('character-left.png')";
        characterDirection = 'left';
    } else {
        character.style.left = '75%';
        character.style.backgroundImage = "url('character-right.png')";
        characterDirection = 'right';
    }
}

function spawnHotdog() {
    const hotdog = document.createElement('div');
    hotdog.classList.add('hotdog');
    hotdog.style.left = `${Math.random() * 100}%`;
    hotdog.style.top = '0px';
    gameContainer.appendChild(hotdog);

    moveHotdog(hotdog);
}

function moveHotdog(hotdog) {
    let hotdogInterval = setInterval(() => {
        const hotdogTop = parseInt(hotdog.style.top);
        if (hotdogTop > window.innerHeight - 60) {
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
