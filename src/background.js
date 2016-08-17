(function() {
  var currTabID = -1;
  var currURL = '';
  var pageLoaded = true;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.notification) {
      chrome.notifications.create(message.notification);
      var sound = new Audio('src/assets/sounds/notification.wav');
      sound.play();
    }
    if(message.setCookie) {
      chrome.cookies.set(message.setCookie);
    }
    if(message.getCookie) {
      chrome.cookies.get(message.getCookie, function(cookie) {
        sendResponse({cookie: cookie});
      });
      return true;
    }
    if(message.getCookies) {
      chrome.cookies.getAll(message.getCookies, function(cookies) {
        sendResponse({cookies: cookies});
      });
      return true;
    }
    if(message.pageLoad) {
      //chrome.storage.sync.set({'test': true});
      pageLoaded = true;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {pageLoad: tabs[0].url});
          sendResponse({pageLoad: tabs[0].url});
        }
      });
      return true;
    }
    if(message.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, message.tabs , function(response) {
            sendResponse(response);
          });
        }
      });
      return true;
    }
    if(message.openURL) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if(tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, message.openURL);
        }
      });
      return true;
    }
    // if(message.enterQuest) {
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    //     if(tabs.length > 0) {
    //       chrome.tabs.sendMessage(tabs[0].id, message , function(response) {
    //         console.log(response);
    //         sendResponse(response);
    //       });
    //     }
    //   });
    //   return true;
    // }

    if(message.consoleLog) {
      console.log(message.consoleLog.sender + ': ' + message.consoleLog.message);
    }
    if(message.devtools) {
      devtoolsPort.postMessage(message.devtools);
    }
    // if(message.assault) {
    //   devtoolsPort.postMessage({assault: message.assault});
    // }
    // if(message.angel) {
    //   devtoolsPort.postMessage({angel: message.angel});
    // }
    // if(message.defense) {
    //   devtoolsPort.postMessage({defense: message.defense});
    // }
    if(message.refresh) {
      pageLoaded = false;
    }
  });
  var devtoolsPort;
  chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    devtoolsPort = port;
    port.onMessage.addListener(function(msg) {
        console.log('Received message from devtools page', msg);
    });
  });
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tab.url.indexOf('gbf.game.mbga.jp') !== -1) {
      if(currURL !== tab.url) {
        pageLoaded = false;
        currURL = tab.url;
      }
      if(currURL === tab.url && pageLoaded) {
        console.log('page updated');
        chrome.tabs.sendMessage(tabId, {pageUpdate: tab.url});
      }

    }
  });
})();