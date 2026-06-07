// =====================================
// PAC-MAN ULTRA ARCADE
// PART 1
// =====================================

const board = [
"111111111111111",
"100000100000001",
"101110101110101",
"100000000000001",
"101011111101101",
"100010000100001",
"111010111010111",
"100000100000001",
"101110101110101",
"100000000000001",
"101011111101101",
"100010000100001",
"101110101110101",
"100000000000001",
"111111111111111"
];

const gameBoard = document.getElementById("gameBoard");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const rows = board.length;
const cols = board[0].length;

let score = 0;
let dotsRemaining = 0;
let gameRunning = true;

const CELL_SIZE = Math.floor(
    Math.min(
        window.innerWidth * 0.9 / cols,
        34
    )
);

gameBoard.style.gridTemplateColumns =
`repeat(${cols}, ${CELL_SIZE}px)`;

gameBoard.style.gridTemplateRows =
`repeat(${rows}, ${CELL_SIZE}px)`;

const cells = [];

const pacman = {
    row: 1,
    col: 1,
    direction: "right",
    nextDirection: "right"
};

// ==========================
// BUILD BOARD
// ==========================

function buildBoard() {

    gameBoard.innerHTML = "";
    dotsRemaining = 0;

    for (let r = 0; r < rows; r++) {

        cells[r] = [];

        for (let c = 0; c < cols; c++) {

            const cell =
            document.createElement("div");

            cell.classList.add("cell");

            cell.style.width =
            CELL_SIZE + "px";

            cell.style.height =
            CELL_SIZE + "px";

            if (board[r][c] === "1") {

                cell.classList.add("wall");

            } else {

                const dot =
                document.createElement("div");

                dot.classList.add("dot");

                cell.appendChild(dot);

                dotsRemaining++;
            }

            gameBoard.appendChild(cell);

            cells[r][c] = cell;
        }
    }
}

// ==========================
// WALL CHECK
// ==========================

function isWall(row, col) {

    if (
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols
    ) {
        return true;
    }

    return board[row][col] === "1";
}

// ==========================
// SCORE
// ==========================

function updateScore(points) {

    score += points;

    scoreEl.textContent = score;

    scoreEl.classList.add("score-flash");

    setTimeout(() => {
        scoreEl.classList.remove("score-flash");
    }, 300);
}

// ==========================
// DRAW PACMAN
// ==========================

function drawPacman() {

    document
    .querySelectorAll(".pacman")
    .forEach(el => el.remove());

    const player =
    document.createElement("div");

    player.classList.add("pacman");

    switch(pacman.direction){

        case "left":
            player.style.transform =
            "rotate(180deg)";
            break;

        case "up":
            player.style.transform =
            "rotate(270deg)";
            break;

        case "down":
            player.style.transform =
            "rotate(90deg)";
            break;
    }

    cells[pacman.row][pacman.col]
    .appendChild(player);
}

// ==========================
// DOT COLLECTION
// ==========================

function collectDot() {

    const cell =
    cells[pacman.row][pacman.col];

    const dot =
    cell.querySelector(".dot");

    if (dot) {

        dot.remove();

        dotsRemaining--;

        updateScore(10);

        if (dotsRemaining <= 0) {
            winGame();
        }
    }
}

// =====================================
// PART 2
// MOVEMENT + CONTROLS
// =====================================

// ==========================
// CAN MOVE?
// ==========================

function canMove(direction){

    let newRow = pacman.row;
    let newCol = pacman.col;

    switch(direction){

        case "left":
            newCol--;
            break;

        case "right":
            newCol++;
            break;

        case "up":
            newRow--;
            break;

        case "down":
            newRow++;
            break;
    }

    return !isWall(newRow, newCol);
}

// ==========================
// MOVE PACMAN
// ==========================

function movePacman(){

    if(!gameRunning) return;

    // Change direction if possible

    if(canMove(pacman.nextDirection)){

        pacman.direction =
        pacman.nextDirection;
    }

    // Stop at wall

    if(!canMove(pacman.direction)){

        drawPacman();
        return;
    }

    switch(pacman.direction){

        case "left":
            pacman.col--;
            break;

        case "right":
            pacman.col++;
            break;

        case "up":
            pacman.row--;
            break;

        case "down":
            pacman.row++;
            break;
    }

    collectDot();

    drawPacman();
}

// ==========================
// KEYBOARD CONTROLS
// ==========================

document.addEventListener(
    "keydown",
    (e)=>{

        switch(e.key){

            case "ArrowLeft":
                pacman.nextDirection =
                "left";
                break;

            case "ArrowRight":
                pacman.nextDirection =
                "right";
                break;

            case "ArrowUp":
                pacman.nextDirection =
                "up";
                break;

            case "ArrowDown":
                pacman.nextDirection =
                "down";
                break;
        }
    }
);

