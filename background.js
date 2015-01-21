var localStream, peerID;

function checkStream(vid, span){
  if(localStream){
    vid.src = URL.createObjectURL(localStream);
    vid.play();
    span.innerHTML = 'Still streaming on ' + peerID + '...';
  }
}

function captureStop(span){
  if(localStream){
      span.innerHTML = 'Stopped...';
      localStream.stop();
    }
}

// call tab capture
  function captureTab(vid, span) {
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
              var peer = new Peer('caster', {key: '6ym85ud3e7g8ehfr'});

              peer.on('open', function(id) {
                  peerID = id;
                  span.innerHTML = 'Streaming on ' + peerID + '...';
                  localStream = stream;
                  vid.src = URL.createObjectURL(localStream);
                  vid.play();

                  // Call a peer, providing our mediaStream
                  var call = peer.call('fire', localStream);
                  console.log(call);
              });
            }
        }
        chrome.tabCapture.capture(MediaStreamConstraint, callback);
    });
}

