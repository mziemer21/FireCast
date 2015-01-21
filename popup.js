var vid, span;

document.addEventListener('DOMContentLoaded', function () {
  span = document.createElement('span');
  vid = document.createElement('video');
  span.innerHTML = "stream";
  document.body.appendChild(span);
  document.body.appendChild(vid);
  var BGPage = chrome.extension.getBackgroundPage();
  BGPage.checkStream(vid, span);

  // start streaming clicked
  document.getElementById('start').addEventListener("click", function(){
    span.innerHTML = "Starting..."
    BGPage.captureTab(vid, span);
  });

  // stop streaming clicked
  document.getElementById('stop').addEventListener("click", function(){
    span.innerHTML = "Stopping..."
    BGPage.captureStop(span);
  });
});

