(function() {
  window.Message = {
    Notify: function(title, message) {
      chrome.runtime.sendMessage({notification: {
        type: 'basic',
        title: title,
        message: message,
        iconUrl: '../../anchiraicon.png' 
      }});
    },
    SetCookie: function(name, value) {
      chrome.runtime.sendMessage({setCookie: {
        name: name,
        url: 'http://gbf.game.mbga.jp/',
        value: value.toString(),
        expirationDate: Date.now() / 1000 + 2419200
      }});
    },
    GetCookie: function(name, sendResponse) {
      chrome.runtime.sendMessage({getCookie: {
        name: name,
        url: 'http://gbf.game.mbga.jp/'
      }}, function(response) {
        
        sendResponse(response.cookie);
      });
    },
    // GetCookies: function(names, sendResponse) {

    //   for(var i = 0; i < names.length; i++) {
    //     chrome.runtime.sendMessage({getCookies: {
    //       name: names,
    //       url: 'http://gbf.game.mbga.jp/'
    //     }}, function(response) {
    //       sendResponse(response.cookies);
    //     });
    //   }
    // },
    ConsoleLog: function(sender, message) {
      chrome.runtime.sendMessage({consoleLog: {
        sender: sender,
        message: message
      }});
    }
  };
  var port = chrome.runtime.connect({name: 'devtools'});
    port.onMessage.addListener(function(msg) {
      if(msg.assault) {
        // if(msg.assault === parseInt(msg.assault, 10)) {
        //   Message.ConsoleLog('message', 'curr assault time');
        //   Time.SetAssaultTime(-1, -1);
        // } else {
          Time.SetAssaultTime(msg.assault.slot, msg.assault.hour);
        //}
      }
  });
})();