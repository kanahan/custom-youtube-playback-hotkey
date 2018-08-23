var videoContentLoaded = false;

document.addEventListener("yt-navigate-finish", function (event) {
  if (!videoContentLoaded && document.getElementsByClassName("html5-video-player")[0]) {
    loadViewContent();
  }
});

function loadViewContent() {
  videoContentLoaded = true;

  // ================== Add big element into Youtube video ==================
  // create SpanSpeedRate element
  var SpanSpeedRate = document.createElement("span");
  SpanSpeedRate.classList.add("SpanSpeedRate");

  // create SpanSpeedRate element
  var DivSpanSpeedRate = document.createElement("div");
  DivSpanSpeedRate.classList.add("DivSpanSpeedRate");
  DivSpanSpeedRate.appendChild(SpanSpeedRate);

  // create divSpeedRate element
  var divSpeedRate = document.createElement("div");
  divSpeedRate.classList.add("DivSpeedRate");
  divSpeedRate.appendChild(DivSpanSpeedRate);

  // add div into youtube's element
  var divVideo = document.getElementsByClassName("html5-video-player")[0];
  divVideo.insertBefore(divSpeedRate, divVideo.childNodes[0]);


  // ================== Add static element into Youtube video ==================
  // create pStaticSpeedRate element
  var pStaticSpeedRate = document.createElement("span");
  pStaticSpeedRate.classList.add("PStaticSpeedRate");

  // create divStaticSpeedRate element
  var divStaticSpeedRate = document.createElement("div");
  divStaticSpeedRate.classList.add("DivStaticSpeedRate");
  divStaticSpeedRate.appendChild(pStaticSpeedRate);

  // add div into youtube's element
  var divVideo = document.getElementsByClassName("html5-video-player")[0];
  divVideo.insertBefore(divStaticSpeedRate, divVideo.childNodes[0]);

  getUserStorage();
}

var arrIncreasePlaybackRateKey = [];
var arrDecreasePlaybackRateKey = [];

// ================== Add EventListener ==================
addEventListener('keydown', function (evt) {
  var focusingElement = this.document.activeElement;
  if (focusingElement && (focusingElement.tagName === "INPUT" || focusingElement.tagName === "TEXTAREA")) return false;
  var arrDefaultPlaybackRateKey = ["z", "x"];
  var arrPlayPauseKey = [" "];
  var arrTheaterKey = ["b", "v"];
  var arrFullScreenKey = ["p"];

  var allarr = arrIncreasePlaybackRateKey.concat(arrDecreasePlaybackRateKey, arrDecreasePlaybackRateKey, arrDefaultPlaybackRateKey, arrPlayPauseKey, arrTheaterKey, arrFullScreenKey);
  if (!allarr.includes(evt.key)) {
    return false;
  }

  evt.preventDefault();

  var isUrlContainWatch = window.location.pathname === "/watch";
  var videoElement = document.querySelector("video");

  if (isUrlContainWatch && videoElement && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
    var rate = videoElement.playbackRate;
    if (arrIncreasePlaybackRateKey.includes(evt.key)) {
      rate += 0.25;
    } else if (arrDecreasePlaybackRateKey.includes(evt.key)) {
      rate -= 0.25;
      if (rate < 0.25) rate = 0.25;
    } else if (arrDefaultPlaybackRateKey.includes(evt.key)) {
      rate = 1;
    } else if (arrPlayPauseKey.includes(evt.key)) {
      videoElement.click();
      return false;
    } else if (arrTheaterKey.includes(evt.key)) {
      var btnTheaterMode = this.document.getElementsByClassName("ytp-size-button")[0];
      btnTheaterMode.click();
      return false;
    } else if (arrFullScreenKey.includes(evt.key)) {
      var btnFullScreenMode = this.document.getElementsByClassName("ytp-fullscreen-button")[0];
      btnFullScreenMode.click();
      return false;
    }
    rate = Math.trunc(rate * 4) / 4;
    videoElement.playbackRate = rate;
    updateSpeedRate();
    showUpInFrontEnd(0.3, document.getElementsByClassName("DivSpeedRate")[0]); // show up for 0.3 second
  }
});


// ================== Update pStaticSpeedRate element ==================
function updateSpeedRate() {
  var rate = document.querySelector("video").playbackRate.toFixed(2);
  var pStaticSpeedRate = document.getElementsByClassName("PStaticSpeedRate")[0];
  pStaticSpeedRate.innerHTML = rate;
  var SpanSpeedRate = document.getElementsByClassName("SpanSpeedRate")[0];
  SpanSpeedRate.innerHTML = rate;
  var divSpeedRate = document.getElementsByClassName("DivSpeedRate")[0];

  updateUserStorage(rate);
}

function showUpInFrontEnd(sec, element) {
  element.style.display = "block";
  setTimeout(function () { element.style.display = "none"; }, sec * 1000);
}

function updateUserStorage(rate) {
  chrome.storage.sync.set({ "youtubeSpeedControlSpeedRate": rate });
}

function getUserStorage() {
  // get speed rate
  chrome.storage.sync.get(["youtubeSpeedControlSpeedRate"], function (result) {
    if (Object.keys(result).length) {
      document.querySelector("video").playbackRate = result.youtubeSpeedControlSpeedRate;
      updateSpeedRate();
    }
  });

  // get increment key
  chrome.storage.sync.get(["youtubeSpeedControl_increaseSpeedKey"], function (result) {
    if (Object.keys(result).length) {
      arrIncreasePlaybackRateKey.push(result.youtubeSpeedControl_increaseSpeedKey);
    }
  });

  // get decrement key
  chrome.storage.sync.get(["youtubeSpeedControl_decreaseSpeedKey"], function (result) {
    if (Object.keys(result).length) {
      arrDecreasePlaybackRateKey.push(result.youtubeSpeedControl_decreaseSpeedKey);
    }
  });
}