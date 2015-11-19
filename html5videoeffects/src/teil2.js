var useTouch = false,
    animatedIn = false,
    flippedIn = false,
    faded = false,
    canvasShowing = false,
    transitioned = false,
    mask = $("#video-mask"),
    video = $("#video-source"),
    wrapper = $("#video-wrapper");

// Call effect routine
function showEffect(effect){

    if( effect == "color" ||
        effect == "tile" ){
        showVideo(false);
    }else{
        showVideo(true);
    }
    switch(effect){

        //--------------------
        // CSS transformations

        case "rotate":
            video.removeClass().addClass("transition video-rotate");
            break;

        case "skew":
            video.removeClass().addClass("transition video-skew");
            break;

        case "scale":
            video.removeClass().addClass("transition video-scale");
            break;

        case "translate":
            video.removeClass().addClass("transition video-translate");
            break;

        case "cleartransform":
            video.removeClass().addClass("transition");
            break;

        //--------------------
        // CSS transitions & animations

        case "fade":
            faded = !faded;
            transitioned = false;
            video.removeClass().addClass("transition");
            video.css({
                'left': 0,
                'opacity': faded ? 0.1 : 1
            });
            break;

        case "transition":
            faded = false;
            transitioned = !transitioned;
            video.removeClass().addClass("animated "+ (transitioned ? "fadeOutLeftBig" : "fadeInRightBig"));
            break;

        case "animation":
            animatedIn = !animatedIn;
            video.css({
                'left': 0,
                'opacity': 1
            });
            video.removeClass().addClass("animated "+ (animatedIn ? "bounceIn" : "bounceInDown"));
            break;

        case "3D":
            flippedIn = !flippedIn;
            video.removeClass().addClass("animated "+ (flippedIn ? "flip" : "flipInY"));
            break;

        //--------------------
        // Canvas effects

        case "color":
            drawGrayscaleVideo();
            break;

        case "tile":
            drawTiles();
            break;
    }
}
// Handle button clicks
$('a[data-effect]').click(function(){
    showEffect($(this).attr('data-effect'));
});

//--------------------
// Canvas effects

function showVideo(b){

    clearTimeout(timer);
    clearTimeout(timer2);

    if( b && canvasShowing ){
        canvasShowing = false;
        video.removeClass("display-none");
        $(canvasToDraw).addClass("display-none");
    }else if( !b && !canvasShowing ){
        canvasShowing = true;
        video.addClass("display-none");
        $(canvasToDraw).removeClass("display-none");
    }
}

function drawGrayscaleVideo(){
    if( video[0].paused || video[0].ended ){
        return;
    }
    // Draw video to canvas
    draw.drawImage(video[0],0,0,video[0].width, video[0].height);

    try{
        var imgd = draw.getImageData(0, 0, canvasToDraw.width, canvasToDraw.height);
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
            pix[i  ] = grayscale;   // red
            pix[i+1] = grayscale;   // green
            pix[i+2] = grayscale;   // blue
            // alpha
        }
        draw.putImageData(imgd, 0, 0);
    }catch(e){
        // fail silently if played locally
    }
    // Repeat at 30 fps
    timer2 = setTimeout(drawColoredVideo, 1000/30);
}

var canvasToCopy = $("#video-copy")[0],
    copy = canvasToCopy.getContext("2d"),
    canvasToDraw = $("#video-output")[0],
    draw = canvasToDraw.getContext("2d"),
    rows = 3,
    cols = 5,
    space = 4,
    tileWidth = Math.round(canvasToCopy.width/cols),
    tileHeight = Math.round(canvasToCopy.height/rows),
    tileCenterX = tileWidth/ 2,
    tileCenterY = tileHeight/ 2,
    tiles = [],
    timer = null,
    timer2 = null,
    dragging = false,
    dragPoint = {x:0, y:0},
    selectedTile = null,
    topIndex = 0

