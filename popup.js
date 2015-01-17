var vid, span, localStream;

document.addEventListener('DOMContentLoaded', function () {
  span = document.createElement('span');
  vid = document.createElement('video');
  span.innerHTML = "stream";
  document.body.appendChild(span);
  document.body.appendChild(vid);

  // start streaming clicked
  document.getElementById('start').addEventListener("click", function(){
        captureTab();
        span.innerHTML = 'Streaming...';
  });

  // stop streaming clicked
  document.getElementById('stop').addEventListener("click", function(){
    if(localStream){
    	span.innerHTML = 'Streaming stopped...';
        localStream.stop();
	}
  });
});

// call tab capture
  function captureTab() {
    chrome.tabs.query({active: true}, function (tab) {
        var MediaStreamConstraint = {
            audio: true,
            video: true,
            videoConstraints: {
                mandatory: {
                    chromeMediaSource: 'tab'
                }
            }
        };

        function callback(stream) {
            if (!stream) {
                span.innerHTML = 'Unable to capture the tab. Note that Chrome internal pages cannot be captured.';
                return;
            } else {
            	localStream = stream;
            	vid.src = URL.createObjectURL(localStream);
            	vid.play();
            }
        }
        chrome.tabCapture.capture(MediaStreamConstraint, callback);
    });
}


