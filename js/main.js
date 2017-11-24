var canvas, canvasContext;

const FRAMES_PER_SECOND = 30;

var coreCannon;
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
                coreCannon.shotActive = true;
                coreCannon.shotX = mousePos.x;
                coreCannon.shotY = mousePos.y;
                coreCannon.debugShot = true;
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
    coreCannon = new coreCannonClass(coreCannonImage);

    setInterval(updateAll, 1000 / FRAMES_PER_SECOND);

    setupInput();

    initializeInvaders();
}

function loadLevel(whichLevel) {
    // Copy level array.
    invaderGrid = whichLevel.slice();

    coreCannon.reset();
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
    coreCannon.move();
    if (coreCannon.shotActive) {
        handlePlayerBullet(coreCannon);
    }
    if (invBulletActive) {
        if (coreCannon.handleInvaderShot(invBulletX, invBulletY, BULLET_LENGTH)) {
            invBulletActive = false;
        }
    }
}

function drawAll() {
    drawInvaders();
    coreCannon.draw();
    drawBoard();
}