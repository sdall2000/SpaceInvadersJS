var canvas, canvasContext;

const FRAMES_PER_SECOND = 30;

var player;
var frameCount = 1;
var moveInvaders = false;
var debugFreezeInvaders = false;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    canvas.addEventListener('click', function(evt) {
        debugFreezeInvaders = !debugFreezeInvaders;
    }, false);

    canvas.addEventListener('mousemove',
        function(evt) {
            if (debugFreezeInvaders) {
                var mousePos = calculateMousePos(evt);
                player.shotActive = true;
                player.shotX = mousePos.x;
                player.shotY = mousePos.y;
                player.debugShot = true;
            }
        });

    loadImages();
};

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x:mouseX,
        y:mouseY
    };
}

function startGame() {
    player = new playerClass(warriorPic, "Blue Storm");

    setInterval(updateAll, 1000 / FRAMES_PER_SECOND);

    setupInput();

    initializeInvaders();
}

function loadLevel(whichLevel) {
    // Copy level array.
    invaderGrid = whichLevel.slice();

    player.reset();
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}

function updateAll() {
    moveInvaders = frameCount == 1 || frameCount == 16;
    moveAll();
    drawAll();
    frameCount++;
    if (frameCount == 31) {
        frameCount = 1;
    }
}

function moveAll() {
    if (!debugFreezeInvaders) {
        moveInvaderBullet();
    }
    if (moveInvaders && !debugFreezeInvaders) {
        moveTheInvaders();
    }
    player.move();
    if (player.shotActive) {
        handlePlayerBullet(player);
    }
    if (invBulletActive) {
        if (player.handleInvaderShot(invBulletX, invBulletY, BULLET_LENGTH)) {
            invBulletActive = false;
        }
    }
}

function drawAll() {
    drawInvaders();
    player.draw();
    drawBoard();
}