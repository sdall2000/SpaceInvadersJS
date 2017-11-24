const KEY_SPACE = 32;
const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
    canvas.addEventListener('mousemove', updateMousePos);

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    coreCannon.setupInput(KEY_RIGHT_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
}

function keySet(whichCoreCannon, evt, setTo) {
    switch(evt.keyCode) {
        case whichCoreCannon.controlKeyLeft:
            whichCoreCannon.keyHeldLeft = setTo;
            break;
        case whichCoreCannon.controlKeyRight:
            whichCoreCannon.keyHeldRight = setTo;
            break;
    }
}

function keyPressed(evt) {
    // Check for shot.
    if (evt.keyCode == coreCannon.fireKey) {
        coreCannon.takeShot();
    }

    keySet(coreCannon, evt, true);
}

function keyReleased(evt) {
    keySet(coreCannon, evt, false);
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}