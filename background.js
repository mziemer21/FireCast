var localStream, peer;

function checkStream(vid, span){
  if(localStream){
    span.innerHTML = 'Still streaming on ' + peerID + '...';
  }
}

function captureStop(span){
  if(localStream){
    span.innerHTML = 'Stopped...';
    localStream.stop();
  }
  if(peer){
    peer.destroy();
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
                    chromeMediaSource: 'tab',
                    minWidth: 1280,
                    minHeight: 720,
                    
                    maxWidth: 1920,
                    maxHeight: 1080,
                    
                    minAspectRatio: 1.77
                }
            }
        };

        function callback(stream) {
            if (!stream) {
                span.innerHTML = 'Unable to capture the tab. Note that Chrome internal pages cannot be captured.';
                return;
            } else {
              peer = new Peer({key: '6ym85ud3e7g8ehfr', debug: 3});

              peer.on('open', function(id) {
                  peerID = id;
                  span.innerHTML = 'Streaming on ' + peerID + '...';
                  localStream = stream;
                  vid.src = URL.createObjectURL(localStream);
                  vid.play();

                  // Call a peer, providing our mediaStream
                  var call = peer.call('fire2', localStream);
              });

              peer.on('error', function(err) {
                if(err == 'unavailable-id'){
                  console.log('attampting reconnect');
                  peer.reconnect();
                } else if(err == 'peer-unavailable'){
                  span.innerHTML = "Could not find the firestick.  Do you have the app open?";
                }
              });
            }
        }
        chrome.tabCapture.capture(MediaStreamConstraint, callback);
    });
}

