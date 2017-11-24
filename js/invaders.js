const INVADER_COLUMN_WIDTH = 70;
const INVADER_ROW_HEIGHT = 50;
const WORLD_COLUMNS = 11;
const WORLD_ROWS = 5;

const BACKGROUND_COLOR = 'black';
const EXPLOSION_DURATION_FRAMES = FRAMES_PER_SECOND / 4;

const INVADERS = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

// Point values correspond to the constant indices below.
const INVADER_VALUES = [0, 30, 20, 10];

var invaderGrid = [];

const EMPTY = 0;
const ALT_INVADER_OFFSET = 3;
const SMALL_INVADER = 1;
const MEDIUM_INVADER = 2;
const LARGE_INVADER = 3;
const EXPLODING_INVADER = 7;
const MAX_CONCURRENT_BULLETS = 2;
const INVADER_BULLET_SPEED = 10;

// TODO just track one bullet for now.
var invBulletX;
var invBulletY;
var invBulletActive = false;

// Positive means move right, negative means move left.
var xSpeed = 8;
var xOffset = 0;

var yOffset = 50;
var ySpeed = 32;

var invadersLeft;

// Track the leftmost/rightmost invader so we know when a collision
// with the edge of the board happens.
var leftmostInvaderColumn = 0;
var rightmostInvaderColumn = WORLD_COLUMNS;

function initializeInvaders()
{
    invaderGrid = INVADERS.slice();
    invadersLeft = invaderGrid.length;

    xSpeed = 8;
    xOffset = 0;

    yOffset = 50;
    ySpeed = 32;
}

function getTypeTypeAtColumnRow(col, row) {
    if (col >= 0 && col < WORLD_COLUMNS &&
        row >= 0 && row < WORLD_ROWS) {
        var worldIndexUnderCoord = columnRowToArrayIndex(col, row);
        return invaderGrid[worldIndexUnderCoord];
    } else {
        return false;
    }
}

function columnRowToArrayIndex(col, row) {
    return col + WORLD_COLUMNS * row;
}

function xToColumn(x) {
    var x1 = x - xOffset;
    var col = Math.floor(x1 / INVADER_COLUMN_WIDTH);
    return col;
}

function yToRow(y) {
    var y1 = y - yOffset;
    var row = Math.floor(y1 / INVADER_ROW_HEIGHT);
    return row;
}

function getRightMostInvaderColumn() {
    var rightMostCol = -1;
    var arrayIndex = 0;
    // Brute force for now.
    for (var br=0; br < WORLD_ROWS; br++) {
        // var x = 0;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            var tileKindHere = invaderGrid[arrayIndex];

            if (tileKindHere != EMPTY && tileKindHere != EXPLODING_INVADER) {
                if (bc > rightMostCol) {
                    rightMostCol = bc;
                }
            }

            arrayIndex++;
        }
    }

    return rightMostCol;
}

function getLeftMostInvaderColumn() {
    var leftMostCol = WORLD_COLUMNS;
    var arrayIndex = 0;
    // Brute force for now.
    for (var br=0; br < WORLD_ROWS; br++) {
        // var x = 0;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            var tileKindHere = invaderGrid[arrayIndex];

            if (tileKindHere != EMPTY && tileKindHere != EXPLODING_INVADER) {
                if (bc < leftMostCol) {
                    leftMostCol = bc;
                }
            }
            arrayIndex++;
        }
    }

    return leftMostCol;
}

function handlePlayerBullet(player) {
    // See if the bullet is in the invader grid yet.
    if (player.shotX >= xOffset && player.shotX <= xOffset + WORLD_COLUMNS * INVADER_COLUMN_WIDTH) {
        if (player.shotY >= yOffset && player.shotY <= yOffset + WORLD_ROWS * INVADER_ROW_HEIGHT) {
            // Bullet is in grid boundaries.
            // Find out which grid row/column.
            var col = xToColumn(player.shotX);
            var row = yToRow(player.shotY);
            // console.log("c/r: " + col + "/" + row);
            // TODO Refine hit testing for actual image, not just row/column.
            // TODO explosion
            var tileKindHere = invaderGrid[columnRowToArrayIndex(col, row)];
            if (tileKindHere != EMPTY) {
                // There is an invader in this cell.
                // Do a refined hit test based on the actual width/height of the specific invader.
                // Calculate the x/y of the shot relative to the top left corner of the cell.
                shotRelativeX = player.shotX - xOffset - col * INVADER_COLUMN_WIDTH;
                shotRelativeY = player.shotY - yOffset - row * INVADER_ROW_HEIGHT;

                // console.log("Relative shot x/y: " + shotRelativeX + "/" + shotRelativeY);

                var useImg = worldPics[tileKindHere];

                var centerCellX = INVADER_COLUMN_WIDTH / 2;
                var halfImageWidth = useImg.width / 2;

                if (shotRelativeY <= useImg.height &&
                    Math.abs(centerCellX - shotRelativeX) <= halfImageWidth) {
                    // Hit
                    player1Score += INVADER_VALUES[tileKindHere];
                    invaderGrid[columnRowToArrayIndex(col, row)] = EXPLODING_INVADER;
                    // Turn off bullet.
                    player.shotActive = false;

                    invadersLeft--;

                    if (invadersLeft == 0) {
                        initializeInvaders();
                    }
                }
            }
        }
    }
}

