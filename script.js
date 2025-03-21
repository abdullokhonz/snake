window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
});

var bgMusic = document.getElementById('backgroundMusic');
var clMusic = document.getElementById('clickMusic');
var goMusic = document.getElementById('gameOverMusic');
var eatMusic = document.getElementById('eatMusic');

function changeStyle(elem, nameStyle, prop) {
    elem.style[nameStyle] = prop;
}

var help = document.getElementById('help');
var viewHelp = document.getElementById('viewHelp');
var result = document.getElementById('result');
var totalScore = document.getElementById('totalScore');
var totalTime = document.getElementById('totalTime');
var restart = document.getElementById('restart');
var hrs = document.querySelectorAll('[data-id="hr"]');

function toggleHelp() {
    if (viewHelp.style.display === 'none' || !viewHelp.style.display) {
        clMusic.play();
        changeStyle(viewHelp, 'display', 'flex');
    } else {
        clMusic.play();
        changeStyle(viewHelp, 'display', 'none');
    }
}

help.addEventListener('click', toggleHelp);

var bg = document.getElementById('background');

function toggleTheme() {
    if (bg.style.backgroundColor === 'black' || !bg.style.backgroundColor) {
        clMusic.play();
        changeStyle(document.body, 'backgroundColor', 'black');
        changeStyle(bg, 'backgroundColor', 'white');
        changeStyle(bg, 'boxShadow', '0px 0px 10px 5px white');
        changeStyle(gameArea, 'border', '2px solid white');
        changeStyle(gameArea, 'boxShadow', '0px 0px 10px 0px white');
        viewHelp.classList.remove('darkOverlay');
        viewHelp.classList.add('lightOverlay');
        result.classList.remove('darkOverlay');
        result.classList.add('lightOverlay');
        hrs.forEach(function(hr) {
            changeStyle(hr, 'backgroundColor', 'black');
            changeStyle(hr, 'boxShadow', '0px 0px 10px 0px black');
        });
    } else if (bg.style.backgroundColor === 'white' || !bg.style.backgroundColor) {
        clMusic.play();
        changeStyle(document.body, 'backgroundColor', 'white');
        changeStyle(bg, 'backgroundColor', 'black');
        changeStyle(bg, 'boxShadow', '0px 0px 10px 5px black');
        changeStyle(gameArea, 'border', '2px solid black');
        changeStyle(gameArea, 'boxShadow', '0px 0px 10px 0px black');
        viewHelp.classList.remove('lightOverlay');
        viewHelp.classList.add('darkOverlay');
        result.classList.remove('lightOverlay');
        result.classList.add('darkOverlay');
        hrs.forEach(function(hr) {
            changeStyle(hr, 'backgroundColor', 'white');
            changeStyle(hr, 'boxShadow', '0px 0px 10px 0px white');
        });
    }
}

bg.addEventListener('click', toggleTheme);
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 81) {
        event.preventDefault();
        toggleTheme();
    }
    if (event.code === 'Space' || event.keyCode === 32) {
        if (!gameOver()) {
            event.preventDefault();
            toggleStartStop();
        }
    }
    if (event.keyCode === 192 || event.keyCode === 72) {
        event.preventDefault();
        toggleHelp();
    }
    if (event.code === 'Enter' || event.keyCode === 13) {
        if (gameOver()) {
            event.preventDefault();
            clickRestart();
        }
    }
});

const gameArea = document.getElementById('gameArea');
const gameAreaSize = 400;
const cellSize = 20;
let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
let dx = cellSize; 
let dy = 0;
let food = {x: 0, y: 0};
let score = 0;
var viewScore = document.getElementById('score');
let isGameActive = false;
let gameInterval;
const startStopBtn = document.getElementById('startStopBtn');
var timer = 0;
var timeInterval;
var viewTime = document.getElementById('timer')

function startTimer() {
    timeInterval = setInterval(function() {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timeInterval);
}

function updateTimerDisplay() {
    viewTime.innerText = formatTime(timer);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return minutes.toString().padStart(2, '0') + ':' + secondsLeft.toString().padStart(2, '0');
}

function toggleStartStop() {
    if (isGameActive) {
        clMusic.play();
        clearInterval(gameInterval);
        bgMusic.pause();
        stopTimer();
        isGameActive = false;
        startStopBtn.innerText = 'Start';
        changeStyle(startStopBtn, 'color', 'green');
        changeStyle(startStopBtn, 'border', '2px solid green');
        changeStyle(startStopBtn, 'textShadow', '0px 0px 10px green');
        changeStyle(startStopBtn, 'boxShadow', '0px 0px 5px 0px green');
    } else {
        clMusic.play();
        isGameActive = true;
        bgMusic.play();
        startTimer();
        startStopBtn.innerText = 'Stop';
        changeStyle(startStopBtn, 'color', 'red');
        changeStyle(startStopBtn, 'border', '2px solid red');
        changeStyle(startStopBtn, 'textShadow', '0px 0px 10px red');
        changeStyle(startStopBtn, 'boxShadow', '0px 0px 5px 0px red');
        main();
    }
}

startStopBtn.addEventListener('click', toggleStartStop);

function clickRestart() {
    clMusic.play();
    window.location.reload();
}

function main() {
    if (isGameActive) {
        if (gameOver()) {
            bgMusic.pause();
            goMusic.play();
            stopTimer();
            changeStyle(result, 'display', 'flex');
            totalScore.innerHTML = score;
            totalTime.innerHTML = formatTime(timer);
            restart.addEventListener('click', clickRestart);
        } else {
            gameInterval = setTimeout(function onTick() {
                clearCanvas();
                drawFood();
                moveSnake();
                drawSnake();
                main();
            }, 100);
        }
    }
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        const collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (collided) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gameAreaSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gameAreaSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function clearCanvas() {
    gameArea.innerHTML = '';
}

function createCell(x, y, className) {
    const cell = document.createElement('div');
    cell.style.left = `${x}px`;
    cell.style.top = `${y}px`;
    cell.classList.add(className);
    gameArea.appendChild(cell);
}

function drawSnake() {
    snake.forEach(part => createCell(part.x, part.y, 'snake'));
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        eatMusic.play();
        score += 10;
        viewScore.innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    createCell(food.x, food.y, 'food');
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / cellSize) * cellSize;
}

function createFood() {
    food.x = randomFood(0, gameAreaSize - cellSize);
    food.y = randomFood(0, gameAreaSize - cellSize);
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -cellSize;
    const goingDown = dy === cellSize;
    const goingRight = dx === cellSize;
    const goingLeft = dx === -cellSize;
        
    if ((keyPressed === 37 || keyPressed === 65) && !goingRight) {
        event.preventDefault();
        dx = -cellSize;
        dy = 0;
    } else if ((keyPressed === 38 || keyPressed === 87) && !goingDown) {
        event.preventDefault();
        dx = 0;
        dy = -cellSize;
    } else if ((keyPressed === 39 || keyPressed === 68) && !goingLeft) {
        event.preventDefault();
        dx = cellSize;
        dy = 0;
    } else if ((keyPressed === 40 || keyPressed === 83) && !goingUp) {
        event.preventDefault();
        dx = 0;
        dy = cellSize;
    }
}

createFood();
main();
