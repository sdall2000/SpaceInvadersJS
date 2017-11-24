const SPEED = 5;
const BULLET_LENGTH = 10;
const BULLET_WIDTH = 4;
const BULLET_COLOR = '#ff0000';
const BULLET_SPEED = 20;
const PLAYER_OFFSET_FROM_BOTTOM = 40;

function playerClass(whichImage, name) {
    this.x = 75;
    this.y = canvas.height - PLAYER_OFFSET_FROM_BOTTOM;

    this.playersRemaining = 3;

    this.lastValidX;
    this.lastValidY;

    this.myWarriorPic = whichImage;
    this.name = name;

    this.keyHeldLeft = false;
    this.keyHeldRight = false;

    this.controlKeyRight;
    this.controlKeyLeft;
    this.fireKey;

    this.keyCount = 0;

    this.shotActive = false;
    this.shotX;
    this.shotY;

    this.setupInput = function(rightKey, leftKey, fireKey) {
        this.controlKeyRight = rightKey;
        this.controlKeyLeft = leftKey;
        this.fireKey = fireKey;
    }

    this.reset = function() {
        this.keyCount = 0;

        // for (var br = 0; br < WORLD_ROWS; br++) {
        //     for (var bc = 0; bc < WORLD_COLUMNS; bc++) {
        //         var arrayIndex = columnRowToArrayIndex(bc, br);
        //         if (worldGrid[arrayIndex] == TILE_PLAYERSTART) {
        //             worldGrid[arrayIndex] = TILE_GROUND;
        //             this.x = bc * WORLD_W + WORLD_W / 2;
        //             this.y = br * WORLD_H + WORLD_H / 2;
        //
        //             this.lastValidX = this.x;
        //             this.lastValidY = this.y;
        //
        //             // Bail out of this method so one warrior doesn't take both warrior positions in the grid.
        //             return;
        //         }
        //     }
        // }
        //
        // // We got through the loop without finding a place to put the warrior - error.
        // console.log("NO PLAYER START FOUND!");
    }

    this.move = function() {

        // if (this.keyHeldUp) {
        //     this.y -= SPEED;
        // }

        // if (this.keyHeldDown) {
        //     this.y += SPEED
        // }

        if (this.keyHeldRight) {
            this.x += SPEED
        }

        if (this.keyHeldLeft) {
            this.x -= SPEED
        }

        if (this.shotActive) {
            if (!debugFreezeInvaders) {
                this.shotY -= BULLET_SPEED;
                if (this.shotY <= 0) {
                    this.shotActive = false;
                }
            }
        }
    }

    this.draw = function() {
        var useBitmap = this.myWarriorPic;
        canvasContext.drawImage(useBitmap, this.x - useBitmap.width/2, this.y - useBitmap.height/2);
        // drawBitmapCenteredWithRotation(this.myWarriorPic, this.x, this.y, this.angleRadians);

        if (this.shotActive) {
            canvasContext.beginPath();
            canvasContext.moveTo(this.shotX, this.shotY);
            canvasContext.lineTo(this.shotX, this.shotY + BULLET_LENGTH);
            canvasContext.strokeStyle = BULLET_COLOR;
            canvasContext.lineWidth = BULLET_WIDTH;
            canvasContext.stroke();
        }

        for (var i=0; i < this.playersRemaining; i++) {
            canvasContext.drawImage(useBitmap, i * useBitmap.width + i * 5, canvas.height - useBitmap.height - 10);
        }
    }

    this.takeShot = function() {
        if (!this.shotActive) {
            this.shotActive = true;
            this.shotX = this.x;
            this.shotY = this.y;
        }
    }

    this.playerHit = function() {
        this.x = 75;
        this.playersRemaining--;
    }

    // TODO return true if hit?  That way invader can clear the shot.
    this.handleInvaderShot = function(iShotX, iShotY, iShotLength) {
        var hit = false;
        var shipLeft = this.x - this.myWarriorPic.width / 2;
        var shipRight = shipLeft + this.myWarriorPic.width - 1;
        if (iShotX >= shipLeft && iShotX <= shipRight) {
            // Check vertical
            var iShotTip = iShotY + iShotLength;
            if (iShotTip >= this.y && iShotY <= this.y + this.myWarriorPic.height) {
                this.playerHit();
                hit = true;
            }
        }

        return hit;
    }
}