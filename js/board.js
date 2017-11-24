var highScore = 10100;
var player1Score = 0;

function drawBoard() {
    canvasContext.font = "20px Courier New";
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    canvasContext.fillText("SCORE<1> HI-SCORE SCORE<2>", canvas.width / 2, 20);
    canvasContext.fillText(player1Score + "     " + highScore, canvas.width / 2, 40);
}