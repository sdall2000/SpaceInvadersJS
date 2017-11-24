var warriorPic = document.createElement("img");

var worldPics = [];

var picsToLoad = 0;

function imageLoaded() {
    picsToLoad--;

    if (picsToLoad == 0) {
        startGame();
    }
};

function beginLoadImage(imageVar, fileName) {
    imageVar.onload = imageLoaded();
    imageVar.src = fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
    worldPics[worldCode] = document.createElement("img");
    beginLoadImage(worldPics[worldCode], fileName);
}

function loadImages() {
    var imageList = [
        {varName: warriorPic, theFile: "images/playerShip.png"},
        {worldType: SMALL_INVADER, theFile: "images/smallInvader1.png"},
        {worldType: MEDIUM_INVADER, theFile: "images/mediumInvader1.png"},
        {worldType: LARGE_INVADER, theFile: "images/largeInvader1.png"},
        {worldType: SMALL_INVADER + ALT_INVADER_OFFSET, theFile: "images/smallInvader2.png"},
        {worldType: MEDIUM_INVADER + ALT_INVADER_OFFSET, theFile: "images/mediumInvader2.png"},
        {worldType: LARGE_INVADER + ALT_INVADER_OFFSET, theFile: "images/largeInvader2.png"},
        {worldType: EXPLODING_INVADER, theFile: "images/invaderExplosion.png"}
    ];

    picsToLoad = imageList.length;

    for (var i=0; i < imageList.length; i++) {
        if (imageList[i].varName != undefined) {
            beginLoadImage(imageList[i].varName, imageList[i].theFile);
        } else {
            loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile)
        }
    }
}