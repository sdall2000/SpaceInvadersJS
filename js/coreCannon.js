const SPEED = 5;
const BULLET_LENGTH = 10;
const BULLET_WIDTH = 4;
const BULLET_COLOR = '#ff0000';
const BULLET_SPEED = 20;
const PLAYER_OFFSET_FROM_BOTTOM = 40;

function coreCannonClass(whichImage) {
    this.myCoreCannon = whichImage;

    this.x = 75;
    this.y = canvas.height - PLAYER_OFFSET_FROM_BOTTOM - this.myCoreCannon.height;

    console.log("Height: " + whichImage.height);

    this.playersRemaining = 3;

    this.lastValidX;
    this.lastValidY;

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
            if (this.x > canvas.width) {
                this.x = canvas.width;
            }
        }

        if (this.keyHeldLeft) {
            this.x -= SPEED
            if (this.x < 0) {
                this.x = 0;
            }
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
        var width = this.myCoreCannon.width;
        var height = this.myCoreCannon.height;

        canvasContext.drawImage(this.myCoreCannon, this.x - width/2, this.y - height/2);

        if (this.shotActive) {
            canvasContext.beginPath();
            canvasContext.moveTo(this.shotX, this.shotY);
            canvasContext.lineTo(this.shotX, this.shotY + BULLET_LENGTH);
            canvasContext.strokeStyle = BULLET_COLOR;
            canvasContext.lineWidth = BULLET_WIDTH;
            canvasContext.stroke();
        }

        for (var i=0; i < this.playersRemaining; i++) {
            canvasContext.drawImage(this.myCoreCannon, i * width + i * 5, canvas.height - height - 10);
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
        var shipLeft = this.x - this.myCoreCannon.width / 2;
        var shipRight = shipLeft + this.myCoreCannon.width - 1;
        if (iShotX >= shipLeft && iShotX <= shipRight) {
            // Check vertical
            var iShotTip = iShotY + iShotLength;
            if (iShotTip >= this.y && iShotY <= this.y + this.myCoreCannon.height) {
                this.playerHit();
                hit = true;
            }
        }

        return hit;
    }
}