// ==========================
// SWIPE CONTROLS
// ==========================

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener(
    "touchstart",
    (e)=>{

        touchStartX =
        e.touches[0].clientX;

        touchStartY =
        e.touches[0].clientY;

    },
    { passive:true }
);

document.addEventListener(
    "touchend",
    (e)=>{

        const touchEndX =
        e.changedTouches[0].clientX;

        const touchEndY =
        e.changedTouches[0].clientY;

        const dx =
        touchEndX - touchStartX;

        const dy =
        touchEndY - touchStartY;

        // Ignore tiny swipes

        if(
            Math.abs(dx) < 20 &&
            Math.abs(dy) < 20
        ){
            return;
        }

        if(
            Math.abs(dx) >
            Math.abs(dy)
        ){

            if(dx > 0){

                pacman.nextDirection =
                "right";

            }else{

                pacman.nextDirection =
                "left";
            }

        }else{

            if(dy > 0){

                pacman.nextDirection =
                "down";

            }else{

                pacman.nextDirection =
                "up";
            }
        }
    },
    { passive:true }
);

// ==========================
// OPTIONAL:
// WASD CONTROLS
// ==========================

document.addEventListener(
    "keydown",
    (e)=>{

        switch(e.key.toLowerCase()){

            case "a":
                pacman.nextDirection =
                "left";
                break;

            case "d":
                pacman.nextDirection =
                "right";
                break;

            case "w":
                pacman.nextDirection =
                "up";
                break;

            case "s":
                pacman.nextDirection =
                "down";
                break;
        }
    }
);

// ==========================
// SMOOTH RESIZE
// ==========================

window.addEventListener("resize", () => {

    const newSize = Math.floor(
        Math.min(
            window.innerWidth * 0.9 / cols,
            34
        )
    );

    document
    .querySelectorAll(".cell")
    .forEach(cell => {

        cell.style.width =
        newSize + "px";

        cell.style.height =
        newSize + "px";

    });

    gameBoard.style.gridTemplateColumns =
    `repeat(${cols}, ${newSize}px)`;

    gameBoard.style.gridTemplateRows =
    `repeat(${rows}, ${newSize}px)`;
});

// =====================================
// PART 3
// GHOSTS + AI + COLLISIONS
// =====================================

// ==========================
// GHOST DATA
// ==========================

const ghosts = [
{
    row: 7,
    col: 7,
    color: "red",
    direction: "left"
},
{
    row: 7,
    col: 8,
    color: "pink",
    direction: "right"
},
{
    row: 8,
    col: 7,
    color: "cyan",
    direction: "up"
},
{
    row: 8,
    col: 8,
    color: "orange",
    direction: "down"
}
];

// ==========================
// REMOVE GHOSTS
// ==========================

function removeGhosts(){

    document
    .querySelectorAll(".ghost")
    .forEach(ghost => ghost.remove());
}

// ==========================
// DRAW GHOSTS
// ==========================

function drawGhosts(){

    removeGhosts();

    ghosts.forEach(ghost => {

        const ghostElement =
        document.createElement("div");

        ghostElement.classList.add(
            "ghost",
            ghost.color
        );

        cells[ghost.row][ghost.col]
        .appendChild(ghostElement);

    });
}

// ==========================
// AVAILABLE MOVES
// ==========================

function getPossibleMoves(ghost){

    const moves = [];

    if(!isWall(ghost.row - 1, ghost.col))
        moves.push("up");

    if(!isWall(ghost.row + 1, ghost.col))
        moves.push("down");

    if(!isWall(ghost.row, ghost.col - 1))
        moves.push("left");

    if(!isWall(ghost.row, ghost.col + 1))
        moves.push("right");

    return moves;
}

// ==========================
// SMARTER GHOST AI
// ==========================

function moveGhost(ghost){

    const moves =
    getPossibleMoves(ghost);

    if(moves.length === 0)
        return;

    let bestMove =
    ghost.direction;

    let bestDistance =
    Infinity;

    moves.forEach(move => {

        let row = ghost.row;
        let col = ghost.col;

        switch(move){

            case "left":
                col--;
                break;

            case "right":
                col++;
                break;

            case "up":
                row--;
                break;

            case "down":
                row++;
                break;
        }

        const distance =
        Math.abs(row - pacman.row) +
        Math.abs(col - pacman.col);

        // 65% chase chance

        if(Math.random() < 0.65){

            if(distance < bestDistance){

                bestDistance =
                distance;

                bestMove = move;
            }

        }
    });

    // 35% random movement

    if(Math.random() < 0.35){

        bestMove =
        moves[
            Math.floor(
                Math.random() *
                moves.length
            )
        ];
    }

    ghost.direction =
    bestMove;

    switch(bestMove){

        case "left":
            ghost.col--;
            break;

        case "right":
            ghost.col++;
            break;

        case "up":
            ghost.row--;
            break;

        case "down":
            ghost.row++;
            break;
    }
}

