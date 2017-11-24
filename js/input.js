const KEY_SPACE = 32;
const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
    canvas.addEventListener('mousemove', updateMousePos);

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    player.setupInput(KEY_RIGHT_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
}

function keySet(whichWarrior, evt, setTo) {
    switch(evt.keyCode) {
        case whichWarrior.controlKeyLeft:
            whichWarrior.keyHeldLeft = setTo;
            break;
        case whichWarrior.controlKeyRight:
            whichWarrior.keyHeldRight = setTo;
            break;
    }
}

function keyPressed(evt) {
    // Check for shot.
    if (evt.keyCode == player.fireKey) {
        player.takeShot();
    }

    keySet(player, evt, true);
}

function keyReleased(evt) {
    keySet(player, evt, false);
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}