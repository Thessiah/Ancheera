(function() {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.notification) {
      chrome.notifications.create(message.notification);
      var sound = new Audio("notification.wav");
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
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {pageLoad: tabs[0].url});
          sendResponse({pageLoad: tabs[0].url});
      });
      return true;
    }
    if(message.consoleLog) {
      console.log(message.consoleLog.sender + ': ' + message.consoleLog.message);
    }
    if(message.gameStart) {
    }
    if(message.assault) {
      devtoolsPort.postMessage({assault: message.assault});
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
})();