// ==========================
// MOVE ALL GHOSTS
// ==========================

function moveGhosts(){

    ghosts.forEach(ghost => {
        moveGhost(ghost);
    });

    drawGhosts();
}

// ==========================
// PACMAN COLLISION
// ==========================

function checkGhostCollision(){

    for(const ghost of ghosts){

        if(
            ghost.row === pacman.row &&
            ghost.col === pacman.col
        ){
            gameOver();
            return true;
        }
    }

    return false;
}

// ==========================
// GHOST COLLISION EFFECT
// ==========================

function flashBoard(){

    gameBoard.style.filter =
    "brightness(2)";

    setTimeout(()=>{

        gameBoard.style.filter =
        "brightness(1)";

    },150);
}

// ==========================
// IMPROVED COLLISION
// ==========================

function checkCollisionEffects(){

    for(const ghost of ghosts){

        if(
            ghost.row === pacman.row &&
            ghost.col === pacman.col
        ){

            flashBoard();

            gameOver();

            return;
        }
    }
}

// =====================================
// PART 4
// GAME LOOP + UI + STARTUP
// =====================================

// ==========================
// GAME OVER
// ==========================

function gameOver(){

    if(!gameRunning)
        return;

    gameRunning = false;

    clearInterval(gameLoop);
    clearInterval(ghostLoop);

    showPopup(
        "GAME OVER",
        "lose"
    );
}

// ==========================
// WIN GAME
// ==========================

function winGame(){

    if(!gameRunning)
        return;

    gameRunning = false;

    clearInterval(gameLoop);
    clearInterval(ghostLoop);

    showPopup(
        "YOU WIN!",
        "win"
    );
}

// ==========================
// POPUP
// ==========================

function showPopup(title,type){

    const overlay =
    document.createElement("div");

    overlay.classList.add(
        "game-over"
    );

    overlay.innerHTML = `
        <div class="popup">
            <h1 class="${type}">
                ${title}
            </h1>

            <h2>
                Final Score: ${score}
            </h2>

            <button id="playAgainBtn">
                PLAY AGAIN
            </button>
        </div>
    `;

    document.body.appendChild(
        overlay
    );

    document
    .getElementById("playAgainBtn")
    .addEventListener(
        "click",
        () => location.reload()
    );
}

// ==========================
// GAME UPDATE
// ==========================

function updateGame(){

    if(!gameRunning)
        return;

    movePacman();

    if(checkGhostCollision())
        return;
}

// ==========================
// GHOST UPDATE
// ==========================

function updateGhosts(){

    if(!gameRunning)
        return;

    moveGhosts();

    checkCollisionEffects();
}

// ==========================
// RESTART BUTTON
// ==========================

restartBtn.addEventListener(
    "click",
    () => {

        location.reload();

    }
);

// ==========================
// START GAME
// ==========================

buildBoard();

drawPacman();

drawGhosts();

collectDot();

// ==========================
// GAME SPEEDS
// ==========================

const gameLoop =
setInterval(
    updateGame,
    180
);

const ghostLoop =
setInterval(
    updateGhosts,
    240
);

// ==========================
// OPTIONAL:
// SPACE TO RESTART
// ==========================

document.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.code === "Space" &&
            !gameRunning
        ){

            location.reload();
        }
    }
);

// ==========================
// PREVENT PAGE SCROLL
// ON MOBILE
// ==========================

document.addEventListener(
    "touchmove",
    (e)=>{
        e.preventDefault();
    },
    {
        passive:false
    }
);

// ==========================
// WELCOME EFFECT
// ==========================

window.addEventListener(
    "load",
    ()=>{

        gameBoard.animate(
        [
            {
                opacity:0,
                transform:
                "scale(.8)"
            },
            {
                opacity:1,
                transform:
                "scale(1)"
            }
        ],
        {
            duration:700,
            easing:"ease-out"
        });

    }
);

// ==========================
// DEBUG INFO
// ==========================

console.log(
`
PAC-MAN ULTRA ARCADE

Controls:
Arrow Keys
W A S D
Swipe Gestures

Collect all dots.
Avoid ghosts.

Good Luck!
`
);