// Calculate tile layout
function buildTiles(){

    var tileX = 0;
    var tileY = 0;
    var row = 0;
    var col = 0;

    for(var i=0; i<rows; i++){
        for(var j=0; j<cols; j++){

            // Save a tile object containing the location of the
            // tile in the original video frame, the start (reset) location
            // on the output canvas, the current location on the canvas (x and y),
            // and the zindex and dragPoint for drag operations
            var tile = {
                videoX: tileX,
                videoY: tileY,
                originX: (tileCenterX+tileX)+(space*col),
                originY: (tileCenterY+tileY)+(space*row),
                zindex: topIndex,
                dragPoint: {x:0, y:0}
            };
            tile.x = tile.originX;
            tile.y = tile.originY;
            tiles.push(tile);
            tileX += tileWidth;
            topIndex++;
            col++;
        }
        row++;
        col = 0;
        tileX = 0;
        tileY += tileHeight;
    }
}
buildTiles();

function drawTiles() {
    if (video[0].paused || video[0].ended) {
        return;
    }
    // Draw the current video frame into the invisible canvas
    copy.drawImage(video[0], 0, 0, canvasToCopy.width, canvasToCopy.height);

    // Clear the output canvas
    draw.clearRect(0, 0, canvasToDraw.width, canvasToDraw.height);

    // Copy tiles from invisible canvas and draw them to the output canvas
    var len = tiles.length;
    for(var n=0; n<len; n++){
        var tile = tiles[n];
        draw.save();
        draw.translate(tile.x, tile.y);
        draw.drawImage(canvasToCopy, tile.videoX, tile.videoY, tileWidth, tileHeight, -tileCenterX, -tileCenterY, tileWidth, tileHeight);
        draw.restore();
    }
    // Draw video on an interval
    timer = setTimeout(drawTiles, 1000/30);
}

//--------------------
// Drag and drop functionality:

// Start dragging the top-most tile under the mouse point
function startDrag(e){

    var tilesUnderPoint = [];
    var len = tiles.length;
    var offset = $(canvasToDraw).offset();
    dragPoint = {x: e.pageX-offset.left, y: e.pageY-offset.top};

    // Save all tiles under mouse point for evaluation
    for(var n=0; n<len; n++){
        var tile = tiles[n];
        if((tile.x-tileCenterX <= dragPoint.x && (tile.x+tileCenterX) >= dragPoint.x) &&
                (tile.y-tileCenterY <= dragPoint.y && (tile.y+tileCenterY) >= dragPoint.y)){
            tilesUnderPoint.push(tile);
        }
    }
    // If one or more tiles are selected, find the tile at the
    // top zindex, then set the order of the array based on zindex.
    // Placing the selected tile at the end of the drawing order
    // ensures that it will be drawn above the other tiles while
    // dragging.
    if( tilesUnderPoint.length > 0 ){
        function sortZIndex(a, b){
            return a.zindex- b.zindex;
        }
        dragging = true;
        topIndex++;
        tilesUnderPoint.sort(sortZIndex);
        selectedTile = tilesUnderPoint.pop();
        selectedTile.dragPoint = {x:selectedTile.x, y:selectedTile.y};
        selectedTile.zindex = topIndex;
        tiles.sort(sortZIndex);
    }
}
$(window).on("mousedown", startDrag);

// Update coordinates while dragging
function drag(e){
    if (dragging) {
        var offset = $(canvasToDraw).offset();
        selectedTile.x = selectedTile.dragPoint.x + ((e.pageX-offset.left) - dragPoint.x);
        selectedTile.y = selectedTile.dragPoint.y + ((e.pageY-offset.top) - dragPoint.y);
    }
}
$(window).on("mousemove", drag);

// Reset variables on drag release
function endDrag(e){
    dragging = false;
    selectedTile = null;
}
$(window).on("mouseup", endDrag);

// Reset tiles to their original location on double-click
function resetTiles(e){
    var len = tiles.length;
    for(var n=0; n<len; n++){
        var tile = tiles[n];
        tile.x = tile.originX;
        tile.y = tile.originY;
    }
}
$(window).on("dblclick ", resetTiles);
