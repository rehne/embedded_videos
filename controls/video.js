function init() {        // Master function, encapsulates all functions
    var video = document.getElementById("header-vid-s");
    var video2 = document.getElementById("header-vid-sd");
    if (video.canPlayType) {   // testet ob das HTML5 Video-Tag unterstützt wird
        // if successful, display buttons and set up events
        document.getElementById("buttonbar").style.display = "block";

        // helper functions
        //  play video
        function vidplay(evt) {
            button = evt.target; //  get the button id to swap the text based on the state
            if (video.paused) {   // abspielen und Pause-Symbol anzeigen
                video.play();
                button.innerHTML = "&#9724";
            } else {              // pausieren und Play-Symbol anzeigen
                video.pause();
                button.innerHTML = "&#9658";
            }
        }
        //  button helper functions
        //  skip forward, backward, or restart
        function setTime(tValue) {
        //  if no video is loaded, this throws an exception
          try {
              if (tValue == 0) {
                  video.currentTime = tValue;
              } else {
                  video.currentTime += tValue;
              }
           } catch (err) {
               // errMessage(err) // show exception
           errMessage("Video Inhalt wurde nicht geladen");
           }
         }
        // change volume based on incoming value
        function setVol(value) {
            var vol = video.volume;
            vol += value;
            //  test for range 0 - 1 to avoid exceptions
            if (vol >= 0 && vol <= 1) {
                // if valid value, use it
                video.volume = vol;
            } else {
                // otherwise substitute a 0 or 1
                video.volume = (vol < 0) ? 0 : 1;
            }
        }
        //  button events
        //  Play
        document.getElementById("play").addEventListener("click", vidplay, false);
        //  Restart
        document.getElementById("restart").addEventListener("click", function () {
            setTime(0);
        }, false);
        //10 Sekunden zurückspulen
        document.getElementById("rew").addEventListener("click", function () {
            setTime(-10);
        }, false);
        //10 Sekunden vorspulen
        document.getElementById("fwd").addEventListener("click", function () {
            setTime(10);
        }, false);
        //Lautstärke Buttons
        document.getElementById("volDn").addEventListener("click", function () {
            setVol(-.1);                 //Lautstärke um 10% senken
        }, false);
        document.getElementById("volUp").addEventListener("click", function () {
            setVol(.1);                 //Lautstärke um 10% erhöhen
        }, false);
        // playback speed buttons
        document.getElementById("slower").addEventListener("click", function () {
            video.playbackRate -= .25;
        }, false);
        document.getElementById("faster").addEventListener("click", function () {
            video.playbackRate += .25;
        }, false);
        document.getElementById("mute").addEventListener("click", function () {
            if (video.muted) {
                video.muted = false;
            } else {
                video.muted = true;
            }
        }, false);
    }
    if(video2.canPlayType){
      document.getElementById("buttonbar2").style.display = "block";
      function vidPlay2(evt){
        button = evt.target;
        if(video2.paused){
          video2.play();
          button.innerHTML = "&#9724";
        } else {
          video.pause();
          button.innerHTML = "&#9658";
        }
      }
      function setTime2(tValue){
        try{
          if(tValue == 0){
            video2.currentTime = tValue;
          } else {
            video2.currentTime += tValue;
          }
        } catch(err){
          errMessage("Video Inhalt wurde nicht geladen")
        }
      }
      function setVol2(value){
        var vol = video2.volume;
        vol += value;
        if(vol >= 0 && vol <= 1){
          video2.volume = vol;
        } else {
          video2.volume = (vol < 0) ? 0 : 1;
        }
      }
      document.getElementById("play2").addEventListener("click", vidPlay2, false);
      document.getElementById("restart2").addEventListener("click", function(){
        setTime2(0);
      }, false);
      document.getElementById("rew2").addEventListener("click", function(){
        setTime2(-10);
      }, false);
      document.getElementById("fwd2").addEventListener("click", function(){
        setTime2(10);
      }, false);
      document.getElementById("volDn2").addEventListener("click", function(){
        setVol2(-.1);
      }, false);
      document.getElementById("volUp2").addEventListener("click", function(){
        setVol2(.1);
      }, false);
      document.getElementById("slower2").addEventListener("click", function(){
        video2.playbackRate -= .25;
      }, false);
      document.getElementById("faster2").addEventListener("click", function(){
        video2.playbackRate += .25;
      }, false);
      document.getElementById("mute2").addEventListener("click", function(){
        if(video2.muted){
          video2.muted = false;
        } else {
          video2.muted = true;
        }
      }, false);
    }
}// end of master
