var useBorder = false,
    useRound = false,
    useShadow = false,
    displayNone = false,
    visibilityHidden = false,
    opacityDimmed = false,
    backgroundClass = "video-background",
    maskAnimating = false,
    maskClass = "none",
    sizeClass = "none",
    visibilityClass = "none",
    mask = $("#video-mask"),
    video = $("#video-source"),
    wrapper = $("#video-wrapper");

// Call effect routine
function showEffect(effect){

    switch(effect){

        // Border & background
        case "border":
            useBorder = !useBorder;
            swapBorderClasses( useBorder, "video-background-border", false );
            break;
        case "round":
            useRound = !useRound;
            swapBorderClasses( useRound, "video-background-round", true );
            break;
        case "shadow":
            useShadow = !useShadow;
            swapBorderClasses( useShadow, "video-background-shadow", false );
            break;
        case "color":
            swapBackgroundClasses("video-background-solid");
            break;
        case "gradient":
            swapBackgroundClasses("video-background-gradient");
            break;
        case "image":
            swapBackgroundClasses("video-background-image");
            break;
        case "tile":
            swapBackgroundClasses("video-background-tile");
            break;
        case "clear":
            clearClasses();
            break;

        // Masks
        case "mask":
            mask.attr("style", "");
            swapMaskClasses("video-mask-rectangle");
            break;
        case "maskanimated":
            maskAnimating = true;
            mask.attr("style", "");
            swapMaskClasses("video-mask-animated");
            animateMask();
            break;
        case "maskcircle":
            mask.attr("style", "");
            swapMaskClasses("video-mask-circle");
            break;
        case "clearmask":
            clearMaskClasses();
            break;

        // Show & hide
        /*  case "display":
            displayNone = !displayNone;
            swapVisibilityClasses(displayNone, "video-display-none");
            break; */
        case "visibility":
            visibilityHidden = !visibilityHidden;
            swapVisibilityClasses(visibilityHidden, "video-visibility-hidden");
            break;
        case "opacity":
            opacityDimmed = !opacityDimmed;
            swapVisibilityClasses(opacityDimmed, "video-opacity-dimmed");
            break;

        // Change size
        case "small":
            swapSizeClasses("video-size-small");
            break;
        case "medium":
            swapSizeClasses("video-size-medium");
            break;
        case "large":
            swapSizeClasses("video-size-large");
            break;

        // Drag & drop
        case "drag":
            video.draggable();
            break;
        case "dragclear":
            video.draggable("destroy");
            video.position({
                my: "center center",
                at: "center center",
                of: $("#video-wrapper")
            });
            break;
    }
}
// Handle button clicks
$("a[data-effect]").on({
    "click": function(e){
        showEffect($(this).attr('data-effect'));
    }
});

// Border & background utils
function swapBorderClasses( addOrRemove, cls, addToVideo ){
    if( addOrRemove ){
        if( addToVideo ){
            video.addClass(cls);
        }
        wrapper.addClass(cls);
    }else{
        if( addToVideo ){
            video.removeClass(cls);
        }
        wrapper.removeClass(cls);
    }
}

function swapBackgroundClasses( cls ){
    if( backgroundClass !== "video-background" ){
        wrapper.removeClass(backgroundClass);
    }
    backgroundClass = cls;
    wrapper.addClass(backgroundClass);
}

function clearClasses(){
    if( backgroundClass !== "video-background" ){
        wrapper.removeClass(backgroundClass);
    }
    backgroundClass = "video-background";
    useBorder = false;
    useRound = false;
    useShadow = false;
    swapBorderClasses(useBorder, "video-background-border", false);
    swapBorderClasses(useRound, "video-background-round", true);
    swapBorderClasses(useShadow, "video-background-shadow", false);
}

// Mask utils
function swapMaskClasses( cls ){
    if( maskClass !== "none" ){
        mask.removeClass(maskClass);
    }
    maskClass = cls;
    mask.addClass(maskClass);
}

function animateMask(){
    mask.animate({ top: 200 }, {
        duration: 'slow',
        easing: 'swing'
    }).animate({ top: 20 }, {
        duration: 'slow',
        easing: 'swing'
    });
}

function clearMaskClasses(){
    mask.removeClass(maskClass);
    mask.attr("style", "");
    maskClass = "none";
    maskAnimating = false;
}

// Visibility utils
function swapVisibilityClasses( addOrRemove, cls ){
    if( addOrRemove ){
        if( visibilityClass !== "none" ){
            video.removeClass(visibilityClass);
        }
        video.addClass(cls);
    }else{
        video.removeClass(cls);
    }
}

// Size utils
function swapSizeClasses( cls ){
    if( sizeClass !== "none" ){
        video.removeClass(sizeClass);
    }
    if( cls === "video-size-large" ){
        sizeClass = "none";
    }else{
        sizeClass = cls;
        video.addClass(sizeClass);
    }
    video.position({
        my: "center center",
        at: "center center",
        of: $("#video-wrapper")
    });
}