function activateInvaderBullet() {
    // For now, just find the bottom most invader
    // TODO find invader nearest to player.
    var lowestRow = -1;
    var lowestCol = -1;
    var tileKind;
    var arrayIndex = 0;

    for (var br=0; br < WORLD_ROWS; br++) {
        // var x = 0;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            var tileKindHere = invaderGrid[arrayIndex];

            if (tileKindHere != EMPTY && tileKindHere != EXPLODING_INVADER) {
                if (br > lowestRow) {
                    lowestRow = br;
                    lowestCol = bc;
                    tileKind = tileKindHere;
                }
            }
            arrayIndex++;
        }
    }

    // Get image associated with the cell we are firing from.
    var useImg = worldPics[tileKind];
    // Set the x to be in the center of the cell.
    invBulletX = xOffset + lowestCol * INVADER_COLUMN_WIDTH + INVADER_COLUMN_WIDTH / 2;
    invBulletY = yOffset + lowestRow * INVADER_ROW_HEIGHT + useImg.height;

    invBulletActive = true;
}

function moveInvaderBullet() {
    if (invBulletActive) {
        invBulletY += INVADER_BULLET_SPEED;
        if (invBulletY > canvas.height) {
            invBulletActive = false;
        }
    }

    if (!invBulletActive) {
        activateInvaderBullet();
    }
}

function moveTheInvaders() {
    // Need to determine collision with the right or left boundary.
    // When that happens, we move the invaders down a row and reverse the direction.
    // console.log("Right most index: " + getRightMostInvaderColumn());
    // console.log("Right : " + (xOffset + getRightMostInvaderColumn() * WORLD_W));

    // TODO need to put this on a timer.  Invaders are frozen while explosion is up.
    clearExplosions();

    var advance = false;

    if (xSpeed > 0) {
        if (xOffset + (getRightMostInvaderColumn() + 1) * INVADER_COLUMN_WIDTH > canvas.width) {
            advance = true;
        }
    } else if (xSpeed < 0) {
        if (xOffset + getLeftMostInvaderColumn() * INVADER_COLUMN_WIDTH < 0) {
            advance = true;
        }
    }

    if (advance) {
        // Flip the horizontal direction and move the invaders down.
        // Note in this case we don't move horizontally.
        xSpeed *= -1;
        yOffset += ySpeed;
    } else {
        // Continue horizontal movement.
        xOffset += xSpeed;
    }
}

function debugDrawGrid() {
    var arrayIndex = 0;
    var y = yOffset;

    canvasContext.beginPath();
    canvasContext.strokeStyle = "#ffff00";

    for (var br=0; br < WORLD_ROWS; br++) {
        // var topY = br * WORLD_H + offset;
        // var bottomY = (br + 1) * WORLD_H + offset;
        var x = xOffset;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            canvasContext.rect(x, y, INVADER_COLUMN_WIDTH, INVADER_ROW_HEIGHT);
            x += INVADER_COLUMN_WIDTH;
        }

        y += INVADER_ROW_HEIGHT;
    }

    canvasContext.lineWidth = 1;
    canvasContext.stroke();
}

// TODO since only one invader can explode at a time, perhaps just save off
// the row/column when the invader is hit.
function clearExplosions() {
    // Optimize the commented out code below.
    var arrayIndex = 0;

    for (var br=0; br < WORLD_ROWS; br++) {
        // var x = 0;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            var tileKindHere = invaderGrid[arrayIndex];

            if (tileKindHere == EXPLODING_INVADER) {
                invaderGrid[arrayIndex] = EMPTY;
            }
            arrayIndex++;
        }
    }
}

function drawInvaders() {
    colorRect(0, 0, canvas.width, canvas.height, BACKGROUND_COLOR);

    // Optimize the commented out code below.
    var arrayIndex = 0;
    var y = 0;

    for (var br=0; br < WORLD_ROWS; br++) {
        // var x = 0;
        for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
            var tileKindHere = invaderGrid[arrayIndex];

            if (tileKindHere != EMPTY) {
                if (!debugFreezeInvaders && frameCount > 15 && tileKindHere >= SMALL_INVADER && tileKindHere <= LARGE_INVADER) {
                    tileKindHere += ALT_INVADER_OFFSET;
                }

                var useImg = worldPics[tileKindHere];

                // The invaders all have different widths.  We want them to
                // be centered with each other.  The center of the invader
                // should line up with the center of the column, which is
                // effectively WORLD_W / 2.  If we subtract the image width / 2
                // we get the correct x point.
                var x = bc * INVADER_COLUMN_WIDTH + (INVADER_COLUMN_WIDTH / 2 - useImg.width / 2);

                canvasContext.drawImage(
                    useImg,
                    x + xOffset,
                    y + yOffset);
            }

            arrayIndex++;
        }

        y += INVADER_ROW_HEIGHT;
    }

    if (invBulletActive) {
        canvasContext.beginPath();
        canvasContext.moveTo(invBulletX, invBulletY);
        // TODO this is using player constants.
        canvasContext.lineTo(invBulletX, invBulletY + BULLET_LENGTH);
        canvasContext.strokeStyle = BULLET_COLOR;
        canvasContext.lineWidth = BULLET_WIDTH;
        canvasContext.stroke();
    }
    // debugDrawGrid();
}