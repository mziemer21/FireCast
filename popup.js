// Run our kitten generation script as soon as the document's DOM is ready.
function reloadExtension(id) {
    if (id) {
        chrome.management.setEnabled(id, false, function() {
            chrome.management.setEnabled(id, true);
        });
    } else {
        if (confirm("No extension selected! Want to choose one?")) {
            window.open(chrome.extension.getURL('/options.html'));
        }
    }
}

var id = localStorage.getItem('id');
if (typeof id == "string" && id.length >= "32") {
    chrome.management.get(id, function(result) {
        chrome.browserAction.setTitle({title:"Reload extension:\n" + result.name + "  " + result.version});
    });
}

document.addEventListener('DOMContentLoaded', function () {
  var localStream;
  var span = document.createElement('span');
  //var vid = document.createElement('video');
  span.innerHTML = "stream";
  document.body.appendChild(span);
  //document.body.appendChild(vid);

  // start streaming clicked
  document.getElementById('start').addEventListener("click", function(){
    if (localStorage['broadcasting'] == undefined) {
        localStorage.setItem('broadcasting', true);
        window.isSharingTab = true;
        captureTab();

        chrome.contextMenus.update('000007', {
            title: 'Stop sharing this tab.'
        });
        span.innerHTML = 'Tab sharing started...';
    } else {
      
        span.innerHTML = 'Tab already sharing...';
        return;
    }
  });

  document.getElementById('stop').addEventListener("click", function(){
    localStorage.removeItem('broadcasting');
        window.isSharingTab = false;

        span.innerHTML = 'Tab sharing stopped...';
  });
});


function captureTab() {
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
                console.error('Unable to capture the tab. Note that Chrome internal pages cannot be captured.');
                return;
            }

            //do something here
        }

        chrome.tabCapture.capture(MediaStreamConstraint, callback);
    });
}